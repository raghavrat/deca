import 'server-only'

import { adminDb } from '../firebase/admin'
import { RequestError, SessionUser } from './serverAuth'

function getRoleplayRoots(user: SessionUser) {
  if (!adminDb) {
    throw new RequestError(500, 'Server configuration error')
  }

  // The email-keyed document is retained as a read/delete fallback for data
  // created before roleplays were migrated to UID-keyed storage.
  return [
    adminDb.collection('roleplays').doc(user.uid),
    adminDb.collection('roleplays').doc(user.email),
  ]
}

export async function getRoleplaysForUser(user: SessionUser): Promise<Record<string, Record<string, unknown>>> {
  const roots = getRoleplayRoots(user)
  const [legacySnapshots, sessionSnapshots] = await Promise.all([
    Promise.all(roots.map(ref => ref.get())),
    Promise.all(roots.map(ref => ref.collection('sessions').get())),
  ])

  const combined = legacySnapshots.reduce<Record<string, Record<string, unknown>>>((roleplays, snapshot) => {
    if (snapshot.exists) {
      const data = snapshot.data() || {}
      for (const [key, value] of Object.entries(data)) {
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          roleplays[key] = value as Record<string, unknown>
        }
      }
    }
    return roleplays
  }, {})

  for (const snapshot of sessionSnapshots) {
    for (const document of snapshot.docs) {
      combined[document.id] = document.data()
    }
  }
  return combined
}

export async function getRoleplayForUser(user: SessionUser, sessionId: string): Promise<Record<string, unknown> | undefined> {
  const roots = getRoleplayRoots(user)
  const sessionSnapshots = await Promise.all(roots.map(ref => ref.collection('sessions').doc(sessionId).get()))
  const current = sessionSnapshots.find(snapshot => snapshot.exists)
  if (current) return current.data()

  const legacySnapshots = await Promise.all(roots.map(ref => ref.get()))
  for (const snapshot of legacySnapshots) {
    const roleplay = snapshot.data()?.[sessionId]
    if (typeof roleplay === 'object' && roleplay !== null && !Array.isArray(roleplay)) {
      return roleplay as Record<string, unknown>
    }
  }
  return undefined
}

export async function saveRoleplayForUser(
  user: SessionUser,
  sessionId: string,
  roleplay: Record<string, unknown>,
): Promise<void> {
  const [uidRoot] = getRoleplayRoots(user)
  await uidRoot.collection('sessions').doc(sessionId).set(roleplay)
}

export async function deleteRoleplaysForUser(user: SessionUser): Promise<void> {
  if (!adminDb) throw new RequestError(500, 'Server configuration error')
  const db = adminDb
  await Promise.all(getRoleplayRoots(user).map(ref => db.recursiveDelete(ref)))
}
