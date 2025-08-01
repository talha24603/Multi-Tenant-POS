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

    // Get recent sales with customer and user information
    const recentSales = await prisma.sale.findMany({
      where: whereClause,
      include: {
        customer: {
          select: {
            name: true,
            email: true
          }
        },
        user: {
          select: {
            name: true,
            email: true
          }
        },
        items: {
          select: {
            id: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 10
    })

    // Format the data for the frontend
    const formattedSales = recentSales.map(sale => ({
      id: sale.id,
      customer: sale.customer?.name || 'Walk-in Customer',
      email: sale.customer?.email || 'N/A',
      amount: `$${sale.total.toFixed(2)}`,
      status: 'completed',
      createdAt: sale.createdAt,
      paymentType: sale.paymentType,
      items: sale.items.length
    }))

    return NextResponse.json({
      recentSales: formattedSales
    })

  } catch (error) {
    console.error("Error fetching recent sales:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
} 