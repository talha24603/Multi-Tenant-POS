import { NextRequest, NextResponse } from "next/server"
import prisma from "@/prismaClient"

// Force dynamic rendering
export const dynamic = 'force-dynamic'
import { auth } from "@/auth"

export async function GET(request: NextRequest) {
  try {
    // Get the current session to verify admin permissions
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user is an admin (OWNER or superAdmin)
    if (session.user.role !== "OWNER" && session.user.role !== "superAdmin") {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
    }

    // Get current date for calculations
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0)

    // Build where clause for tenant filtering
    const whereClause: any = {}
    if (session.user.role !== "superAdmin" && session.user.tenantId) {
      whereClause.tenantId = session.user.tenantId
    }

    // Get total sales for current month
    const currentMonthSales = await prisma.sale.aggregate({
      where: {
        ...whereClause,
        createdAt: {
          gte: startOfMonth,
          lte: endOfMonth
        }
      },
      _sum: {
        total: true
      }
    })

    // Get total sales for last month
    const lastMonthSales = await prisma.sale.aggregate({
      where: {
        ...whereClause,
        createdAt: {
          gte: startOfLastMonth,
          lte: endOfLastMonth
        }
      },
      _sum: {
        total: true
      }
    })

    // Get transaction count for current month
    const currentMonthTransactions = await prisma.sale.count({
      where: {
        ...whereClause,
        createdAt: {
          gte: startOfMonth,
          lte: endOfMonth
        }
      }
    })

    // Get transaction count for last month
    const lastMonthTransactions = await prisma.sale.count({
      where: {
        ...whereClause,
        createdAt: {
          gte: startOfLastMonth,
          lte: endOfLastMonth
        }
      }
    })

    // Get payment method breakdown for current month
    const paymentMethods = await prisma.sale.groupBy({
      by: ['paymentType'],
      where: {
        ...whereClause,
        createdAt: {
          gte: startOfMonth,
          lte: endOfMonth
        }
      },
      _sum: {
        total: true
      }
    })

    // Calculate percentages
    const currentTotal = currentMonthSales._sum.total || 0
    const lastTotal = lastMonthSales._sum.total || 0
    const salesChange = lastTotal > 0 ? ((currentTotal - lastTotal) / lastTotal) * 100 : 0

    const transactionsChange = lastMonthTransactions > 0 ? 
      ((currentMonthTransactions - lastMonthTransactions) / lastMonthTransactions) * 100 : 0

    // Calculate payment method percentages
    const cardPayments = paymentMethods.find(p => p.paymentType === "Card")?._sum.total || 0
    const cashPayments = paymentMethods.find(p => p.paymentType === "Cash")?._sum.total || 0
    const cardPercentage = currentTotal > 0 ? (cardPayments / currentTotal) * 100 : 0
    const cashPercentage = currentTotal > 0 ? (cashPayments / currentTotal) * 100 : 0

    return NextResponse.json({
      stats: {
        totalSales: {
          current: currentTotal,
          change: salesChange
        },
        transactions: {
          current: currentMonthTransactions,
          change: transactionsChange
        },
        cardPayments: {
          amount: cardPayments,
          percentage: cardPercentage
        },
        cashPayments: {
          amount: cashPayments,
          percentage: cashPercentage
        },
        paymentMethods
      }
    })

  } catch (error) {
    console.error("Error fetching sales stats:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
} 