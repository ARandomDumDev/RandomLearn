"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Volume2, VolumeX } from "lucide-react"

export function SoundSettings() {
  const [soundEnabled, setSoundEnabled] = useState(true)

  useEffect(() => {
    const saved = localStorage.getItem("randomlearn-sound-enabled")
    if (saved !== null) {
      setSoundEnabled(JSON.parse(saved))
    }
  }, [])

  const toggleSound = () => {
    const newValue = !soundEnabled
    setSoundEnabled(newValue)
    localStorage.setItem("randomlearn-sound-enabled", JSON.stringify(newValue))
  }

  return (
    <Card className="bg-purple-800/50 border-purple-700 p-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {soundEnabled ? <Volume2 className="w-5 h-5 text-blue-400" /> : <VolumeX className="w-5 h-5 text-purple-400" />}
        <span className="text-white font-medium">Sound Effects</span>
      </div>
      <button
        onClick={toggleSound}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          soundEnabled ? "bg-blue-600" : "bg-purple-700"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            soundEnabled ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </Card>
  )
}
