import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { adminAuth, adminDb } from '../../../firebase/admin'
import { deleteRoleplaysForUser, getRoleplaysForUser } from '../../../utils/roleplayStore'
import { RequestError, requireSameOrigin, requireSession } from '../../../utils/serverAuth'

const noStoreHeaders = { 'Cache-Control': 'no-store' }

export async function GET() {
  try {
    const user = await requireSession()
    if (!adminDb) throw new RequestError(500, 'Server configuration error')

    const [profileSnapshot, roleplays] = await Promise.all([
      adminDb.collection('users').doc(user.uid).get(),
      getRoleplaysForUser(user),
    ])

    return NextResponse.json({
      exportedAt: new Date().toISOString(),
      account: {
        uid: user.uid,
        email: user.email,
        profile: profileSnapshot.exists ? profileSnapshot.data() : null,
      },
      roleplays,
      note: 'Question practice statistics and theme preferences are stored only in this browser and are not included in the server export.',
    }, { headers: noStoreHeaders })
  } catch (error) {
    if (error instanceof RequestError) {
      return NextResponse.json({ error: error.message }, { status: error.status, headers: noStoreHeaders })
    }
    return NextResponse.json({ error: 'Unable to export account data' }, { status: 500, headers: noStoreHeaders })
  }
}

export async function DELETE(request: Request) {
  try {
    requireSameOrigin(request)
    const user = await requireSession()
    const body: unknown = await request.json()
    const confirmation = typeof body === 'object' && body !== null && 'confirmation' in body
      ? (body as { confirmation?: unknown }).confirmation
      : null

    if (confirmation !== 'DELETE') {
      return NextResponse.json({ error: 'Deletion confirmation is required' }, { status: 400, headers: noStoreHeaders })
    }
    if (!adminDb || !adminAuth) throw new RequestError(500, 'Server configuration error')

    await Promise.all([
      adminDb.collection('users').doc(user.uid).delete(),
      deleteRoleplaysForUser(user),
    ])
    await adminAuth.revokeRefreshTokens(user.uid)
    await adminAuth.deleteUser(user.uid)

    const cookieStore = await cookies()
    cookieStore.set('session', '', {
      maxAge: 0,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
    })

    return NextResponse.json({ deleted: true }, { headers: noStoreHeaders })
  } catch (error) {
    if (error instanceof RequestError) {
      return NextResponse.json({ error: error.message }, { status: error.status, headers: noStoreHeaders })
    }
    return NextResponse.json({ error: 'Unable to delete account data' }, { status: 500, headers: noStoreHeaders })
  }
}
