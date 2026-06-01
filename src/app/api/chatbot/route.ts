import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"

function getChatbotApiUrl(): string | null {
  const url =
    process.env.CHATBOT_API_URL ?? process.env.NEXT_PUBLIC_CHATBOT_API_URL
  return url ? url.replace(/\/$/, "") : null
}

export async function POST(request: NextRequest) {
  const session = await auth()

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const baseUrl = getChatbotApiUrl()
  if (!baseUrl) {
    return NextResponse.json(
      { error: "Chatbot service is not configured" },
      { status: 503 }
    )
  }

  let body: { tenantId?: string; question?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  const { tenantId, question } = body

  if (!tenantId || !question?.trim()) {
    return NextResponse.json(
      { error: "tenantId and question are required" },
      { status: 400 }
    )
  }

  if (session.user.tenantId && session.user.tenantId !== tenantId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  try {
    const response = await fetch(`${baseUrl}/assistant`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tenantId, question: question.trim() }),
    })

    const data = await response.json().catch(() => ({}))

    if (!response.ok) {
      const message =
        (data as { error?: string; message?: string }).error ??
        (data as { message?: string }).message ??
        `Chatbot service error (${response.status})`
      return NextResponse.json({ error: message }, { status: response.status })
    }

    return NextResponse.json(data)
  } catch {
    return NextResponse.json(
      { error: "Failed to reach chatbot service" },
      { status: 502 }
    )
  }
}
