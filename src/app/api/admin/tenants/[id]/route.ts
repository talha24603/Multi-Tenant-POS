import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/prismaClient";

// GET /api/admin/tenants/[id] - Get detailed tenant information
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    
    if (session?.user?.role !== "superAdmin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tenant = await prisma.tenant.findUnique({
      where: { id: params.id },
      include: {
        users: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
              }
            }
          }
        }
      }
    });

    if (!tenant) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 404 });
    }

    return NextResponse.json(tenant);
  } catch (error) {
    console.error("Error fetching tenant details:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 