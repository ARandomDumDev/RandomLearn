"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Settings, X, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { SoundSettings } from "./sound-settings"

export function SettingsPanel() {
  const [open, setOpen] = useState(false)
  const { theme, setTheme } = useTheme()

  return (
    <>
      {/* Settings Button */}
      <Button
        onClick={() => setOpen(true)}
        variant="ghost"
        className="fixed top-4 right-4 z-40 text-white hover:bg-purple-800"
      >
        <Settings className="w-6 h-6" />
      </Button>

      {/* Settings Panel */}
      {open && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="bg-purple-900 border-purple-700 p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Settings</h2>
              <Button onClick={() => setOpen(false)} variant="ghost" className="text-purple-300 hover:bg-purple-800">
                <X className="w-6 h-6" />
              </Button>
            </div>

            <div className="space-y-4">
              {/* Theme Toggle */}
              <Card className="bg-purple-800/50 border-purple-700 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {theme === "dark" ? (
                      <Moon className="w-5 h-5 text-blue-400" />
                    ) : (
                      <Sun className="w-5 h-5 text-yellow-400" />
                    )}
                    <span className="text-white font-medium">Theme</span>
                  </div>
                  <button
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      theme === "dark" ? "bg-blue-600" : "bg-yellow-500"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        theme === "dark" ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </Card>

              {/* Sound Settings */}
              <SoundSettings />

              {/* AI Difficulty Slider */}
              <Card className="bg-purple-800/50 border-purple-700 p-4">
                <label className="text-white font-medium mb-3 block">AI Difficulty</label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  defaultValue="3"
                  className="w-full"
                  onChange={(e) => localStorage.setItem("randomlearn-ai-difficulty", e.target.value)}
                />
                <div className="flex justify-between text-xs text-purple-300 mt-2">
                  <span>Easy</span>
                  <span>Hard</span>
                </div>
              </Card>

              {/* Focus Mode */}
              <Card className="bg-purple-800/50 border-purple-700 p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-white font-medium">Focus Mode</span>
                </div>
                <button
                  onClick={(e) => {
                    const target = e.currentTarget
                    const isEnabled = target.classList.contains("bg-blue-600")
                    if (isEnabled) {
                      target.classList.remove("bg-blue-600")
                      target.classList.add("bg-purple-700")
                    } else {
                      target.classList.remove("bg-purple-700")
                      target.classList.add("bg-blue-600")
                    }
                  }}
                  className="relative inline-flex h-6 w-11 items-center rounded-full bg-purple-700 transition-colors"
                >
                  <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-1" />
                </button>
              </Card>

              {/* Clear Data */}
              <Button
                onClick={() => {
                  if (confirm("Are you sure? This will reset all your progress.")) {
                    localStorage.clear()
                    window.location.reload()
                  }
                }}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold"
              >
                Clear All Data
              </Button>
            </div>
          </Card>
        </div>
      )}
    </>
  )
}
