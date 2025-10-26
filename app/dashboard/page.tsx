"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PersonalizedLessonView } from "@/components/personalized-lesson-view"
import { WordAndMeaning } from "@/components/word-and-meaning"
import { usePersistentXP } from "@/hooks/use-persistent-xp"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { LogOut } from "lucide-react"
import { LessonSelector } from "@/components/lesson-selector"
import { AIChatWidget } from "@/components/ai-chat-widget"

interface UserProfile {
  id: string
  email: string
  display_name: string
  total_xp: number
  current_level: number
  daily_streak: number
}

export default function DashboardPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentTab, setCurrentTab] = useState("overview")
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)
  const [hasCompletedAssessment, setHasCompletedAssessment] = useState(false)
  const [weeklyXpData, setWeeklyXpData] = useState<Array<{ day: string; xp: number }>>([])
  const router = useRouter()
  const supabase = createClient()
  const { stats, refetch: refetchXP } = usePersistentXP()

  useEffect(() => {
    fetchUserProfile()
  }, [])

  const fetchUserProfile = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/auth/login")
        return
      }

      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single()

      if (!data) {
        const { data: newProfile } = await supabase
          .from("profiles")
          .insert({
            id: user.id,
            email: user.email,
            display_name: user.email?.split("@")[0] || "Learner",
            total_xp: 0,
            current_level: 1,
            daily_streak: 0,
          })
          .select()
          .single()

        setProfile(newProfile)
      } else {
        setProfile(data)
      }
    } catch (error) {
      console.error("[v0] Error fetching profile:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchWeeklyXpData = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

      const { data: progressData } = await supabase
        .from("user_progress")
        .select("xp_earned, completed_at")
        .eq("user_id", user.id)
        .gte("completed_at", sevenDaysAgo.toISOString())

      // Group XP by day
      const xpByDay: Record<string, number> = {}
      const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

      // Initialize all days with 0
      days.forEach((day) => {
        xpByDay[day] = 0
      })

      // Sum XP for each day
      if (progressData) {
        progressData.forEach((item) => {
          const date = new Date(item.completed_at)
          const dayIndex = date.getDay()
          const dayName = days[(dayIndex + 6) % 7] // Convert to Mon-Sun format
          xpByDay[dayName] += item.xp_earned || 0
        })
      }

      const chartData = days.map((day) => ({
        day,
        xp: xpByDay[day],
      }))

      setWeeklyXpData(chartData)
    } catch (error) {
      console.error("[v0] Error fetching weekly XP:", error)
    }
  }

  useEffect(() => {
    checkAssessmentStatus()
    fetchWeeklyXpData()
  }, [])

  const checkAssessmentStatus = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      const { data } = await supabase
        .from("personalized_lessons")
        .select("*")
        .eq("user_id", user.id)
        .eq("lesson_type", "assessment")
        .eq("completed", true)
        .limit(1)

      setHasCompletedAssessment(data && data.length > 0)
    } catch (error) {
      console.error("[v0] Error checking assessment:", error)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/auth/login")
  }

  const handleLessonComplete = async (xpEarned: number) => {
    if (!profile) return

    try {
      setRefreshing(true)
      await refetchXP()
      await fetchWeeklyXpData()
      console.log("[v0] XP refreshed after lesson completion")
      setSelectedLesson(null)
      setCurrentTab("overview")
    } catch (error) {
      console.error("[v0] Error updating profile:", error)
    } finally {
      setRefreshing(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-center">
          <p>Failed to load profile</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white">Welcome back, {profile.display_name}!</h1>
            <p className="text-purple-200 mt-2">Keep up your learning streak</p>
          </div>
          <Button onClick={handleLogout} variant="outline" className="gap-2 bg-transparent">
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-white/10 border-white/20 text-white">
            <CardHeader>
              <CardTitle className="text-sm font-medium">Total XP</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats.totalXP}</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/20 text-white">
            <CardHeader>
              <CardTitle className="text-sm font-medium">Current Level</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats.currentLevel}</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/20 text-white">
            <CardHeader>
              <CardTitle className="text-sm font-medium">Daily Streak</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{profile.daily_streak}</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="lessons">Lessons</TabsTrigger>
            <TabsTrigger value="words">Words</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Weekly Progress</CardTitle>
                <CardDescription>Your XP earned this week</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={weeklyXpData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="xp" fill="#8B5CF6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="lessons" className="space-y-6">
            {selectedLesson ? (
              <PersonalizedLessonView
                lessonType={selectedLesson}
                onComplete={handleLessonComplete}
                onBack={() => setSelectedLesson(null)}
              />
            ) : (
              <LessonSelector
                onSelectLesson={(type) => setSelectedLesson(type)}
                onSelectAssessment={() => {
                  setSelectedLesson("assessment")
                }}
                hasCompletedAssessment={hasCompletedAssessment}
              />
            )}
          </TabsContent>

          <TabsContent value="words">
            <WordAndMeaning />
          </TabsContent>
        </Tabs>
      </div>

      <AIChatWidget />
    </div>
  )
}
