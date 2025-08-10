import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/prismaClient";

export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Super admin doesn't need tenant status check
    if (session.user.role === "superAdmin") {
      return NextResponse.json({ 
        status: "ACTIVE", 
        isSuperAdmin: true,
        message: "Super admin access" 
      });
    }

    // Get tenant status for regular users
    if (!session.user.tenantId) {
      return NextResponse.json({ 
        error: "No tenant assigned" 
      }, { status: 404 });
    }

    const tenant = await prisma.tenant.findUnique({
      where: { id: session.user.tenantId },
      select: {
        id: true,
        name: true,
        status: true,
        subscriptionStatus: true,
        subscriptionEndDate: true,
      }
    });

    if (!tenant) {
      return NextResponse.json({ 
        error: "Tenant not found" 
      }, { status: 404 });
    }

    return NextResponse.json({
      tenantId: tenant.id,
      tenantName: tenant.name,
      status: tenant.status,
      subscriptionStatus: tenant.subscriptionStatus,
      subscriptionEndDate: tenant.subscriptionEndDate,
      isActive: tenant.status === "ACTIVE",
    });

  } catch (error) {
    console.error("Error fetching tenant status:", error);
    return NextResponse.json({ 
      error: "Internal server error" 
    }, { status: 500 });
  }
}
