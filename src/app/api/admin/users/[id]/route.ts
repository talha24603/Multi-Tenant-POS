import { NextRequest, NextResponse } from "next/server"
import prisma from "@/prismaClient"
import { auth } from "@/auth"

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const userId = params.id

    // Validate user ID
    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    // Check if the user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        tenants: {
          include: {
            tenant: true
          }
        }
      }
    })

    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Prevent deleting super admin users (unless by another super admin)
    if (existingUser.isSuperAdmin && session.user.role !== "superAdmin") {
      return NextResponse.json({ 
        error: "Cannot delete super admin users" 
      }, { status: 403 })
    }

    // If not super admin, check if user belongs to the same tenant
    if (session.user.role !== "superAdmin" && session.user.tenantId) {
      const userTenant = existingUser.tenants.find(t => t.tenantId === session.user.tenantId)
      if (!userTenant) {
        return NextResponse.json({ 
          error: "Cannot delete users from other tenants" 
        }, { status: 403 })
      }
    }

    // Prevent self-deletion
    if (existingUser.id === session.user.id) {
      return NextResponse.json({ 
        error: "Cannot delete your own account" 
      }, { status: 400 })
    }

    // Check if user has any active sales (optional business rule)
    const userSales = await prisma.sale.findFirst({
      where: { userId: userId }
    })

    if (userSales) {
      return NextResponse.json({ 
        error: "Cannot delete user with existing sales records. Consider deactivating instead." 
      }, { status: 400 })
    }

    // Delete the user (this will cascade delete related records due to Prisma schema)
    await prisma.user.delete({
      where: { id: userId }
    })

    return NextResponse.json({ 
      message: "User deleted successfully" 
    })

  } catch (error) {
    console.error("Error deleting user:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// Optional: Add GET method to get user details
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const userId = params.id

    // Validate user ID
    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    // Get user details
    const user = await prisma.user.findUnique({
      where: { id: userId },
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
      }
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // If not super admin, check if user belongs to the same tenant
    if (session.user.role !== "superAdmin" && session.user.tenantId) {
      const userTenant = user.tenants.find(t => t.tenantId === session.user.tenantId)
      if (!userTenant) {
        return NextResponse.json({ 
          error: "Cannot access users from other tenants" 
        }, { status: 403 })
      }
    }

    // Transform the data to match frontend expectations
    const transformedUser = {
      id: user.id,
      name: user.name || "Unknown",
      email: user.email,
      role: user.tenants[0]?.role || "Unknown",
      tenant: user.tenants[0]?.tenant?.name || "Unknown",
      status: user.isVerified ? "active" : "inactive",
      lastLogin: user.createdAt.toISOString(), // Using createdAt as placeholder for lastLogin
      avatar: null,
      isVerified: user.isVerified,
      createdAt: user.createdAt.toISOString(),
      isSuperAdmin: user.isSuperAdmin
    }

    return NextResponse.json({ user: transformedUser })

  } catch (error) {
    console.error("Error fetching user details:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
