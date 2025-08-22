import { NextRequest, NextResponse } from 'next/server'
import { adminAuth, adminDb } from '../../../firebase/admin'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const email = searchParams.get('email')
    
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }
    
    console.log('Fetching roleplay history for:', email)
    
    // Check if Firebase Admin is properly initialized
    if (!adminDb) {
      console.error('Firebase Admin SDK not initialized - adminDb is null')
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }
    
    // Fetch all roleplays for this user
    const docRef = adminDb.collection('roleplays').doc(email)
    const docSnap = await docRef.get()
    
    if (!docSnap.exists) {
      console.log('No roleplay history found for:', email)
      return NextResponse.json({ sessions: [] })
    }
    
    const data = docSnap.data() || {}
    
    // Convert the object of sessions to an array
    const sessions = Object.keys(data).map(sessionId => ({
      ...data[sessionId],
      sessionId
    }))
    
    // Sort by creation date (newest first)
    sessions.sort((a, b) => {
      const dateA = new Date(a.createdAt || a.processedAt).getTime()
      const dateB = new Date(b.createdAt || b.processedAt).getTime()
      return dateB - dateA
    })
    
    console.log(`Found ${sessions.length} sessions for user`)
    
    return NextResponse.json({ 
      success: true,
      sessions
    })
  } catch (error) {
    console.error('Error fetching roleplay history:', error)
    return NextResponse.json(
      { error: 'Failed to fetch history', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export const runtime = 'nodejs'