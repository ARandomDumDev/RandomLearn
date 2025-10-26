"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { QuestionCard } from "./question-card"
import { SuccessAnimation } from "./success-animation"
import { LevelUpAnimation } from "./level-up-animation"
import { useGameState } from "@/hooks/use-game-state"
import { sampleCourses } from "@/lib/sample-courses"
import { sampleLessons } from "@/lib/sample-lessons"

interface LessonViewProps {
  courseId: string | null
  onBack: () => void
}

export function LessonView({ courseId, onBack }: LessonViewProps) {
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [showSuccess, setShowSuccess] = useState(false)
  const [xpGained, setXpGained] = useState(0)
  const [showLevelUp, setShowLevelUp] = useState(false)
  const [newLevel, setNewLevel] = useState(0)
  const { stats, updateStats } = useGameState()

  const course = sampleCourses.find((c) => c.id === courseId)
  const lessons = sampleLessons[courseId as keyof typeof sampleLessons] || []
  const currentLesson = lessons[currentLessonIndex]
  const currentQuestion = currentLesson?.questions[currentQuestionIndex]
  const currentLevel = Math.floor(stats.totalXP / 100) + 1

  if (!course || !currentLesson || !currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-white">Loading...</p>
      </div>
    )
  }

  const handleAnswerCorrect = () => {
    const xp = 10 + currentQuestion.difficulty * 5
    setXpGained(xp)
    setShowSuccess(true)

    const newTotalXP = stats.totalXP + xp
    const newLevel = Math.floor(newTotalXP / 100) + 1
    const oldLevel = currentLevel

    updateStats({ xp, streak: 1, lessonsCompleted: stats.lessonsCompleted + 1 })

    // Check for level up
    if (newLevel > oldLevel) {
      setNewLevel(newLevel)
      setShowLevelUp(true)
    }

    setTimeout(() => {
      setShowSuccess(false)
      if (currentQuestionIndex < currentLesson.questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1)
      } else if (currentLessonIndex < lessons.length - 1) {
        setCurrentLessonIndex(currentLessonIndex + 1)
        setCurrentQuestionIndex(0)
      } else {
        onBack()
      }
    }, 2000)
  }

  const handleAnswerWrong = () => {
    if (currentQuestionIndex < currentLesson.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else if (currentLessonIndex < lessons.length - 1) {
      setCurrentLessonIndex(currentLessonIndex + 1)
      setCurrentQuestionIndex(0)
    } else {
      onBack()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-purple-800 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button onClick={onBack} variant="ghost" className="text-white hover:bg-purple-800">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </Button>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white">{course.title}</h2>
            <p className="text-purple-300 text-sm">
              Lesson {currentLessonIndex + 1} of {lessons.length}
            </p>
          </div>
          <div className="w-12" />
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-purple-300 mb-2">
            <span>
              Question {currentQuestionIndex + 1} of {currentLesson.questions.length}
            </span>
            <span>
              {Math.round(
                ((currentLessonIndex * currentLesson.questions.length + currentQuestionIndex + 1) /
                  (lessons.length * currentLesson.questions.length)) *
                  100,
              )}
              %
            </span>
          </div>
          <div className="w-full bg-purple-800/50 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-400 to-purple-400 h-2 rounded-full transition-all"
              style={{
                width: `${((currentLessonIndex * currentLesson.questions.length + currentQuestionIndex + 1) / (lessons.length * currentLesson.questions.length)) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Question Card */}
        <QuestionCard question={currentQuestion} onCorrect={handleAnswerCorrect} onWrong={handleAnswerWrong} />

        {/* Success Animation */}
        {showSuccess && <SuccessAnimation xp={xpGained} />}

        {/* Level Up Animation */}
        {showLevelUp && <LevelUpAnimation newLevel={newLevel} onComplete={() => setShowLevelUp(false)} />}
      </div>
    </div>
  )
}
