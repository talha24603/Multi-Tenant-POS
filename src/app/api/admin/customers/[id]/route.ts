import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import prisma from '@/prismaClient'

// GET - Get a specific customer with their sales history
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const resolvedParams = await params
    const customer = await prisma.customer.findUnique({
      where: { id: resolvedParams.id },
      include: {
        sales: {
          include: {
            items: {
              include: {
                product: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    })

    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 })
    }

    // Calculate customer stats
    const totalOrders = customer.sales.length
    const totalSpent = customer.sales.reduce((sum, sale) => sum + sale.total, 0)
    const averageOrderValue = totalOrders > 0 ? totalSpent / totalOrders : 0

    const customerWithStats = {
      ...customer,
      stats: {
        totalOrders,
        totalSpent,
        averageOrderValue,
        status: totalOrders > 0 ? 'active' : 'inactive'
      }
    }

    return NextResponse.json({ customer: customerWithStats })
  } catch (error) {
    console.error('Error fetching customer:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT - Update a customer
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, email, phone } = body

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }

    const resolvedParams = await params
    // Check if customer exists
    const existingCustomer = await prisma.customer.findUnique({
      where: { id: resolvedParams.id }
    })

    if (!existingCustomer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 })
    }

    // Check if email is being changed and if it conflicts with another customer
    if (email && email !== existingCustomer.email) {
      const emailConflict = await prisma.customer.findFirst({
        where: {
          email,
          tenantId: existingCustomer.tenantId,
          id: { not: resolvedParams.id }
        }
      })

      if (emailConflict) {
        return NextResponse.json({ error: 'Customer with this email already exists' }, { status: 400 })
      }
    }

    const updatedCustomer = await prisma.customer.update({
      where: { id: resolvedParams.id },
      data: {
        name,
        email,
        phone
      }
    })

    return NextResponse.json({ customer: updatedCustomer })
  } catch (error) {
    console.error('Error updating customer:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE - Delete a customer
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const resolvedParams = await params
    // Check if customer exists
    const existingCustomer = await prisma.customer.findUnique({
      where: { id: resolvedParams.id },
      include: {
        sales: true
      }
    })

    if (!existingCustomer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 })
    }

    // Check if customer has sales - if so, we might want to prevent deletion
    if (existingCustomer.sales.length > 0) {
      return NextResponse.json({ 
        error: 'Cannot delete customer with existing sales. Consider archiving instead.' 
      }, { status: 400 })
    }

    await prisma.customer.delete({
      where: { id: resolvedParams.id }
    })

    return NextResponse.json({ message: 'Customer deleted successfully' })
  } catch (error) {
    console.error('Error deleting customer:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
