"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Lock } from "lucide-react"

interface CourseCardProps {
  course: {
    id: string
    title: string
    description: string
    color: string
    icon: string
    progress: number
    locked: boolean
  }
  onSelect: () => void
}

export function CourseCard({ course, onSelect }: CourseCardProps) {
  return (
    <Card className={`overflow-hidden cursor-pointer transition-all hover:scale-105 ${course.color}`}>
      <div className="p-6 text-white">
        <div className="flex items-start justify-between mb-4">
          <div className="text-4xl">{course.icon}</div>
          {course.locked && <Lock className="w-5 h-5" />}
        </div>
        <h3 className="text-xl font-bold mb-2">{course.title}</h3>
        <p className="text-sm opacity-90 mb-4">{course.description}</p>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-xs mb-1">
            <span>Progress</span>
            <span>{course.progress}%</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <div className="bg-white h-2 rounded-full transition-all" style={{ width: `${course.progress}%` }} />
          </div>
        </div>

        <Button
          onClick={onSelect}
          disabled={course.locked}
          className="w-full bg-white text-gray-900 hover:bg-gray-100 font-semibold"
        >
          {course.locked ? "Locked" : "Start Lesson"}
        </Button>
      </div>
    </Card>
  )
}
