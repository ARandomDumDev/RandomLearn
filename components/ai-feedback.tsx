"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, MessageCircle } from "lucide-react"

interface AIFeedbackProps {
  question: string
  userAnswer: string
  correctAnswer: string
  explanation: string
}

export function AIFeedback({ question, userAnswer, correctAnswer, explanation }: AIFeedbackProps) {
  const [feedback, setFeedback] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const generateFeedback = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/ai-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question,
          userAnswer,
          correctAnswer,
          explanation,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setFeedback(data.feedback)
      }
    } catch (error) {
      console.error("Error generating feedback:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="bg-blue-500/10 border-blue-500/30 p-4 mt-4">
      <div className="flex items-start gap-3">
        <MessageCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-1" />
        <div className="flex-1">
          <h4 className="font-semibold text-white mb-2">AI Feedback</h4>
          {feedback ? (
            <p className="text-purple-100 text-sm">{feedback}</p>
          ) : (
            <Button
              onClick={generateFeedback}
              disabled={loading}
              size="sm"
              variant="ghost"
              className="text-blue-300 hover:bg-blue-500/20"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Get AI Feedback
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </Card>
  )
}
