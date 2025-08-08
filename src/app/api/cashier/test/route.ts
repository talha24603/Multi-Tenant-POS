import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    
    return NextResponse.json({
      message: 'Cashier API is working',
      authenticated: !!session?.user,
      user: session?.user ? {
        email: session.user.email,
        tenantId: session.user.tenantId,
        role: session.user.role
      } : null
    })
  } catch (error) {
    console.error('Error in test endpoint:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 