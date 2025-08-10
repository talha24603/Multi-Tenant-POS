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
    const barcode = (searchParams.get('barcode') || '').trim()
    const tenantId = searchParams.get('tenantId')

    if (!tenantId) {
      return NextResponse.json({ error: 'Tenant ID is required' }, { status: 400 })
    }
    if (!barcode) {
      return NextResponse.json({ error: 'Barcode is required' }, { status: 400 })
    }

    const product = await prisma.product.findFirst({
      where: {
        tenantId,
        barcode,
        stock: { gt: 0 },
      },
      select: {
        id: true,
        name: true,
        price: true,
        stock: true,
        barcode: true,
        category: true,
        imageUrl: true,
      },
    })

    return NextResponse.json({ product: product || null })
  } catch (error) {
    console.error('Error fetching product by barcode:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}


