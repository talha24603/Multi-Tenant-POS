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
    if (session.user.role !== "OWNER" ) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
    }

    if ( !session.user.tenantId) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 404 })
    }

    // Get current date for calculations
    const now = new Date()
    const currentYear = now.getFullYear()
    
    // Get sales data for the last 12 months
    const monthlySales = []
    
    for (let month = 0; month < 12; month++) {
      const startDate = new Date(currentYear, month, 1)
      const endDate = new Date(currentYear, month + 1, 0)
      
      const monthSales = await prisma.sale.aggregate({
        where: {
          tenantId: session.user.tenantId,
          createdAt: {
            gte: startDate,
            lte: endDate
          }
        },
        _sum: {
          total: true
        }
      })
      
      const monthNames = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
      ]
      
      monthlySales.push({
        name: monthNames[month],
        total: monthSales._sum.total || 0
      })
    }

    return NextResponse.json({
      salesData: monthlySales
    })

  } catch (error) {
    console.error("Error fetching sales chart data:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
} 