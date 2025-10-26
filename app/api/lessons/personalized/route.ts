import { createClient } from "@/lib/supabase/server"
import { generatePersonalizedLesson, shouldRefreshLesson } from "@/lib/lesson-generator"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const supabase = await createClient()

    // Get authenticated user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const lessonType = searchParams.get("type") || "grammar"

    // Get user profile to check difficulty level
    const { data: profile } = await supabase.from("profiles").select("current_level").eq("id", user.id).single()

    const difficultyLevel = profile?.current_level || 1

    // Check for existing lessons that need refresh
    const { data: existingLessons } = await supabase
      .from("personalized_lessons")
      .select("*")
      .eq("user_id", user.id)
      .eq("lesson_type", lessonType)
      .eq("completed", false)
      .order("created_at", { ascending: false })
      .limit(1)

    let lesson

    if (existingLessons && existingLessons.length > 0) {
      const existing = existingLessons[0]
      if (!shouldRefreshLesson(new Date(existing.refreshed_at))) {
        console.log("[v0] Returning cached lesson for", lessonType)
        return NextResponse.json(existing.lesson_data)
      }
    }

    console.log("[v0] Generating new lesson for", lessonType)
    const seed = Math.floor(Date.now() / (1000 * 60 * 60 * 24)) // Changes daily

    lesson = await generatePersonalizedLesson(user.id, lessonType, difficultyLevel, seed)

    console.log("[v0] Generated lesson:", lesson ? "Success" : "Failed")

    if (lesson) {
      const { error: insertError } = await supabase.from("personalized_lessons").insert({
        user_id: user.id,
        lesson_data: lesson,
        lesson_type: lessonType,
        difficulty_level: difficultyLevel,
        refreshed_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      })

      if (insertError) {
        console.error("[v0] Error saving lesson:", insertError)
      }
    }

    return NextResponse.json(lesson || { error: "Failed to generate lesson" })
  } catch (error) {
    console.error("[v0] Error generating lesson:", error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    console.error("[v0] Lesson generation error details:", errorMessage)
    return NextResponse.json({ error: "Failed to generate lesson", details: errorMessage }, { status: 500 })
  }
}
