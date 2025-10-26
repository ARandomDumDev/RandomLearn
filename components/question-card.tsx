"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle } from "lucide-react"
import { AIFeedback } from "./ai-feedback"
import { AudioPlayer } from "./audio-player"
import { useSound } from "@/hooks/use-sound"

interface Question {
  type: "multiple-choice" | "fill-in" | "listening" | "speaking"
  prompt: string
  choices?: string[]
  answer: string
  explanation: string
  difficulty: number
}

interface QuestionCardProps {
  question: Question
  onCorrect: () => void
  onWrong: () => void
}

export function QuestionCard({ question, onCorrect, onWrong }: QuestionCardProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const { playSound } = useSound()
  const soundEnabled =
    typeof window !== "undefined" && JSON.parse(localStorage.getItem("randomlearn-sound-enabled") ?? "true")

  const handleSubmit = () => {
    const correct = selectedAnswer === question.answer
    setIsCorrect(correct)
    setSubmitted(true)

    if (soundEnabled) {
      playSound(correct ? "correct" : "wrong")
    }

    setTimeout(() => {
      if (correct) {
        onCorrect()
      } else {
        onWrong()
      }
    }, 1500)
  }

  return (
    <Card className="bg-purple-800/50 border-purple-700 p-8 text-white">
      {/* Question Prompt */}
      <div className="mb-8">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-2xl font-bold">{question.prompt}</h3>
          {question.type === "listening" && <AudioPlayer text={question.prompt} />}
        </div>
        <p className="text-purple-300 text-sm">
          Type: <span className="capitalize">{question.type.replace("-", " ")}</span>
        </p>
      </div>

      {/* Answer Options */}
      {question.type === "multiple-choice" && (
        <div className="space-y-3 mb-8">
          {question.choices?.map((choice, index) => (
            <button
              key={index}
              onClick={() => !submitted && setSelectedAnswer(choice)}
              className={`w-full p-4 rounded-lg text-left transition-all ${
                selectedAnswer === choice
                  ? "bg-blue-500 border-2 border-blue-400"
                  : "bg-purple-700/50 border-2 border-purple-600 hover:border-purple-500"
              } ${submitted && choice === question.answer ? "bg-green-500 border-green-400" : ""} ${
                submitted && selectedAnswer === choice && choice !== question.answer ? "bg-red-500 border-red-400" : ""
              }`}
              disabled={submitted}
            >
              {choice}
            </button>
          ))}
        </div>
      )}

      {question.type === "fill-in" && (
        <div className="mb-8">
          <input
            type="text"
            value={selectedAnswer || ""}
            onChange={(e) => !submitted && setSelectedAnswer(e.target.value)}
            placeholder="Type your answer..."
            disabled={submitted}
            className="w-full p-4 rounded-lg bg-purple-700/50 border-2 border-purple-600 text-white placeholder-purple-400 focus:outline-none focus:border-blue-400"
          />
        </div>
      )}

      {/* Explanation */}
      {submitted && (
        <div
          className={`mb-8 p-4 rounded-lg ${isCorrect ? "bg-green-500/20 border-2 border-green-500" : "bg-red-500/20 border-2 border-red-500"}`}
        >
          <div className="flex items-start gap-3">
            {isCorrect ? (
              <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
            ) : (
              <XCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
            )}
            <div>
              <p className="font-semibold mb-2">{isCorrect ? "Correct!" : "Not quite right"}</p>
              <p className="text-sm">{question.explanation}</p>
            </div>
          </div>
        </div>
      )}

      {submitted && !isCorrect && (
        <AIFeedback
          question={question.prompt}
          userAnswer={selectedAnswer || ""}
          correctAnswer={question.answer}
          explanation={question.explanation}
        />
      )}

      {/* Submit Button */}
      {!submitted && (
        <Button
          onClick={handleSubmit}
          disabled={!selectedAnswer}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3"
        >
          Check Answer
        </Button>
      )}
    </Card>
  )
}
