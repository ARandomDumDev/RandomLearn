"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Lightbulb, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

const tips = [
  "Don't trust autocorrect. It's lying to you.",
  "Read English subtitles while watching movies. Your brain absorbs more than you think.",
  "Write one sentence in English every day. Consistency beats intensity.",
  "Listen to podcasts at 1.5x speed. Your ear adapts faster than you'd expect.",
  "Learn phrasal verbs in context, not from lists. They make way more sense that way.",
  "Speak out loud, even if you're alone. Your mouth needs practice too.",
  "Watch the same movie twice: once with subtitles, once without.",
  "Keep a 'mistake journal'. You'll stop repeating the same errors.",
  "Learn words in groups, not individually. Context is everything.",
  "Don't memorize grammar rules. Learn them through examples instead.",
]

export function RandomTip() {
  const [tip, setTip] = useState("")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setTip(tips[Math.floor(Math.random() * tips.length)])
    setMounted(true)
  }, [])

  const getNewTip = () => {
    setTip(tips[Math.floor(Math.random() * tips.length)])
  }

  if (!mounted) return null

  return (
    <Card className="bg-gradient-to-r from-blue-600/30 to-purple-600/30 border-blue-500/50 p-6 mb-12">
      <div className="flex items-start gap-4">
        <Lightbulb className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
        <div className="flex-1">
          <h3 className="text-lg font-bold text-white mb-2">Random Tip</h3>
          <p className="text-purple-100 mb-4">{tip}</p>
          <Button onClick={getNewTip} size="sm" variant="ghost" className="text-blue-300 hover:bg-blue-500/20">
            <RefreshCw className="w-4 h-4 mr-2" />
            Get Another Tip
          </Button>
        </div>
      </div>
    </Card>
  )
}
