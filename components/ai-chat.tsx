"use client"

import { useState, useRef, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Send, Loader2 } from "lucide-react"

interface Message {
  role: "user" | "assistant"
  content: string
}

interface AIChatProps {
  courseId: string
  onClose: () => void
}

export function AIChat({ courseId, onClose }: AIChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hi! I'm your English learning assistant. Ask me anything about grammar, vocabulary, or practice speaking!",
    },
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage = input
    setInput("")
    setMessages((prev) => [...prev, { role: "user", content: userMessage }])
    setLoading(true)

    try {
      const response = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, { role: "user", content: userMessage }],
          courseId,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setMessages((prev) => [...prev, { role: "assistant", content: data.message }])
      }
    } catch (error) {
      console.error("Error sending message:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="bg-purple-800/50 border-purple-700 p-6 h-96 flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-white">AI Assistant</h3>
        <Button onClick={onClose} variant="ghost" className="text-purple-300 hover:bg-purple-700">
          Close
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto mb-4 space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-xs px-4 py-2 rounded-lg ${
                msg.role === "user" ? "bg-blue-600 text-white" : "bg-purple-700 text-purple-100"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-purple-700 text-purple-100 px-4 py-2 rounded-lg">
              <Loader2 className="w-4 h-4 animate-spin" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSend()}
          placeholder="Ask me anything..."
          className="flex-1 px-4 py-2 rounded-lg bg-purple-700/50 border border-purple-600 text-white placeholder-purple-400 focus:outline-none focus:border-blue-400"
          disabled={loading}
        />
        <Button
          onClick={handleSend}
          disabled={loading || !input.trim()}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  )
}
