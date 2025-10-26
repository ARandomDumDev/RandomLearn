"use client"

import { useRef, useCallback } from "react"

export function useSound() {
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const playSound = useCallback((soundType: "correct" | "wrong" | "levelup" | "click") => {
    // Create audio context for sound generation
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const now = audioContext.currentTime

    let oscillator: OscillatorNode
    let gainNode: GainNode

    switch (soundType) {
      case "correct":
        // Success sound: ascending tones
        oscillator = audioContext.createOscillator()
        gainNode = audioContext.createGain()
        oscillator.connect(gainNode)
        gainNode.connect(audioContext.destination)

        oscillator.frequency.setValueAtTime(523.25, now) // C5
        oscillator.frequency.setValueAtTime(659.25, now + 0.1) // E5
        oscillator.frequency.setValueAtTime(783.99, now + 0.2) // G5

        gainNode.gain.setValueAtTime(0.3, now)
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3)

        oscillator.start(now)
        oscillator.stop(now + 0.3)
        break

      case "wrong":
        // Error sound: descending tone
        oscillator = audioContext.createOscillator()
        gainNode = audioContext.createGain()
        oscillator.connect(gainNode)
        gainNode.connect(audioContext.destination)

        oscillator.frequency.setValueAtTime(400, now)
        oscillator.frequency.setValueAtTime(200, now + 0.2)

        gainNode.gain.setValueAtTime(0.2, now)
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.2)

        oscillator.start(now)
        oscillator.stop(now + 0.2)
        break

      case "levelup":
        // Level up sound: ascending arpeggio
        const notes = [523.25, 659.25, 783.99, 1046.5] // C5, E5, G5, C6
        notes.forEach((freq, index) => {
          const osc = audioContext.createOscillator()
          const gain = audioContext.createGain()
          osc.connect(gain)
          gain.connect(audioContext.destination)

          osc.frequency.setValueAtTime(freq, now + index * 0.1)
          gain.gain.setValueAtTime(0.2, now + index * 0.1)
          gain.gain.exponentialRampToValueAtTime(0.01, now + index * 0.1 + 0.2)

          osc.start(now + index * 0.1)
          osc.stop(now + index * 0.1 + 0.2)
        })
        break

      case "click":
        // Click sound
        oscillator = audioContext.createOscillator()
        gainNode = audioContext.createGain()
        oscillator.connect(gainNode)
        gainNode.connect(audioContext.destination)

        oscillator.frequency.setValueAtTime(800, now)
        gainNode.gain.setValueAtTime(0.1, now)
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.05)

        oscillator.start(now)
        oscillator.stop(now + 0.05)
        break
    }
  }, [])

  return { playSound }
}
