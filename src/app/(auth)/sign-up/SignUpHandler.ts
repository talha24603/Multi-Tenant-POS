'use server'
import prisma from '@/prismaClient'
import { hash } from 'bcryptjs'
import axios from 'axios'

export default async function SignUpHandler(payload: { email: string, password: string, name: string }) {
  const email = payload.email
  const password = payload.password
  const name = payload.name

  // … validation, duplicate-email check …
  const alreadyEmail = await prisma.user.findUnique({
    where: { email }
  })
  if (alreadyEmail) {
    return { alreadyIsAlready: 'Already has email' }
  }

  const otp = Math.floor(Math.random() * 900_000 + 100_000).toString()
  const otpExpiry = new Date(Date.now() + 60 * 60 * 1000)

  // ————— Using Axios instead of fetch —————
  try {
    // build your absolute URL
    const resendUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/send-email`

    // POST { email, verifyCode: otp }
    const response = await axios.post(resendUrl, {
      email,
      subject: 'Verify your email',
      message: `Your verification code is ${otp}`,
    })

    // Axios will throw on non-2xx, but you can still check:
    if (response.status !== 200) {
      return { error: 'Failed to send verification email' }
    }
  } catch (err) {
    console.error('Resend email error:', err)
    return { error: 'Failed to send verification email' }
  }

  // Only create user after email sent
  const hashedPassword = await hash(password, 10)
  await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      otp,
      otpExpiresAt: otpExpiry,
      role: 'tenantadmin' as string,
    },
  })

  return {
    redirectUrl: `verifyCode?email=${encodeURIComponent(email)}`,
  }
}
