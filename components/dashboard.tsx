"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Flame, Zap, TrendingUp } from "lucide-react"
import { CourseCard } from "./course-card"
import { StatsPanel } from "./stats-panel"
import { RandomTip } from "./random-tip"
import { AchievementsPanel } from "./achievements-panel"
import { useGameState } from "@/hooks/use-game-state"
import { useAchievements } from "@/hooks/use-achievements"
import { sampleCourses } from "@/lib/sample-courses"

interface DashboardProps {
  onSelectCourse: (courseId: string) => void
}

export function Dashboard({ onSelectCourse }: DashboardProps) {
  const { stats, updateStats } = useGameState()
  const { achievements, checkAchievements } = useAchievements()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    checkAchievements(stats)
  }, [stats])

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-purple-800 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">RandomLearn</h1>
            <p className="text-purple-200">Master English through adaptive learning</p>
          </div>
          <img src="/logo.webp" alt="RandomLearn" className="w-16 h-16 md:w-20 md:h-20" />
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-purple-800/50 border-purple-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-300 text-sm mb-1">Daily Streak</p>
                <p className="text-3xl font-bold text-yellow-400">{stats.streak}</p>
              </div>
              <Flame className="w-8 h-8 text-orange-400" />
            </div>
          </Card>

          <Card className="bg-purple-800/50 border-purple-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-300 text-sm mb-1">Total XP</p>
                <p className="text-3xl font-bold text-blue-400">{stats.totalXP}</p>
              </div>
              <Zap className="w-8 h-8 text-yellow-300" />
            </div>
          </Card>

          <Card className="bg-purple-800/50 border-purple-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-300 text-sm mb-1">Level</p>
                <p className="text-3xl font-bold text-green-400">{Math.floor(stats.totalXP / 100) + 1}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-400" />
            </div>
          </Card>
        </div>

        {/* Achievements Panel */}
        <AchievementsPanel achievements={achievements} />

        {/* Stats Panel */}
        <StatsPanel stats={stats} />

        {/* Random Tip */}
        <RandomTip />

        {/* Courses Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-white mb-6">Available Courses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sampleCourses.map((course) => (
              <CourseCard key={course.id} course={course} onSelect={() => onSelectCourse(course.id)} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
