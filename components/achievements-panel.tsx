"use client"

import { Card } from "@/components/ui/card"
import { AchievementBadge } from "./achievement-badge"

interface Achievement {
  id: string
  title: string
  description: string
  icon: "trophy" | "flame" | "zap" | "target"
  unlocked: boolean
}

interface AchievementsPanelProps {
  achievements: Achievement[]
}

export function AchievementsPanel({ achievements }: AchievementsPanelProps) {
  const unlockedCount = achievements.filter((a) => a.unlocked).length

  return (
    <Card className="bg-purple-800/50 border-purple-700 p-6 mb-8">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-white mb-2">Achievements</h3>
        <p className="text-purple-300 text-sm">
          {unlockedCount} of {achievements.length} unlocked
        </p>
        <div className="w-full bg-purple-700/50 rounded-full h-2 mt-2">
          <div
            className="bg-gradient-to-r from-yellow-400 to-orange-400 h-2 rounded-full transition-all"
            style={{ width: `${(unlockedCount / achievements.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {achievements.map((achievement) => (
          <AchievementBadge key={achievement.id} achievement={achievement} />
        ))}
      </div>
    </Card>
  )
}
