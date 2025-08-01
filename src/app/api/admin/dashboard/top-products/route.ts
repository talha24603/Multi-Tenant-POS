import { NextRequest, NextResponse } from "next/server"
import prisma from "@/prismaClient"
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

    // Build where clause for tenant filtering
    const whereClause: any = {}
    if (session.user.role !== "superAdmin" && session.user.tenantId) {
      whereClause.tenantId = session.user.tenantId
    }

    // Get current date for calculations
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0)

    // Get top products by sales quantity for current month
    const topProducts = await prisma.saleItem.groupBy({
      by: ['productId'],
      where: {
        sale: {
          ...whereClause,
          createdAt: {
            gte: startOfMonth,
            lte: endOfMonth
          }
        }
      },
      _sum: {
        quantity: true,
        price: true
      },
      orderBy: {
        _sum: {
          quantity: 'desc'
        }
      },
      take: 10
    })

    // Get product details for the top products
    const productIds = topProducts.map(p => p.productId)
    const products = await prisma.product.findMany({
      where: {
        id: {
          in: productIds
        }
      },
      select: {
        id: true,
        name: true,
        price: true,
        stock: true
      }
    })

    // Get last month's data for comparison
    const lastMonthProducts = await prisma.saleItem.groupBy({
      by: ['productId'],
      where: {
        sale: {
          ...whereClause,
          createdAt: {
            gte: startOfLastMonth,
            lte: endOfLastMonth
          }
        }
      },
      _sum: {
        quantity: true
      }
    })

    // Format the data for the frontend
    const formattedProducts = topProducts.map(product => {
      const productDetails = products.find(p => p.id === product.productId)
      const lastMonthData = lastMonthProducts.find(p => p.productId === product.productId)
      
      const currentSales = product._sum.quantity || 0
      const lastMonthSales = lastMonthData?._sum.quantity || 0
      const revenue = (product._sum.price || 0) * (product._sum.quantity || 0)
      
      let trend = "up"
      let percentage = 0
      
      if (lastMonthSales > 0) {
        percentage = ((currentSales - lastMonthSales) / lastMonthSales) * 100
        trend = percentage >= 0 ? "up" : "down"
      } else if (currentSales > 0) {
        percentage = 100
        trend = "up"
      }

      return {
        id: product.productId,
        name: productDetails?.name || 'Unknown Product',
        sales: currentSales,
        revenue: `$${revenue.toFixed(2)}`,
        trend,
        percentage: Math.abs(percentage).toFixed(1),
        stock: productDetails?.stock || 0,
        price: productDetails?.price || 0
      }
    })

    return NextResponse.json({
      topProducts: formattedProducts
    })

  } catch (error) {
    console.error("Error fetching top products:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
} 