"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { usePersistentXP } from "@/hooks/use-persistent-xp"
import { Lock } from "lucide-react"
import type { Lesson } from "@/lib/lesson-generator"

interface AssessmentLessonProps {
  onComplete?: (xpEarned: number) => void
  onBack?: () => void
}

export function AssessmentLesson({ onComplete, onBack }: AssessmentLessonProps) {
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [loading, setLoading] = useState(true)
  const [totalXp, setTotalXp] = useState(0)
  const [completedQuestions, setCompletedQuestions] = useState<Set<number>>(new Set())
  const { addXP } = usePersistentXP()
  const supabase = createClient()

  useEffect(() => {
    fetchAssessment()
  }, [])

  const fetchAssessment = async () => {
    try {
      const response = await fetch("/api/lessons/assessment")
      if (response.status === 403) {
        console.log("[v0] Assessment already completed")
        setLoading(false)
        return
      }
      const data = await response.json()
      setLesson(data)
      setLoading(false)
    } catch (error) {
      console.error("[v0] Error fetching assessment:", error)
      setLoading(false)
    }
  }

  const handleAnswerSubmit = async () => {
    if (!lesson || !selectedAnswer) return

    const currentQuestion = lesson.questions[currentQuestionIndex]
    const correct = selectedAnswer === currentQuestion.correctAnswer
    setIsCorrect(correct)
    setShowFeedback(true)

    setCompletedQuestions((prev) => new Set(prev).add(currentQuestionIndex))

    const xpEarned = correct ? 10 : 5
    setTotalXp((prev) => prev + xpEarned)

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (user) {
      await supabase.from("user_progress").insert({
        user_id: user.id,
        lesson_id: lesson.id,
        question_index: currentQuestionIndex,
        answer: selectedAnswer,
        is_correct: correct,
        xp_earned: xpEarned,
        completed_at: new Date().toISOString(),
      })
    }
  }

  const handleNext = async () => {
    if (!lesson) return

    if (currentQuestionIndex < lesson.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1)
      setSelectedAnswer(null)
      setShowFeedback(false)
    } else {
      // Mark assessment as completed
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        const { data: assessmentLesson } = await supabase
          .from("personalized_lessons")
          .select("id")
          .eq("user_id", user.id)
          .eq("lesson_type", "assessment")
          .limit(1)
          .single()

        if (assessmentLesson) {
          await supabase.from("personalized_lessons").update({ completed: true }).eq("id", assessmentLesson.id)
        }
      }

      const result = await addXP(totalXp)
      if (result) {
        console.log("[v0] Assessment XP added successfully:", result)
        onComplete?.(totalXp)
      }
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">Loading assessment...</div>
        </CardContent>
      </Card>
    )
  }

  if (!lesson) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">Assessment already completed or failed to load</div>
        </CardContent>
      </Card>
    )
  }

  const currentQuestion = lesson.questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / lesson.questions.length) * 100
  const isQuestionCompleted = completedQuestions.has(currentQuestionIndex)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle>{lesson.title}</CardTitle>
              <CardDescription>{lesson.description}</CardDescription>
            </div>
            <Badge variant="outline">Assessment</Badge>
          </div>
          <Progress value={progress} className="mt-4" />
          <p className="text-sm text-muted-foreground mt-2">
            Question {currentQuestionIndex + 1} of {lesson.questions.length}
          </p>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{currentQuestion.question}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {currentQuestion.type === "multiple-choice" && currentQuestion.options && (
            <div className="space-y-2">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => !showFeedback && setSelectedAnswer(option)}
                  className={`w-full p-3 text-left rounded-lg border-2 transition-colors ${
                    selectedAnswer === option
                      ? "border-purple-500 bg-purple-50"
                      : "border-gray-200 hover:border-gray-300"
                  } ${showFeedback && option === currentQuestion.correctAnswer ? "border-green-500 bg-green-50" : ""} ${
                    showFeedback && selectedAnswer === option && !isCorrect ? "border-red-500 bg-red-50" : ""
                  }`}
                  disabled={showFeedback}
                >
                  {option}
                </button>
              ))}
            </div>
          )}

          {currentQuestion.type === "fill-in" && (
            <div>
              <input
                type="text"
                value={selectedAnswer || ""}
                onChange={(e) => !showFeedback && setSelectedAnswer(e.target.value)}
                placeholder="Type your answer..."
                disabled={showFeedback}
                className="w-full p-3 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-purple-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>
          )}

          {showFeedback && (
            <div className={`p-4 rounded-lg ${isCorrect ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}>
              <p className="font-medium">{isCorrect ? "Correct!" : "Not quite right"}</p>
              <p className="text-sm mt-2">{currentQuestion.explanation}</p>
            </div>
          )}

          <div className="flex gap-2 pt-4">
            {!showFeedback ? (
              <Button onClick={handleAnswerSubmit} disabled={!selectedAnswer} className="flex-1">
                Check Answer
              </Button>
            ) : (
              <Button onClick={handleNext} className="flex-1">
                {currentQuestionIndex === lesson.questions.length - 1 ? "Complete Assessment" : "Next Question"}
              </Button>
            )}
            {currentQuestionIndex === 0 && !showFeedback && (
              <Button onClick={onBack} variant="outline">
                Back
              </Button>
            )}
          </div>

          {isQuestionCompleted && showFeedback && (
            <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg text-blue-800 text-sm">
              <Lock className="w-4 h-4" />
              <span>This question is locked. You cannot change your answer.</span>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground">
            XP Earned: <span className="font-bold text-purple-600">{totalXp}</span>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
