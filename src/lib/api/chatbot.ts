export interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  createdAt: Date
}

export interface ChatbotResponse {
  answer: string
}

export async function sendChatQuestion(
  tenant_id: string,
  question: string
): Promise<string> {
  const response = await fetch("/api/chatbot", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ tenant_id, question }),
  })

  if (!response.ok) {
    let errorMessage = `Request failed (${response.status})`
    try {
      const errorBody = await response.json()
      errorMessage = errorBody.error ?? errorBody.message ?? errorMessage
    } catch {
      // ignore parse errors
    }
    throw new Error(errorMessage)
  }

  const data = (await response.json()) as Partial<ChatbotResponse> & {
    message?: string
    response?: string
  }

  const answer = data.answer ?? data.message ?? data.response
  if (!answer) {
    throw new Error("Chatbot returned an empty response")
  }

  return answer
}
