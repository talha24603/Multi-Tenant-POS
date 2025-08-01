import { NextResponse } from "next/server"
import nodemailer from "nodemailer"
import type SMTPTransport from "nodemailer/lib/smtp-transport"

export async function POST(req: Request) {
  const { email, subject, message } = await req.json()
  console.log("Sending email to:", email);
  

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || "587"),
    secure: true, // true if using port 465
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  } as SMTPTransport.Options) // ✅ This is what you need

  try {
    await transporter.sendMail({
      from: `"POS" <${process.env.SMTP_USER}>`,
      to: email,
      subject,
      html: message,
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("Email error:", err)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
