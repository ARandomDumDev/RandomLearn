"use client"

import { useState, useEffect } from "react"

interface GameStats {
  streak: number
  totalXP: number
  lessonsCompleted: number
  accuracyRate: number
}

export function useGameState() {
  const [stats, setStats] = useState<GameStats>({
    streak: 0,
    totalXP: 0,
    lessonsCompleted: 0,
    accuracyRate: 0,
  })

  useEffect(() => {
    // Load stats from localStorage
    const saved = localStorage.getItem("randomlearn-stats")
    if (saved) {
      setStats(JSON.parse(saved))
    }
  }, [])

  const updateStats = (updates: Partial<GameStats>) => {
    setStats((prev) => {
      const newStats = { ...prev, ...updates }
      localStorage.setItem("randomlearn-stats", JSON.stringify(newStats))
      return newStats
    })
  }

  return { stats, updateStats }
}
