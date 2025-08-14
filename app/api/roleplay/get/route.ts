import { NextRequest, NextResponse } from 'next/server'
import { adminAuth, adminDb } from '../../../firebase/admin'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const sessionId = searchParams.get('id')
    const email = searchParams.get('email')
    
    if (!sessionId || !email) {
      return NextResponse.json({ error: 'Missing session ID or email' }, { status: 400 })
    }
    
    console.log('Fetching roleplay session:', { sessionId, email })
    
    // Fetch the roleplay data from Firebase
    const docRef = adminDb.collection('roleplays').doc(email)
    const docSnap = await docRef.get()
    
    if (!docSnap.exists) {
      console.error('No roleplay document found for email:', email)
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }
    
    const data = docSnap.data()
    const sessionData = data?.[sessionId]
    
    if (!sessionData) {
      console.error('Session not found:', sessionId)
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }
    
    console.log('Session data retrieved successfully')
    
    return NextResponse.json({ 
      success: true,
      data: sessionData
    })
  } catch (error) {
    console.error('Error fetching roleplay session:', error)
    return NextResponse.json(
      { error: 'Failed to fetch session', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export const runtime = 'nodejs'