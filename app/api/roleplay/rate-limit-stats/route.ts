import { NextRequest, NextResponse } from 'next/server'

// This would need to be shared with the generate route in a real implementation
// For now, we'll create a simple stats endpoint that can be used for debugging
export async function GET(request: NextRequest) {
  // In a production environment, you might want to protect this endpoint
  // or only enable it in development mode
  
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Stats endpoint only available in development' }, { status: 403 })
  }

  return NextResponse.json({
    message: 'Rate limiter stats endpoint',
    note: 'Rate limiter instance is created per API route. Check console logs for detailed rate limiting activity.',
    timestamp: new Date().toISOString()
  })
}