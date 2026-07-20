import { NextResponse } from 'next/server'
import { adminDb } from '../../firebase/admin'
import { RequestError, requireSession } from '../../utils/serverAuth'

interface LeaderboardEntry {
  id: string
  name: string
  problemsCompleted: number
}

export async function GET() {
  try {
    await requireSession()
    if (!adminDb) throw new RequestError(500, 'Server configuration error')

    const snapshot = await adminDb
      .collection('users')
      .where('leaderboardVisible', '==', true)
      .limit(500)
      .get()

    const leaderboard = snapshot.docs
      .map<LeaderboardEntry>(document => {
        const data = document.data()
        return {
          id: document.id,
          name: typeof data.name === 'string' && data.name.trim() ? data.name.trim().slice(0, 80) : 'Anonymous',
          problemsCompleted: Number.isFinite(data.problemsCompleted) ? Math.max(0, data.problemsCompleted) : 0,
        }
      })
      .sort((a, b) => b.problemsCompleted - a.problemsCompleted)
      .slice(0, 100)

    return NextResponse.json({ leaderboard }, { headers: { 'Cache-Control': 'private, no-store' } })
  } catch (error) {
    if (error instanceof RequestError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }
    return NextResponse.json({ error: 'Unable to load leaderboard' }, { status: 500 })
  }
}
