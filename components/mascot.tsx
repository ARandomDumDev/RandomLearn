"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"

const motivationalLines = [
  "You're crushing it! Keep going!",
  "Every mistake is a lesson learned.",
  "Consistency beats perfection every time.",
  "Your future self will thank you.",
  "Learning a language is like climbing a mountain—one step at a time.",
  "Don't trust autocorrect. It's lying to you.",
  "You're closer to fluency than you think!",
  "Mistakes are proof you're trying.",
  "Your brain is literally rewiring itself right now.",
  "English is just organized chaos. You've got this!",
  "Remember: even native speakers make mistakes.",
  "You're not just learning words, you're learning a new way to think.",
  "Procrastination is the enemy, but you're winning!",
  "Every sentence you write makes you stronger.",
  "The best time to learn was yesterday. The second best is now.",
]

interface MascotProps {
  visible?: boolean
}

export function Mascot({ visible = true }: MascotProps) {
  const [line, setLine] = useState(motivationalLines[0])
  const [showLine, setShowLine] = useState(false)
  const [position, setPosition] = useState({ x: 20, y: 20 })

  useEffect(() => {
    if (!visible) return

    const interval = setInterval(() => {
      setLine(motivationalLines[Math.floor(Math.random() * motivationalLines.length)])
      setShowLine(true)

      setTimeout(() => setShowLine(false), 4000)
    }, 8000)

    return () => clearInterval(interval)
  }, [visible])

  if (!visible) return null

  return (
    <div className="fixed bottom-6 right-6 z-40 pointer-events-none">
      {/* Mascot Character */}
      <div className="relative w-24 h-24 pointer-events-auto">
        <div className="w-full h-full bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center shadow-lg animate-bounce">
          <div className="text-4xl">🎓</div>
        </div>

        {/* Eyes */}
        <div className="absolute top-6 left-6 w-2 h-2 bg-white rounded-full" />
        <div className="absolute top-6 right-6 w-2 h-2 bg-white rounded-full" />

        {/* Smile */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-4 h-2 border-b-2 border-white rounded-full" />
      </div>

      {/* Speech Bubble */}
      {showLine && (
        <Card className="absolute bottom-28 right-0 bg-white text-purple-900 p-3 rounded-lg shadow-lg max-w-xs animate-fade-in pointer-events-auto">
          <p className="text-sm font-medium">{line}</p>
          <div className="absolute bottom-0 right-6 w-3 h-3 bg-white transform rotate-45 -mb-1.5" />
        </Card>
      )}
    </div>
  )
}
