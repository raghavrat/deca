#!/usr/bin/env node

import { readFile } from 'node:fs/promises'
import { cert, deleteApp, initializeApp } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'

function usage() {
  return [
    'Usage:',
    '  Direct: node --env-file=.env.local scripts/migrateFirebaseUsersToClerk.mjs --firebase [--execute]',
    '  Export: node --env-file=.env.local scripts/migrateFirebaseUsersToClerk.mjs --users /secure/firebase-users.json --profiles /secure/profile-consents.json [--execute]',
  ].join('\n')
}

function getArgument(name) {
  const index = process.argv.indexOf(name)
  return index >= 0 ? process.argv[index + 1] : undefined
}

function consentDate(value) {
  if (typeof value === 'string' && !Number.isNaN(Date.parse(value))) return new Date(value)
  if (typeof value === 'number' && Number.isFinite(value)) return new Date(value)
  if (value && typeof value === 'object') {
    if (typeof value.toDate === 'function') return value.toDate()
    const seconds = value._seconds ?? value.seconds
    if (typeof seconds === 'number' && Number.isFinite(seconds)) return new Date(seconds * 1000)
  }
  return null
}

function requiredEnvironment(name) {
  const value = process.env[name]
  if (!value) throw new Error(`${name} is required`)
  return value
}

function stringValue(value) {
  if (typeof value === 'string') return value
  if (Buffer.isBuffer(value)) return value.toString('base64')
  return ''
}

function usernameFor(user) {
  const emailLocalPart = typeof user.email === 'string' ? user.email.split('@')[0] : ''
  let stem = emailLocalPart
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_+|_+$/g, '')
  if (!/[a-z]/.test(stem)) stem = `user_${stem}`
  if (!stem) stem = 'user'

  const suffix = String(user.localId)
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .slice(-10) || 'account'
  return `${stem.slice(0, 52)}_${suffix}`.slice(0, 64)
}

function buildPasswordDigest(user, hashConfig) {
  const hash = stringValue(user.passwordHash)
  const salt = stringValue(user.salt)
  if (!hash || !salt) return null

  const signerKey = stringValue(hashConfig.signerKey)
  const saltSeparator = stringValue(hashConfig.saltSeparator)
  const rounds = String(hashConfig.rounds ?? '')
  const memoryCost = String(hashConfig.memoryCost ?? '')
  if (!signerKey || !rounds || !memoryCost) {
    throw new Error('Firebase password-hash configuration is incomplete')
  }
  return [hash, salt, signerKey, saltSeparator, rounds, memoryCost].join('$')
}

function buildClerkPayload(user, profile, hashConfig) {
  const uid = user.localId
  const email = typeof user.email === 'string' ? user.email.trim().toLowerCase() : ''
  if (typeof uid !== 'string' || !uid || uid.length > 128 || uid.includes('/')) {
    throw new Error('Firebase contains a user with an invalid UID')
  }
  if (!email || !email.includes('@')) return { skip: 'no-email' }
  if (user.emailVerified !== true) return { skip: 'unverified-email' }

  const acceptedAt = consentDate(profile?.termsAcceptedAt)
  const hasConsent = profile?.age13Confirmed === true && acceptedAt !== null

  const passwordDigest = buildPasswordDigest(user, hashConfig)
  const createdAt = Number(user.createdAt)
  return {
    payload: {
      external_id: uid,
      email_address: [email],
      username: usernameFor(user),
      ...(hasConsent
        ? { legal_accepted_at: acceptedAt.toISOString() }
        : { skip_legal_checks: true }),
      ...(passwordDigest
        ? { password_digest: passwordDigest, password_hasher: 'scrypt_firebase' }
        : { skip_password_requirement: true }),
      ...(Number.isFinite(createdAt) ? { created_at: new Date(createdAt).toISOString() } : {}),
      unsafe_metadata: hasConsent
        ? {
            age13Confirmed: true,
            termsAcceptedAt: acceptedAt.toISOString(),
            privacyPolicyVersion: profile.privacyPolicyVersion || '2026-07-20',
          }
        : {
            migrationRequiresConsent: true,
          },
      private_metadata: {
        migratedFrom: 'firebase',
        legacyFirebaseUid: uid,
      },
    },
    hasPassword: Boolean(passwordDigest),
    needsConsent: !hasConsent,
  }
}

function decodeServiceAccount() {
  let parsed
  try {
    parsed = JSON.parse(Buffer.from(requiredEnvironment('FIREBASE_SERVICE_ACCOUNT_BASE64'), 'base64').toString('utf8'))
  } catch {
    throw new Error('FIREBASE_SERVICE_ACCOUNT_BASE64 is not a valid base64-encoded service account')
  }
  if (!parsed?.project_id || !parsed?.client_email || !parsed?.private_key) {
    throw new Error('FIREBASE_SERVICE_ACCOUNT_BASE64 is missing required service-account fields')
  }
  return parsed
}

async function getFirebaseHashConfig(app, projectId) {
  const token = await app.options.credential.getAccessToken()
  const response = await fetch(
    `https://identitytoolkit.googleapis.com/admin/v2/projects/${encodeURIComponent(projectId)}/config`,
    { headers: { Authorization: `Bearer ${token.access_token}` } },
  )
  if (!response.ok) {
    throw new Error(`Could not read Firebase password-hash configuration (HTTP ${response.status}). The service account needs firebaseauth.configs.getHashConfig.`)
  }
  const config = await response.json()
  const hashConfig = config?.signIn?.hashConfig
  if (!hashConfig || hashConfig.algorithm !== 'SCRYPT') {
    throw new Error('Firebase is not using the expected SCRYPT password-hash configuration')
  }
  return hashConfig
}

async function loadFirebaseDirectly() {
  const serviceAccount = decodeServiceAccount()
  const app = initializeApp({ credential: cert(serviceAccount) }, `clerk-migration-${Date.now()}`)
  try {
    const [hashConfig, profileSnapshot] = await Promise.all([
      getFirebaseHashConfig(app, serviceAccount.project_id),
      getFirestore(app).collection('users').get(),
    ])

    const profiles = Object.fromEntries(profileSnapshot.docs.map(doc => [doc.id, doc.data()]))
    const users = []
    let pageToken
    do {
      const page = await getAuth(app).listUsers(1000, pageToken)
      users.push(...page.users.map(user => ({
        localId: user.uid,
        email: user.email,
        emailVerified: user.emailVerified,
        passwordHash: user.passwordHash,
        salt: user.passwordSalt,
        displayName: user.displayName,
        createdAt: user.metadata.creationTime,
      })))
      pageToken = page.pageToken
    } while (pageToken)

    return { users, profiles, hashConfig }
  } finally {
    await deleteApp(app)
  }
}

async function loadFirebaseExports(usersPath, profilesPath) {
  const [usersExport, profiles] = await Promise.all([
    JSON.parse(await readFile(usersPath, 'utf8')),
    JSON.parse(await readFile(profilesPath, 'utf8')),
  ])
  const users = Array.isArray(usersExport) ? usersExport : usersExport.users
  if (!Array.isArray(users)) throw new Error('The Firebase export must contain a users array')
  if (!profiles || typeof profiles !== 'object' || Array.isArray(profiles)) {
    throw new Error('The profile consent export must be keyed by Firebase UID')
  }
  return {
    users,
    profiles,
    hashConfig: {
      algorithm: 'SCRYPT',
      signerKey: requiredEnvironment('FIREBASE_SCRYPT_SIGNER_KEY'),
      saltSeparator: requiredEnvironment('FIREBASE_SCRYPT_SALT_SEPARATOR'),
      rounds: requiredEnvironment('FIREBASE_SCRYPT_ROUNDS'),
      memoryCost: requiredEnvironment('FIREBASE_SCRYPT_MEM_COST'),
    },
  }
}

async function clerkRequest(path, options = {}) {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const response = await fetch(`https://api.clerk.com${path}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${requiredEnvironment('CLERK_SECRET_KEY')}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })
    if (response.ok) return response.json()

    if (response.status === 429 && attempt < 4) {
      const retryAfterSeconds = Number(response.headers.get('retry-after'))
      const delayMs = Number.isFinite(retryAfterSeconds)
        ? Math.max(250, retryAfterSeconds * 1000)
        : 500 * (2 ** attempt)
      await new Promise(resolve => setTimeout(resolve, delayMs))
      continue
    }

    const requestId = response.headers.get('x-request-id')
    throw new Error(`Clerk API request failed (HTTP ${response.status}${requestId ? `, request ${requestId}` : ''})`)
  }
  throw new Error('Clerk API rate limit did not clear after five attempts')
}

async function loadClerkUsers() {
  const users = []
  const limit = 500
  for (let offset = 0; ; offset += limit) {
    const page = await clerkRequest(`/v1/users?limit=${limit}&offset=${offset}`)
    const pageUsers = Array.isArray(page) ? page : page.data
    if (!Array.isArray(pageUsers)) throw new Error('Clerk returned an unexpected users response')
    users.push(...pageUsers)
    if (pageUsers.length < limit) return users
  }
}

function indexClerkUsers(users) {
  const byExternalId = new Map()
  const byEmail = new Map()
  for (const user of users) {
    if (typeof user.external_id === 'string' && user.external_id) byExternalId.set(user.external_id, user)
    for (const email of user.email_addresses || []) {
      if (typeof email.email_address === 'string') byEmail.set(email.email_address.toLowerCase(), user)
    }
  }
  return { byExternalId, byEmail }
}

async function linkExistingClerkUser(user, payload) {
  const recordedAcceptedAt = consentDate(user.unsafe_metadata?.termsAcceptedAt)
  const alreadyConsented = user.unsafe_metadata?.age13Confirmed === true && recordedAcceptedAt !== null
  await clerkRequest(`/v1/users/${encodeURIComponent(user.id)}/metadata`, {
    method: 'PATCH',
    body: JSON.stringify({
      unsafe_metadata: alreadyConsented
        ? { migrationRequiresConsent: null }
        : payload.unsafe_metadata,
      private_metadata: payload.private_metadata,
    }),
  })
  await clerkRequest(`/v1/users/${encodeURIComponent(user.id)}`, {
    method: 'PATCH',
    body: JSON.stringify({
      external_id: payload.external_id,
      ...(alreadyConsented && !user.legal_accepted_at
        ? { legal_accepted_at: recordedAcceptedAt.toISOString() }
        : {}),
      ...(!user.password_enabled && payload.password_digest
        ? {
            password_digest: payload.password_digest,
            password_hasher: payload.password_hasher,
          }
        : {}),
    }),
  })
}

async function reconcileRecordedConsent(user) {
  const recordedAcceptedAt = consentDate(user.unsafe_metadata?.termsAcceptedAt)
  if (user.unsafe_metadata?.age13Confirmed !== true || !recordedAcceptedAt) return false

  let changed = false
  if (!user.legal_accepted_at) {
    await clerkRequest(`/v1/users/${encodeURIComponent(user.id)}`, {
      method: 'PATCH',
      body: JSON.stringify({ legal_accepted_at: recordedAcceptedAt.toISOString() }),
    })
    changed = true
  }
  if (user.unsafe_metadata?.migrationRequiresConsent === true) {
    await clerkRequest(`/v1/users/${encodeURIComponent(user.id)}/metadata`, {
      method: 'PATCH',
      body: JSON.stringify({ unsafe_metadata: { migrationRequiresConsent: null } }),
    })
    changed = true
  }
  return changed
}

async function reconcileMissingPassword(user, payload) {
  if (user.password_enabled || !payload.password_digest) return false
  await clerkRequest(`/v1/users/${encodeURIComponent(user.id)}`, {
    method: 'PATCH',
    body: JSON.stringify({
      password_digest: payload.password_digest,
      password_hasher: payload.password_hasher,
    }),
  })
  user.password_enabled = true
  return true
}

async function main() {
  const usersPath = getArgument('--users')
  const profilesPath = getArgument('--profiles')
  const direct = process.argv.includes('--firebase')
  const execute = process.argv.includes('--execute')
  if ((!direct && (!usersPath || !profilesPath)) || (direct && (usersPath || profilesPath))) {
    throw new Error(usage())
  }
  if (execute && process.env.CLERK_MIGRATION_CONFIRM !== 'IMPORT_TO_CLERK') {
    throw new Error('Set CLERK_MIGRATION_CONFIRM=IMPORT_TO_CLERK before using --execute')
  }

  const { users, profiles, hashConfig } = direct
    ? await loadFirebaseDirectly()
    : await loadFirebaseExports(usersPath, profilesPath)

  const prepared = []
  const skipped = { 'no-email': 0, 'unverified-email': 0 }
  let passwordUsers = 0
  let passwordlessUsers = 0
  let pendingConsentUsers = 0
  for (const user of users) {
    const result = buildClerkPayload(user, profiles[user.localId], hashConfig)
    if (result.skip) {
      skipped[result.skip] += 1
    } else {
      prepared.push(result.payload)
      if (result.hasPassword) passwordUsers += 1
      else passwordlessUsers += 1
      if (result.needsConsent) pendingConsentUsers += 1
    }
  }

  console.log(`Firebase accounts found: ${users.length}.`)
  console.log(`Validated for migration: ${prepared.length} (${passwordUsers} password, ${passwordlessUsers} passwordless).`)
  console.log(`Consent status: ${prepared.length - pendingConsentUsers} already recorded, ${pendingConsentUsers} must confirm on first Clerk session.`)
  console.log(`Skipped: ${skipped['no-email']} without email, ${skipped['unverified-email']} unverified.`)
  if (!execute) {
    console.log('Dry run complete. No user data was sent to Clerk.')
    return
  }

  const clerkUsers = await loadClerkUsers()
  const { byExternalId, byEmail } = indexClerkUsers(clerkUsers)
  let created = 0
  let linked = 0
  let existing = 0
  let consentReconciled = 0
  let passwordsReconciled = 0
  for (const payload of prepared) {
    const existingUser = byExternalId.get(payload.external_id)
    if (existingUser) {
      if (await reconcileRecordedConsent(existingUser)) consentReconciled += 1
      if (await reconcileMissingPassword(existingUser, payload)) passwordsReconciled += 1
      existing += 1
      continue
    }

    const email = payload.email_address[0]
    const sameEmailUser = byEmail.get(email)
    if (sameEmailUser) {
      await linkExistingClerkUser(sameEmailUser, payload)
      sameEmailUser.external_id = payload.external_id
      byExternalId.set(payload.external_id, sameEmailUser)
      linked += 1
      continue
    }

    const createdUser = await clerkRequest('/v1/users', { method: 'POST', body: JSON.stringify(payload) })
    byExternalId.set(payload.external_id, createdUser)
    byEmail.set(email, createdUser)
    created += 1
  }
  console.log(`Migration complete: ${created} created, ${linked} existing accounts linked, ${existing} already migrated, ${consentReconciled} prior consent records reconciled, ${passwordsReconciled} missing passwords restored.`)
}

main().catch(error => {
  console.error(error instanceof Error ? error.message : 'Migration failed')
  process.exitCode = 1
})
