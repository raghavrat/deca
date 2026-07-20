import { NextResponse } from 'next/server'
import { RequestError, requireSession } from '../../../utils/serverAuth'
import { getRoleplaysForUser } from '../../../utils/roleplayStore'

export async function GET() {
  try {
    const user = await requireSession()
    const data = await getRoleplaysForUser(user)
    
    // Convert the object of sessions to an array
    const sessions: Array<Record<string, unknown> & { sessionId: string }> = Object.keys(data).map(sessionId => ({
      ...data[sessionId],
      sessionId
    }))
    
    // Sort by creation date (newest first)
    sessions.sort((a, b) => {
      const dateA = new Date(String(a['createdAt'] || a['processedAt'] || 0)).getTime()
      const dateB = new Date(String(b['createdAt'] || b['processedAt'] || 0)).getTime()
      return dateB - dateA
    })
    
    return NextResponse.json({ 
      success: true,
      sessions
    }, { headers: { 'Cache-Control': 'no-store' } })
  } catch (error) {
    if (error instanceof RequestError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }
    console.error('Error fetching roleplay history')
    return NextResponse.json(
      { error: 'Failed to fetch history' },
      { status: 500 }
    )
  }
}

export const runtime = 'nodejs'
