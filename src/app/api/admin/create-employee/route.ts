import { NextRequest, NextResponse } from "next/server"
import { hash } from "bcryptjs"
import prisma from "@/prismaClient"
import { auth } from "@/auth"

export async function POST(request: NextRequest) {
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

    const body = await request.json()
    const { name, email, password, role} = body

    // Validate required fields
    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { error: "Name, email, password, and role are required" },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address" },
        { status: 400 }
      )
    }

    // // Validate password strength
    // if (password.length < 6) {
    //   return NextResponse.json(
    //     { error: "Password must be at least 6 characters long" },
    //     { status: 400 }
    //   )
    // }

    // Validate role
    if (!["MANAGER", "CASHIER"].includes(role)) {
      return NextResponse.json(
        { error: "Invalid role. Must be MANAGER or CASHIER" },
        { status: 400 }
      )
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "A user with this email already exists" },
        { status: 409 }
      )
    }

    // Hash the password
    const hashedPassword = await hash(password, 12)

    // Get the tenant ID for the current admin
    let tenantId = session.user.tenantId

   

    // Create the user
    const newUser = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        isVerified: true, // Admin-created accounts are pre-verified
        provider: "credentials"
      }
    })

    // Create the tenant-user relationship
    await prisma.tenantUser.create({
      data: {
        userId: newUser.id,
        tenantId: tenantId as string,
        role: role
      }
    })

    // Send welcome email to the new employee
    try {
      const emailSubject = "Welcome to Your New Employee Account"
      const emailMessage = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Welcome to Your New Employee Account</h2>
          <p>Hello ${name},</p>
          <p>Your employee account has been successfully created by the administrator.</p>
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Account Details:</h3>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Role:</strong> ${role}</p>
            <p><strong>Status:</strong> Active</p>
          </div>
          <p>You can now log in to your account using your email and the password that was set during account creation.</p>
          <p>If you have any questions or need assistance, please contact your administrator.</p>
          <p>Best regards,<br>The POS Team</p>
        </div>
      `

      await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/send-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          subject: emailSubject,
          message: emailMessage,
        }),
      })
    } catch (emailError) {
      console.error("Failed to send welcome email:", emailError)
      // Don't fail the entire request if email fails
    }

    // Return success response
    return NextResponse.json({
      message: "Employee account created successfully",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: role,
        isVerified: newUser.isVerified
      }
    }, { status: 201 })

  } catch (error) {
    console.error("Error creating employee:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
} 