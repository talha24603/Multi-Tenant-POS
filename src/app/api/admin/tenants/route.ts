import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/prismaClient";

// GET /api/admin/tenants - Get all tenants
export async function GET() {
  try {
    const session = await auth();
    
    if (session?.user?.role !== "superAdmin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tenants = await prisma.tenant.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        users: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              }
            }
          }
        },
        _count: {
          select: {
            users: true,
            products: true,
            Customer: true,
            Sale: true,
          }
        }
      }
    });

    return NextResponse.json(tenants);
  } catch (error) {
    console.error("Error fetching tenants:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PATCH /api/admin/tenants - Update tenant status
export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();
    
    if (session?.user?.role !== "superAdmin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { tenantId, status } = await request.json();

    if (!tenantId || !status) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const updatedTenant = await prisma.tenant.update({
      where: { id: tenantId },
      data: { status },
      include: {
        users: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              }
            }
          }
        },
        _count: {
          select: {
            users: true,
            products: true,
            Customer: true,
            Sale: true,
          }
        }
      }
    });

    return NextResponse.json(updatedTenant);
  } catch (error) {
    console.error("Error updating tenant:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE /api/admin/tenants - Delete tenant
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    
    if (session?.user?.role !== "superAdmin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get("tenantId");

    if (!tenantId) {
      return NextResponse.json({ error: "Missing tenant ID" }, { status: 400 });
    }

    // Delete the tenant (this will cascade delete related records)
    await prisma.tenant.delete({
      where: { id: tenantId }
    });

    return NextResponse.json({ message: "Tenant deleted successfully" });
  } catch (error) {
    console.error("Error deleting tenant:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 