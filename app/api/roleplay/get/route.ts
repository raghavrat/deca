import { NextRequest, NextResponse } from 'next/server'
import { adminAuth, adminDb } from '../../../firebase/admin'
import { logger } from '../../../utils/logger'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const sessionId = searchParams.get('id')
    const email = searchParams.get('email')
    
    if (!sessionId || !email) {
      return NextResponse.json({ error: 'Missing session ID or email' }, { status: 400 })
    }
    
    logger.log('Fetching roleplay session:', { sessionId, email })
    
    // Check if Firebase Admin is properly initialized
    if (!adminDb) {
      logger.errorProduction('Firebase Admin SDK not initialized - adminDb is null')
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }
    
    // Fetch the roleplay data from Firebase
    const docRef = adminDb.collection('roleplays').doc(email)
    const docSnap = await docRef.get()
    
    if (!docSnap.exists) {
      logger.error('No roleplay document found for email:', email)
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }
    
    const data = docSnap.data()
    const sessionData = data?.[sessionId]
    
    if (!sessionData) {
      logger.error('Session not found:', sessionId)
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }
    
    logger.log('Session data retrieved successfully')
    
    return NextResponse.json({ 
      success: true,
      data: sessionData
    })
  } catch (error) {
    logger.errorProduction('Error fetching roleplay session:', error)
    return NextResponse.json(
      { error: 'Failed to fetch session', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export const runtime = 'nodejs'