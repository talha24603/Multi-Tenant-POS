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
    const whereClause: any = {
      tenants: {
        some: {}
      }
    }

    // If not superAdmin, filter by tenant
    if (session.user.role !== "superAdmin" && session.user.tenantId) {
      whereClause.tenants = {
        some: {
          tenantId: session.user.tenantId
        }
      }
    }

    // Get current date for "this month" calculations
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)

    // Get total users count
    const totalUsers = await prisma.user.count({
      where: whereClause
    })

    // Get active users count (verified users)
    const activeUsers = await prisma.user.count({
      where: {
        ...whereClause,
        isVerified: true
      }
    })

    // Get admin users count (OWNER role)
    const adminUsers = await prisma.user.count({
      where: {
        ...whereClause,
        tenants: {
          some: {
            role: "OWNER"
          }
        }
      }
    })

    // Get new users this month
    const newUsersThisMonth = await prisma.user.count({
      where: {
        ...whereClause,
        createdAt: {
          gte: startOfMonth,
          lte: endOfMonth
        }
      }
    })

    // Get users by role for more detailed stats
    const usersByRole = await prisma.user.findMany({
      where: whereClause,
      include: {
        tenants: {
          select: {
            role: true
          }
        }
      }
    })

    const roleStats = usersByRole.reduce((acc, user) => {
      const role = user.tenants[0]?.role || "Unknown"
      acc[role] = (acc[role] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return NextResponse.json({
      stats: {
        totalUsers,
        activeUsers,
        adminUsers,
        newUsersThisMonth,
        roleStats
      }
    })

  } catch (error) {
    console.error("Error fetching user stats:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
} 