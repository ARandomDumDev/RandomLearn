"use client"

import { useState, useEffect } from "react"

interface Achievement {
  id: string
  title: string
  description: string
  icon: "trophy" | "flame" | "zap" | "target"
  unlocked: boolean
}

const defaultAchievements: Achievement[] = [
  {
    id: "first-lesson",
    title: "First Steps",
    description: "Complete your first lesson",
    icon: "target",
    unlocked: false,
  },
  {
    id: "streak-7",
    title: "Week Warrior",
    description: "Maintain a 7-day streak",
    icon: "flame",
    unlocked: false,
  },
  {
    id: "streak-30",
    title: "Monthly Master",
    description: "Maintain a 30-day streak",
    icon: "flame",
    unlocked: false,
  },
  {
    id: "level-10",
    title: "Level 10",
    description: "Reach level 10",
    icon: "zap",
    unlocked: false,
  },
  {
    id: "perfect-lesson",
    title: "Perfect Score",
    description: "Get 100% on a lesson",
    icon: "trophy",
    unlocked: false,
  },
  {
    id: "xp-1000",
    title: "Thousand XP",
    description: "Earn 1000 XP",
    icon: "zap",
    unlocked: false,
  },
  {
    id: "all-courses",
    title: "Course Master",
    description: "Complete all courses",
    icon: "trophy",
    unlocked: false,
  },
  {
    id: "ai-chat",
    title: "Conversationalist",
    description: "Use AI chat 10 times",
    icon: "target",
    unlocked: false,
  },
]

export function useAchievements() {
  const [achievements, setAchievements] = useState<Achievement[]>(defaultAchievements)

  useEffect(() => {
    const saved = localStorage.getItem("randomlearn-achievements")
    if (saved) {
      setAchievements(JSON.parse(saved))
    }
  }, [])

  const unlockAchievement = (id: string) => {
    setAchievements((prev) => {
      const updated = prev.map((a) => (a.id === id ? { ...a, unlocked: true } : a))
      localStorage.setItem("randomlearn-achievements", JSON.stringify(updated))
      return updated
    })
  }

  const checkAchievements = (stats: any) => {
    if (stats.lessonsCompleted === 1) unlockAchievement("first-lesson")
    if (stats.streak >= 7) unlockAchievement("streak-7")
    if (stats.streak >= 30) unlockAchievement("streak-30")
    if (Math.floor(stats.totalXP / 100) >= 10) unlockAchievement("level-10")
    if (stats.totalXP >= 1000) unlockAchievement("xp-1000")
  }

  return { achievements, unlockAchievement, checkAchievements }
}
