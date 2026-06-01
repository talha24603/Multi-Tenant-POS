"use client"

import { useEffect, useRef, useState } from "react"
import { useSession } from "next-auth/react"
import { Bot, Loader2, MessageCircle, Send, Trash2, X } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { sendChatQuestion, type ChatMessage } from "@/lib/api/chatbot"
import { ChatbotMessageContent } from "@/components/chatbot/chatbot-message-content"

function createMessage(role: ChatMessage["role"], content: string): ChatMessage {
  return {
    id: crypto.randomUUID(),
    role,
    content,
    createdAt: new Date(),
  }
}

export function ChatbotWidget() {
  const { data: session } = useSession()
  const tenant_id = session?.user?.tenantId

  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<ChatMessage[]>([
    createMessage(
      "assistant",
      "Hi! Ask me anything about your store — products, sales, customers, and more."
    ),
  ])
  const [isLoading, setIsLoading] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isLoading])

  useEffect(() => {
    if (isOpen) {
      textareaRef.current?.focus()
    }
  }, [isOpen])

  const handleSend = async () => {
    const question = input.trim()
    if (!question || isLoading) return

    if (!tenant_id) {
      toast.error("No tenant found. Please sign in with a store account.")
      return
    }

    const userMessage = createMessage("user", question)
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const answer = await sendChatQuestion(tenant_id, question)
      setMessages((prev) => [...prev, createMessage("assistant", answer)])
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to get a response"
      toast.error(message)
      setMessages((prev) => [
        ...prev,
        createMessage("assistant", "Sorry, I couldn't process that request. Please try again."),
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault()
      handleSend()
    }
  }

  const handleClear = () => {
    setMessages([
      createMessage(
        "assistant",
        "Hi! Ask me anything about your store — products, sales, customers, and more."
      ),
    ])
  }

  if (!tenant_id) {
    return null
  }

  return (
    <>
      {isOpen && (
        <div
          className="fixed bottom-24 right-6 z-50 flex h-[min(560px,calc(100vh-8rem))] w-[min(400px,calc(100vw-2rem))] flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xl"
        >
          <div className="flex items-center justify-between border-b border-gray-200 bg-blue-600 px-4 py-3 text-white">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              <div>
                <p className="text-sm font-semibold">Store Assistant</p>
                <p className="text-xs text-blue-100">Powered by AI</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white hover:bg-blue-500 hover:text-white"
                onClick={handleClear}
                title="Clear chat"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white hover:bg-blue-500 hover:text-white"
                onClick={() => setIsOpen(false)}
                title="Close"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto bg-gray-50 p-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex",
                  message.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-[85%] rounded-2xl px-4 py-2.5",
                    message.role === "user"
                      ? "rounded-br-md bg-blue-600 text-sm leading-relaxed text-white"
                      : "rounded-bl-md border border-gray-200 bg-white"
                  )}
                >
                  {message.role === "assistant" ? (
                    <ChatbotMessageContent content={message.content} />
                  ) : (
                    message.content
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-center gap-2 rounded-2xl rounded-bl-md border border-gray-200 bg-white px-4 py-2 text-sm text-gray-500">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Thinking...
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-gray-200 bg-white p-3">
            <div className="flex gap-2">
              <Textarea
                ref={textareaRef}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask a question..."
                rows={2}
                disabled={isLoading}
                className="min-h-[44px] resize-none"
              />
              <Button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="h-auto shrink-0 bg-blue-600 px-3 hover:bg-blue-700"
                aria-label="Send message"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="mt-2 text-xs text-gray-400">Press Enter to send, Shift+Enter for a new line</p>
          </div>
        </div>
      )}

      <Button
        onClick={() => setIsOpen((open) => !open)}
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-blue-600 shadow-lg hover:bg-blue-700"
        size="icon"
        aria-label={isOpen ? "Close chatbot" : "Open chatbot"}
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </Button>
    </>
  )
}
