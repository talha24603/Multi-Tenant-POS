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

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const search = searchParams.get("search") || ""
    const role = searchParams.get("role") || ""
    const status = searchParams.get("status") || ""

    const skip = (page - 1) * limit

    // Build where clause
    const whereClause: any = {
      tenants: {
        some: {}
      }
    }

    // Add search filter
    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } }
      ]
    }

    // Add role filter
    if (role) {
      whereClause.tenants = {
        some: {
          role: role
        }
      }
    }

    // Add status filter
    if (status === "active") {
      whereClause.isVerified = true
    } else if (status === "inactive") {
      whereClause.isVerified = false
    }

    // If not superAdmin, filter by tenant
    if (session.user.role !== "superAdmin" && session.user.tenantId) {
      whereClause.tenants = {
        some: {
          tenantId: session.user.tenantId
        }
      }
    }

    // Get users with their tenant relationships
    const users = await prisma.user.findMany({
      where: whereClause,
      include: {
        tenants: {
          include: {
            tenant: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      },
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc"
      }
    })

    // Get total count for pagination
    const total = await prisma.user.count({
      where: whereClause
    })

    // Transform the data to match the frontend expectations
    const transformedUsers = users.map(user => {
      const tenantUser = user.tenants[0] // Get the first tenant relationship
      return {
        id: user.id,
        name: user.name || "Unknown",
        email: user.email,
        role: tenantUser?.role || "Unknown",
        tenant: tenantUser?.tenant?.name || "Unknown",
        status: user.isVerified ? "active" : "inactive",
        // lastLogin: user.createdAt.toISOString(), // Using createdAt as placeholder for lastLogin
        avatar: null,
        isVerified: user.isVerified,
        createdAt: user.createdAt.toISOString()
      }
    })

    return NextResponse.json({
      users: transformedUsers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
} 