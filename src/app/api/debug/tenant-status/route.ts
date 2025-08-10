import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { getToken } from "next-auth/jwt";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    const token = await getToken({ req: request });
    
    return NextResponse.json({
      session: session?.user,
      token: token,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Debug error:", error);
    return NextResponse.json({ 
      error: "Debug error",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}
