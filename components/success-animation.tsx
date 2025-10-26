"use client"

import { useEffect, useState } from "react"
import { Sparkles } from "lucide-react"
import { Confetti } from "./confetti"

interface SuccessAnimationProps {
  xp: number
}

export function SuccessAnimation({ xp }: SuccessAnimationProps) {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number }>>([])
  const [showConfetti, setShowConfetti] = useState(true)

  useEffect(() => {
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100 - 50,
      y: Math.random() * 100 - 50,
    }))
    setParticles(newParticles)

    const timer = setTimeout(() => setShowConfetti(false), 2000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      <div className="fixed inset-0 pointer-events-none flex items-center justify-center">
        {/* Confetti particles */}
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute w-2 h-2 bg-yellow-400 rounded-full animate-pulse"
            style={{
              left: `calc(50% + ${particle.x}px)`,
              top: `calc(50% + ${particle.y}px)`,
              animation: `float 2s ease-out forwards`,
            }}
          />
        ))}

        {/* Success message */}
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center animate-bounce">
            <Sparkles className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
            <p className="text-4xl font-bold text-white mb-2">Correct!</p>
            <p className="text-2xl text-yellow-400 font-bold">+{xp} XP</p>
          </div>
        </div>
      </div>

      {showConfetti && <Confetti />}

      <style>{`
        @keyframes float {
          to {
            transform: translateY(-100px) translateX(var(--tx, 0));
            opacity: 0;
          }
        }
      `}</style>
    </>
  )
}
