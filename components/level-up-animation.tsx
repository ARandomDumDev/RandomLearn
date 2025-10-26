"use client"

import { useEffect, useState } from "react"
import { Zap } from "lucide-react"

interface LevelUpAnimationProps {
  newLevel: number
  onComplete: () => void
}

export function LevelUpAnimation({ newLevel, onComplete }: LevelUpAnimationProps) {
  const [show, setShow] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false)
      onComplete()
    }, 3000)

    return () => clearTimeout(timer)
  }, [onComplete])

  if (!show) return null

  return (
    <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-50">
      <div className="text-center animate-bounce">
        <div className="mb-4 animate-spin">
          <Zap className="w-20 h-20 text-yellow-400 mx-auto" />
        </div>
        <h2 className="text-5xl font-bold text-white mb-2 animate-pulse">LEVEL UP!</h2>
        <p className="text-3xl text-yellow-400 font-bold">Level {newLevel}</p>
      </div>

      {/* Particle effects */}
      {Array.from({ length: 30 }).map((_, i) => (
        <div
          key={i}
          className="absolute w-3 h-3 bg-yellow-400 rounded-full animate-pulse"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `float-up 2s ease-out forwards`,
            animationDelay: `${Math.random() * 0.5}s`,
          }}
        />
      ))}

      <style>{`
        @keyframes float-up {
          to {
            transform: translateY(-200px);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}
