import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import prisma from '@/prismaClient'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q') || ''
    const tenantId = searchParams.get('tenantId')

    if (!tenantId) {
      return NextResponse.json({ error: 'Tenant ID is required' }, { status: 400 })
    }

    const products = await prisma.product.findMany({
      where: {
        tenantId,
        AND: [
          {
            OR: [
              { name: { contains: query, mode: 'insensitive' } },
              { barcode: { contains: query, mode: 'insensitive' } },
              { category: { contains: query, mode: 'insensitive' } }
            ]
          },
          { stock: { gt: 0 } } // Only show products with stock
        ]
      },
      select: {
        id: true,
        name: true,
        price: true,
        stock: true,
        barcode: true,
        category: true,
        imageUrl: true
      },
      take: 10
    })

    return NextResponse.json({ products })
  } catch (error) {
    console.error('Error searching products:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 