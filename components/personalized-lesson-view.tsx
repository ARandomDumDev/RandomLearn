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

interface PersonalizedLessonViewProps {
  lessonType: string
  onComplete?: (xpEarned: number) => void
  onBack?: () => void
}

export function PersonalizedLessonView({ lessonType, onComplete, onBack }: PersonalizedLessonViewProps) {
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [loading, setLoading] = useState(true)
  const [totalXp, setTotalXp] = useState(0)
  const [lessonId, setLessonId] = useState<string | null>(null)
  const [completedQuestions, setCompletedQuestions] = useState<Set<number>>(new Set())
  const [loadingProgress, setLoadingProgress] = useState(0)
  const { addXP } = usePersistentXP()

  const supabase = createClient()

  useEffect(() => {
    fetchLesson()
  }, [lessonType])

  useEffect(() => {
    if (!loading) return

    const interval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 90) return prev
        return prev + Math.random() * 30
      })
    }, 300)

    return () => clearInterval(interval)
  }, [loading])

  const fetchLesson = async () => {
    try {
      setLoadingProgress(0)
      const response = await fetch(`/api/lessons/personalized?type=${lessonType}`)
      const data = await response.json()
      setLesson(data)
      setLoadingProgress(100)
      setLoading(false)
    } catch (error) {
      console.error("[v0] Error fetching lesson:", error)
      setLoadingProgress(100)
      setLoading(false)
    }
  }

  const handleAnswerSubmit = async () => {
    if (!lesson || !selectedAnswer) return

    const currentQuestion = lesson.lessons[0].questions[currentQuestionIndex]
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
      const { data: progressData } = await supabase
        .from("user_progress")
        .insert({
          user_id: user.id,
          lesson_id: lessonId || lesson.lessons[0].id,
          question_index: currentQuestionIndex,
          answer: selectedAnswer,
          is_correct: correct,
          xp_earned: xpEarned,
          completed_at: new Date().toISOString(),
        })
        .select()

      if (progressData) {
        setLessonId(progressData[0]?.lesson_id)
      }
    }
  }

  const handleNext = async () => {
    if (!lesson) return

    const totalQuestions = lesson.lessons[0].questions.length
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((prev) => prev + 1)
      setSelectedAnswer(null)
      setShowFeedback(false)
    } else {
      const result = await addXP(totalXp)
      if (result) {
        console.log("[v0] XP added successfully:", result)
        onComplete?.(totalXp)
      }
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Generating Lesson</CardTitle>
          <CardDescription>AI is creating your personalized lesson...</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Generating content</span>
              <span>{Math.round(loadingProgress)}%</span>
            </div>
            <Progress value={loadingProgress} className="h-2" />
          </div>
          <div className="text-center text-sm text-muted-foreground">
            <div className="animate-pulse">Creating personalized content for you...</div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!lesson || !lesson.lessons || lesson.lessons.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">Failed to load lesson</div>
        </CardContent>
      </Card>
    )
  }

  const currentQuestion = lesson.lessons[0].questions[currentQuestionIndex]
  const totalQuestions = lesson.lessons[0].questions.length
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100
  const isQuestionCompleted = completedQuestions.has(currentQuestionIndex)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle>{lesson.lessons[0].title}</CardTitle>
              <CardDescription>{lesson.lessons[0].description}</CardDescription>
            </div>
            <Badge variant="outline">Level {lesson.lessons[0].difficulty}</Badge>
          </div>
          <Progress value={progress} className="mt-4" />
          <p className="text-sm text-muted-foreground mt-2">
            Question {currentQuestionIndex + 1} of {totalQuestions}
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
                {currentQuestionIndex === totalQuestions - 1 ? "Complete Lesson" : "Next Question"}
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
