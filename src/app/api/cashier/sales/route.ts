import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import prisma from '@/prismaClient'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { items, total, paymentType, customerId, tenantId } = body

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Items are required' }, { status: 400 })
    }

    if (!total || !paymentType || !tenantId) {
      return NextResponse.json({ error: 'Total, payment type, and tenant ID are required' }, { status: 400 })
    }

    // Get user ID from session
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Start a transaction
    const result = await prisma.$transaction(async (tx: any) => {
      // Create the sale
      const sale = await tx.sale.create({
        data: {
          total,
          paymentType,
          tenantId,
          userId: user.id,
          customerId: customerId || null
        }
      })

      // Create sale items and update product stock
      for (const item of items) {
        // Create sale item
        await tx.saleItem.create({
          data: {
            saleId: sale.id,
            productId: item.productId,
            quantity: item.quantity,
            price: item.price
          }
        })

        // Update product stock
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity
            }
          }
        })
      }

      return sale
    })

    return NextResponse.json({ 
      success: true, 
      saleId: result.id,
      message: 'Sale completed successfully' 
    })
  } catch (error) {
    console.error('Error processing sale:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 