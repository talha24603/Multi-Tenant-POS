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
    if (session.user.role !== "OWNER" ) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
    }

    // Get current date for calculations
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0)
    console.log(startOfMonth, endOfMonth, startOfLastMonth, endOfLastMonth);
    

    if ( !session.user.tenantId) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 404 })
    }

    // Get total revenue for current month
    const currentMonthRevenue = await prisma.sale.aggregate({
      where: {
        tenantId: session.user.tenantId,
        createdAt: {
          gte: startOfMonth,
          lte: endOfMonth
        }
      },
      _sum: {
        total: true
      }
    })

    // Get total revenue for last month
    const lastMonthRevenue = await prisma.sale.aggregate({
      where: {
        tenantId: session.user.tenantId,
        createdAt: {
          gte: startOfLastMonth,
          lte: endOfLastMonth
        }
      },
      _sum: {
        total: true
      }
    })

    // Get total sales count for current month
    const currentMonthSales = await prisma.sale.count({
      where: {
        tenantId: session.user.tenantId,
        createdAt: {
          gte: startOfMonth,
          lte: endOfMonth
        }
      }
    })
    console.log(currentMonthSales);

    // Get total sales count for last month
    const lastMonthSales = await prisma.sale.count({
      where: {
        tenantId: session.user.tenantId,
        createdAt: {
          gte: startOfLastMonth,
          lte: endOfLastMonth
        }
      }
    })
    console.log(lastMonthSales);

    // Get new customers for current month
    const currentMonthCustomers = await prisma.customer.count({
      where: {
        tenantId: session.user.tenantId,
        createdAt: {
          gte: startOfMonth,
          lte: endOfMonth
        }
      }
    })
    console.log(currentMonthCustomers);
    // Get new customers for last month
    const lastMonthCustomers = await prisma.customer.count({
      where: {
        tenantId: session.user.tenantId,
        createdAt: {
          gte: startOfLastMonth,
          lte: endOfLastMonth
        }
      }
    })
    console.log(lastMonthCustomers);
    // Get total products sold for current month
    const currentMonthProductsSold = await prisma.saleItem.aggregate({
      where: {
        sale: {
          tenantId: session.user.tenantId,
          createdAt: {
            gte: startOfMonth,
            lte: endOfMonth
          }
        }
      },
      _sum: {
        quantity: true
      }
    })

    // Get total products sold for last month
    const lastMonthProductsSold = await prisma.saleItem.aggregate({
      where: {
        sale: {
          tenantId: session.user.tenantId,
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
    console.log(lastMonthProductsSold);
    // Calculate percentages
    const currentRevenue = currentMonthRevenue._sum.total || 0
    const lastRevenue = lastMonthRevenue._sum.total || 0
    const revenueChange = lastRevenue > 0 ? ((currentRevenue - lastRevenue) / lastRevenue) * 100 : 0

    const salesChange = lastMonthSales > 0 ? ((currentMonthSales - lastMonthSales) / lastMonthSales) * 100 : 0
    const customersChange = lastMonthCustomers > 0 ? ((currentMonthCustomers - lastMonthCustomers) / lastMonthCustomers) * 100 : 0

    const currentProductsSold = currentMonthProductsSold._sum.quantity || 0
    const lastProductsSold = lastMonthProductsSold._sum.quantity || 0
    const productsSoldChange = lastProductsSold > 0 ? ((currentProductsSold - lastProductsSold) / lastProductsSold) * 100 : 0

    // Get top performing tenants (for super admin only)
    // let topTenants = []
    // if (session.user.role === "superAdmin") {
    //   topTenants = await prisma.sale.groupBy({
    //     by: ['tenantId'],
    //     where: {
    //       createdAt: {
    //         gte: startOfMonth,
    //         lte: endOfMonth
    //       }
    //     },
    //     _sum: {
    //       total: true
    //     },
    //     orderBy: {
    //       _sum: {
    //         total: 'desc'
    //       }
    //     },
    //     take: 5
    //   })

    //   // Get tenant names for the top performers
    //   const tenantIds = topTenants.map(t => t.tenantId)
    //   const tenants = await prisma.tenant.findMany({
    //     where: {
    //       id: {
    //         in: tenantIds
    //       }
    //     },
    //     select: {
    //       id: true,
    //       name: true
    //     }
    //   })

    //   topTenants = topTenants.map(t => ({
    //     ...t,
    //     tenantName: tenants.find(tenant => tenant.id === t.tenantId)?.name || 'Unknown'
    //   }))
    // }

    return NextResponse.json({
      stats: {
        totalRevenue: {
          current: currentRevenue,
          change: revenueChange
        },
        totalSales: {
          current: currentMonthSales,
          change: salesChange
        },
        newCustomers: {
          current: currentMonthCustomers,
          change: customersChange
        },
        productsSold: {
          current: currentProductsSold,
          change: productsSoldChange
        },
        
      } 
    })

  } catch (error) {
    console.error("Error fetching analytics stats:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
} 