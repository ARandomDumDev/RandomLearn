"use client"

import { Card } from "@/components/ui/card"
import { Trophy, Flame, Zap, Target } from "lucide-react"

interface Achievement {
  id: string
  title: string
  description: string
  icon: "trophy" | "flame" | "zap" | "target"
  unlocked: boolean
}

interface AchievementBadgeProps {
  achievement: Achievement
}

const iconMap = {
  trophy: Trophy,
  flame: Flame,
  zap: Zap,
  target: Target,
}

export function AchievementBadge({ achievement }: AchievementBadgeProps) {
  const Icon = iconMap[achievement.icon]

  return (
    <Card
      className={`p-4 text-center transition-all ${
        achievement.unlocked
          ? "bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-500/50"
          : "bg-purple-800/30 border-purple-700/50 opacity-50"
      }`}
    >
      <Icon className={`w-8 h-8 mx-auto mb-2 ${achievement.unlocked ? "text-yellow-400" : "text-purple-400"}`} />
      <h4 className="font-semibold text-white text-sm">{achievement.title}</h4>
      <p className="text-xs text-purple-300">{achievement.description}</p>
    </Card>
  )
}
