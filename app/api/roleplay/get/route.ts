import { NextRequest, NextResponse } from 'next/server'
import { RequestError, requireSession } from '../../../utils/serverAuth'
import { getRoleplayForUser } from '../../../utils/roleplayStore'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const sessionId = searchParams.get('id')
    const user = await requireSession()
    
    if (!sessionId || !/^roleplay_[a-zA-Z0-9_-]{8,100}$/.test(sessionId)) {
      return NextResponse.json({ error: 'Invalid session ID' }, { status: 400 })
    }
    
    const sessionData = await getRoleplayForUser(user, sessionId)
    
    if (!sessionData) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }
    
    return NextResponse.json({ 
      success: true,
      data: sessionData
    }, { headers: { 'Cache-Control': 'no-store' } })
  } catch (error) {
    if (error instanceof RequestError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }
    return NextResponse.json(
      { error: 'Failed to fetch session' },
      { status: 500 }
    )
  }
}

export const runtime = 'nodejs'
