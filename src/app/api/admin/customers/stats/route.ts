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
    const tenantId = searchParams.get('tenantId')

    if (!tenantId) {
      return NextResponse.json({ error: 'Tenant ID is required' }, { status: 400 })
    }

    // Get total customers
    const totalCustomers = await prisma.customer.count({
      where: { tenantId }
    })

    // Get customers created this month
    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)

    const newThisMonth = await prisma.customer.count({
      where: {
        tenantId,
        createdAt: {
          gte: startOfMonth
        }
      }
    })

    // Get active customers (customers with sales in the last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const activeCustomers = await prisma.customer.count({
      where: {
        tenantId,
        sales: {
          some: {
            createdAt: {
              gte: thirtyDaysAgo
            }
          }
        }
      }
    })

    // Calculate average order value
    const salesData = await prisma.sale.aggregate({
      where: {
        tenantId,
        customerId: {
          not: null
        }
      },
      _avg: {
        total: true
      },
      _sum: {
        total: true
      },
      _count: true
    })

    const averageOrderValue = salesData._avg.total || 0
    const totalRevenue = salesData._sum.total || 0
    const totalOrders = salesData._count || 0

    // Get customer growth trend (last 6 months)
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

    const monthlyGrowth = await prisma.customer.groupBy({
      by: ['createdAt'],
      where: {
        tenantId,
        createdAt: {
          gte: sixMonthsAgo
        }
      },
      _count: true
    })

    // Calculate growth percentage
    const lastMonth = new Date()
    lastMonth.setMonth(lastMonth.getMonth() - 1)
    lastMonth.setDate(1)
    lastMonth.setHours(0, 0, 0, 0)

    const previousMonth = new Date(lastMonth)
    previousMonth.setMonth(previousMonth.getMonth() - 1)

    const currentMonthCustomers = await prisma.customer.count({
      where: {
        tenantId,
        createdAt: {
          gte: lastMonth
        }
      }
    })

    const previousMonthCustomers = await prisma.customer.count({
      where: {
        tenantId,
        createdAt: {
          gte: previousMonth,
          lt: lastMonth
        }
      }
    })

    const growthPercentage = previousMonthCustomers > 0 
      ? ((currentMonthCustomers - previousMonthCustomers) / previousMonthCustomers) * 100
      : currentMonthCustomers > 0 ? 100 : 0

    return NextResponse.json({
      stats: {
        totalCustomers,
        newThisMonth,
        activeCustomers,
        averageOrderValue,
        totalRevenue,
        totalOrders,
        growthPercentage: Math.round(growthPercentage * 100) / 100
      }
    })
  } catch (error) {
    console.error('Error fetching customer stats:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
