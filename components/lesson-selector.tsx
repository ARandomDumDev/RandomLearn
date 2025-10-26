"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Lock } from "lucide-react"

interface LessonSelectorProps {
  onSelectLesson: (type: string) => void
  onSelectAssessment: () => void
  hasCompletedAssessment: boolean
}

export function LessonSelector({ onSelectLesson, onSelectAssessment, hasCompletedAssessment }: LessonSelectorProps) {
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchCompletedLessons()
  }, [])

  const fetchCompletedLessons = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      const { data } = await supabase
        .from("personalized_lessons")
        .select("lesson_type")
        .eq("user_id", user.id)
        .eq("completed", true)

      const completed = new Set(data?.map((l) => l.lesson_type) || [])
      setCompletedLessons(completed)
    } catch (error) {
      console.error("[v0] Error fetching completed lessons:", error)
    } finally {
      setLoading(false)
    }
  }

  const lessonTypes = [
    { type: "grammar", label: "Grammar", description: "Master grammar rules and structures" },
    { type: "vocabulary", label: "Vocabulary", description: "Expand your word knowledge" },
    { type: "writing", label: "Writing", description: "Improve your writing skills" },
    { type: "speaking", label: "Speaking", description: "Practice pronunciation and fluency" },
    { type: "listening", label: "Listening", description: "Develop listening comprehension" },
  ]

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">Loading lessons...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {!hasCompletedAssessment && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-900">Start with Assessment</CardTitle>
            <CardDescription className="text-blue-700">
              Complete the initial assessment to personalize your learning path
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={onSelectAssessment} className="w-full bg-blue-600 hover:bg-blue-700">
              Take Assessment
            </Button>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Available Lessons</CardTitle>
          <CardDescription>Select a lesson to begin learning</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {lessonTypes.map((lesson) => {
              const isCompleted = completedLessons.has(lesson.type)
              return (
                <div
                  key={lesson.type}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    isCompleted
                      ? "border-gray-300 bg-gray-50 cursor-not-allowed"
                      : "border-purple-200 hover:border-purple-400 hover:bg-purple-50"
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-900">{lesson.label}</h3>
                      <p className="text-sm text-gray-600">{lesson.description}</p>
                    </div>
                    {isCompleted && <Lock className="w-5 h-5 text-gray-400 flex-shrink-0" />}
                  </div>
                  {isCompleted && (
                    <Badge variant="secondary" className="mb-3">
                      Completed
                    </Badge>
                  )}
                  <Button
                    onClick={() => onSelectLesson(lesson.type)}
                    disabled={isCompleted}
                    className="w-full"
                    variant={isCompleted ? "outline" : "default"}
                  >
                    {isCompleted ? "Lesson Locked" : "Start Lesson"}
                  </Button>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
