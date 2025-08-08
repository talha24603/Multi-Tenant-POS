import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import prisma from '@/prismaClient'

// GET - Fetch all customers with pagination, search, and filtering
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || ''
    const tenantId = searchParams.get('tenantId')

    if (!tenantId) {
      return NextResponse.json({ error: 'Tenant ID is required' }, { status: 400 })
    }

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {
      tenantId,
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } }
      ]
    }

    // Get customers with their sales data
    const customers = await prisma.customer.findMany({
      where,
      include: {
        sales: {
          select: {
            id: true,
            total: true,
            createdAt: true
          }
        }
      },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' }
    })

    // Get total count for pagination
    const total = await prisma.customer.count({ where })

    // Calculate customer stats
    const customersWithStats = customers.map(customer => {
      const totalOrders = customer.sales.length
      const totalSpent = customer.sales.reduce((sum, sale) => sum + sale.total, 0)
      const lastOrder = customer.sales.length > 0 
        ? customer.sales.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0].createdAt
        : null

      return {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        createdAt: customer.createdAt,
        totalOrders,
        totalSpent,
        lastOrder,
        status: totalOrders > 0 ? 'active' : 'inactive'
      }
    })

    return NextResponse.json({
      customers: customersWithStats,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching customers:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Create a new customer
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, email, phone, tenantId } = body

    if (!name || !tenantId) {
      return NextResponse.json({ error: 'Name and tenant ID are required' }, { status: 400 })
    }

    // Check if customer with same email already exists for this tenant
    if (email) {
      const existingCustomer = await prisma.customer.findFirst({
        where: {
          email,
          tenantId
        }
      })

      if (existingCustomer) {
        return NextResponse.json({ error: 'Customer with this email already exists' }, { status: 400 })
      }
    }

    const customer = await prisma.customer.create({
      data: {
        name,
        email,
        phone,
        tenantId
      }
    })

    return NextResponse.json({ customer }, { status: 201 })
  } catch (error) {
    console.error('Error creating customer:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
