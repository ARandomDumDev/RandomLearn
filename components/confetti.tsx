"use client"

import { useEffect, useState } from "react"

interface ConfettiPiece {
  id: number
  left: number
  delay: number
  duration: number
  color: string
}

export function Confetti() {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([])

  useEffect(() => {
    const colors = ["bg-yellow-400", "bg-blue-400", "bg-purple-400", "bg-pink-400", "bg-green-400"]
    const newPieces = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 0.5,
      duration: 2 + Math.random() * 1,
      color: colors[Math.floor(Math.random() * colors.length)],
    }))
    setPieces(newPieces)

    const timer = setTimeout(() => setPieces([]), 3500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {pieces.map((piece) => (
        <div
          key={piece.id}
          className={`absolute w-2 h-2 ${piece.color} rounded-full`}
          style={{
            left: `${piece.left}%`,
            top: "-10px",
            animation: `fall ${piece.duration}s linear ${piece.delay}s forwards`,
          }}
        />
      ))}
      <style>{`
        @keyframes fall {
          to {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}
