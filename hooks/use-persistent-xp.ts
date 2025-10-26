"use client"

import { useEffect, useState, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"

interface UserStats {
  totalXP: number
  currentLevel: number
  dailyStreak: number
}

export function usePersistentXP() {
  const [stats, setStats] = useState<UserStats>({
    totalXP: 0,
    currentLevel: 1,
    dailyStreak: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    fetchUserStats()
  }, [])

  const fetchUserStats = async () => {
    try {
      setLoading(true)
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        setError("User not authenticated")
        setLoading(false)
        return
      }

      const { data, error: fetchError } = await supabase
        .from("profiles")
        .select("total_xp, current_level, daily_streak")
        .eq("id", user.id)
        .single()

      if (fetchError) throw fetchError

      if (data) {
        setStats({
          totalXP: data.total_xp || 0,
          currentLevel: data.current_level || 1,
          dailyStreak: data.daily_streak || 0,
        })
      }
    } catch (err) {
      console.error("[v0] Error fetching user stats:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch stats")
    } finally {
      setLoading(false)
    }
  }

  const addXP = useCallback(
    async (xpAmount: number) => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          setError("User not authenticated")
          return null
        }

        const newTotalXP = stats.totalXP + xpAmount
        const newLevel = Math.floor(newTotalXP / 100) + 1

        // Update Supabase
        const { error: updateError } = await supabase
          .from("profiles")
          .update({
            total_xp: newTotalXP,
            current_level: newLevel,
            updated_at: new Date().toISOString(),
          })
          .eq("id", user.id)

        if (updateError) throw updateError

        // Update local state
        setStats({
          totalXP: newTotalXP,
          currentLevel: newLevel,
          dailyStreak: stats.dailyStreak,
        })

        return { xpAdded: xpAmount, newTotalXP, newLevel }
      } catch (err) {
        console.error("[v0] Error adding XP:", err)
        setError(err instanceof Error ? err.message : "Failed to add XP")
        return null
      }
    },
    [stats, supabase],
  )

  const updateStreak = useCallback(
    async (newStreak: number) => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          setError("User not authenticated")
          return
        }

        const { error: updateError } = await supabase
          .from("profiles")
          .update({
            daily_streak: newStreak,
            last_activity_date: new Date().toISOString().split("T")[0],
            updated_at: new Date().toISOString(),
          })
          .eq("id", user.id)

        if (updateError) throw updateError

        setStats((prev) => ({
          ...prev,
          dailyStreak: newStreak,
        }))
      } catch (err) {
        console.error("[v0] Error updating streak:", err)
        setError(err instanceof Error ? err.message : "Failed to update streak")
      }
    },
    [supabase],
  )

  return {
    stats,
    loading,
    error,
    addXP,
    updateStreak,
    refetch: fetchUserStats,
  }
}
