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

    // Get products with low stock (less than 10 items)
    const lowStockProducts = await prisma.product.findMany({
      where: {
        ...whereClause,
        stock: {
          lte: 10
        }
      },
      orderBy: {
        stock: 'asc'
      },
      take: 10
    })

    // Format the data for the frontend
    const formattedAlerts = lowStockProducts.map(product => {
      const isOutOfStock = product.stock === 0
      const isLowStock = product.stock <= 5
      
      return {
        id: product.id,
        name: product.name,
        currentStock: product.stock,
        minStock: 10, // Default minimum stock level
        category: "General", // You can add category field to Product model if needed
        lastUpdated: "Recently", // You can add updatedAt field to Product model if needed
        isOutOfStock,
        isLowStock
      }
    })

    return NextResponse.json({
      stockAlerts: formattedAlerts
    })

  } catch (error) {
    console.error("Error fetching stock alerts:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
} 