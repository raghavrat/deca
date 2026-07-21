#!/usr/bin/env node

import { readFile } from 'node:fs/promises'

function usage() {
  return 'Usage: node scripts/migrateFirebaseUsersToClerk.mjs --users /secure/firebase-users.json --profiles /secure/profile-consents.json [--execute]'
}

function getArgument(name) {
  const index = process.argv.indexOf(name)
  return index >= 0 ? process.argv[index + 1] : undefined
}

function consentDate(value) {
  if (typeof value === 'string' && !Number.isNaN(Date.parse(value))) return new Date(value)
  if (typeof value === 'number' && Number.isFinite(value)) return new Date(value)
  if (value && typeof value === 'object') {
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

function buildPasswordDigest(user) {
  const hash = user.passwordHash
  const salt = user.salt
  if (typeof hash !== 'string' || typeof salt !== 'string' || !hash || !salt) return null

  return [
    hash,
    salt,
    requiredEnvironment('FIREBASE_SCRYPT_SIGNER_KEY'),
    requiredEnvironment('FIREBASE_SCRYPT_SALT_SEPARATOR'),
    requiredEnvironment('FIREBASE_SCRYPT_ROUNDS'),
    requiredEnvironment('FIREBASE_SCRYPT_MEM_COST'),
  ].join('$')
}

function buildClerkPayload(user, profile) {
  const uid = user.localId
  const email = typeof user.email === 'string' ? user.email.trim().toLowerCase() : ''
  if (typeof uid !== 'string' || !uid || uid.length > 128 || uid.includes('/')) {
    throw new Error('Firebase export contains an invalid localId')
  }
  if (!email || !email.includes('@')) throw new Error(`Firebase user ${uid} has no valid email`)
  if (user.emailVerified !== true) return { skip: 'unverified-email' }

  const acceptedAt = consentDate(profile?.termsAcceptedAt)
  if (profile?.age13Confirmed !== true || !acceptedAt) {
    throw new Error(`Firebase user ${uid} is missing the required age or policy consent record`)
  }

  const passwordDigest = buildPasswordDigest(user)
  if (!passwordDigest) return { skip: 'no-password-hash' }

  const displayName = typeof profile.displayName === 'string' && profile.displayName.trim()
    ? profile.displayName.trim().slice(0, 80)
    : typeof user.displayName === 'string'
      ? user.displayName.trim().slice(0, 80)
      : ''

  const createdAt = Number(user.createdAt)
  return {
    payload: {
      external_id: uid,
      email_address: [email],
      password_digest: passwordDigest,
      password_hasher: 'scrypt_firebase',
      legal_accepted_at: acceptedAt.toISOString(),
      ...(Number.isFinite(createdAt) ? { created_at: new Date(createdAt).toISOString() } : {}),
      unsafe_metadata: {
        age13Confirmed: true,
        termsAcceptedAt: acceptedAt.toISOString(),
        privacyPolicyVersion: profile.privacyPolicyVersion || '2026-07-20',
        displayName,
      },
      private_metadata: {
        migratedFrom: 'firebase',
        legacyFirebaseUid: uid,
      },
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

    const body = await response.text()
    throw new Error(`Clerk API ${response.status}: ${body.slice(0, 500)}`)
  }
  throw new Error('Clerk API rate limit did not clear after five attempts')
}

async function alreadyImported(externalId) {
  const query = new URLSearchParams({ limit: '1' })
  query.append('external_id[]', externalId)
  const result = await clerkRequest(`/v1/users?${query}`)
  return Array.isArray(result) ? result.length > 0 : Array.isArray(result.data) && result.data.length > 0
}

async function main() {
  const usersPath = getArgument('--users')
  const profilesPath = getArgument('--profiles')
  const execute = process.argv.includes('--execute')
  if (!usersPath || !profilesPath) throw new Error(usage())
  if (execute && process.env.CLERK_MIGRATION_CONFIRM !== 'IMPORT_TO_CLERK') {
    throw new Error('Set CLERK_MIGRATION_CONFIRM=IMPORT_TO_CLERK before using --execute')
  }

  const [usersExport, profiles] = await Promise.all([
    JSON.parse(await readFile(usersPath, 'utf8')),
    JSON.parse(await readFile(profilesPath, 'utf8')),
  ])
  const users = Array.isArray(usersExport) ? usersExport : usersExport.users
  if (!Array.isArray(users)) throw new Error('The Firebase export must contain a users array')
  if (!profiles || typeof profiles !== 'object' || Array.isArray(profiles)) {
    throw new Error('The profile consent export must be keyed by Firebase UID')
  }

  const prepared = []
  const skipped = { 'unverified-email': 0, 'no-password-hash': 0 }
  for (const user of users) {
    const result = buildClerkPayload(user, profiles[user.localId])
    if (result.skip) {
      skipped[result.skip] += 1
    } else {
      prepared.push(result.payload)
    }
  }

  console.log(`Validated ${prepared.length} users for migration.`)
  console.log(`Skipped ${skipped['unverified-email']} unverified users and ${skipped['no-password-hash']} users without password hashes.`)
  if (!execute) {
    console.log('Dry run complete. No user data was sent to Clerk.')
    return
  }

  let created = 0
  let existing = 0
  for (const payload of prepared) {
    if (await alreadyImported(payload.external_id)) {
      existing += 1
      continue
    }
    await clerkRequest('/v1/users', { method: 'POST', body: JSON.stringify(payload) })
    created += 1
  }
  console.log(`Migration complete: ${created} created, ${existing} already present.`)
}

main().catch(error => {
  console.error(error instanceof Error ? error.message : 'Migration failed')
  process.exitCode = 1
})
