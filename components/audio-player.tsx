"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Volume2, Loader2 } from "lucide-react"

interface AudioPlayerProps {
  text: string
  onPlay?: () => void
}

export function AudioPlayer({ text, onPlay }: AudioPlayerProps) {
  const [loading, setLoading] = useState(false)
  const [playing, setPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  const handlePlay = async () => {
    if (playing) {
      audioRef.current?.pause()
      setPlaying(false)
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/text-to-speech", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = URL.createObjectURL(blob)

        if (audioRef.current) {
          audioRef.current.src = url
          audioRef.current.play()
          setPlaying(true)
          onPlay?.()
        }
      }
    } catch (error) {
      console.error("Error playing audio:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <audio
        ref={audioRef}
        onEnded={() => setPlaying(false)}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />
      <Button
        onClick={handlePlay}
        disabled={loading}
        size="sm"
        variant="ghost"
        className="text-blue-400 hover:bg-purple-700"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Loading...
          </>
        ) : (
          <>
            <Volume2 className="w-5 h-5 mr-2" />
            {playing ? "Stop" : "Listen"}
          </>
        )}
      </Button>
    </>
  )
}
