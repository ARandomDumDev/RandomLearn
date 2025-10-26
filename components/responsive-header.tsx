"use client"

import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { useState } from "react"

interface ResponsiveHeaderProps {
  title: string
  onLogout?: () => void
}

export function ResponsiveHeader({ title, onLogout }: ResponsiveHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-purple-900 to-indigo-900 text-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <h1 className="text-xl md:text-2xl font-bold">{title}</h1>

        <div className="hidden md:flex gap-2">
          {onLogout && <Button onClick={onLogout} variant="outline" size="sm" />}
        </div>

        <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle menu">
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/20 p-4">
          {onLogout && (
            <Button onClick={onLogout} variant="outline" className="w-full bg-transparent" size="sm">
              Logout
            </Button>
          )}
        </div>
      )}
    </header>
  )
}
