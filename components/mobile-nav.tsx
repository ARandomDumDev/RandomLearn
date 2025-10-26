"use client"

import type React from "react"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, Home, Settings } from "lucide-react"

interface MobileNavProps {
  currentTab: string
  onTabChange: (tab: string) => void
  children: React.ReactNode
}

export function MobileNav({ currentTab, onTabChange, children }: MobileNavProps) {
  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 overflow-auto">{children}</div>

      <div className="md:hidden border-t bg-white">
        <Tabs value={currentTab} onValueChange={onTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-3 rounded-none">
            <TabsTrigger value="overview" className="gap-2">
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Home</span>
            </TabsTrigger>
            <TabsTrigger value="lessons" className="gap-2">
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">Learn</span>
            </TabsTrigger>
            <TabsTrigger value="words" className="gap-2">
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Words</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  )
}
