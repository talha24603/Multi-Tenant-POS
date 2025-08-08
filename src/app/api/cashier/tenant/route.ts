import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import prisma from '@/prismaClient'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        tenants: {
          include: {
            tenant: true
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get the first tenant (or you could implement tenant selection logic)
    const tenantUser = user.tenants[0]
    
    if (!tenantUser) {
      return NextResponse.json({ error: 'No tenant associated with user' }, { status: 404 })
    }

    return NextResponse.json({
      tenantId: tenantUser.tenantId,
      tenantName: tenantUser.tenant.name,
      role: tenantUser.role
    })
  } catch (error) {
    console.error('Error fetching tenant info:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 