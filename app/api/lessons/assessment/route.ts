import { createClient } from "@/lib/supabase/server"
import { generateAssessmentLesson } from "@/lib/lesson-generator"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user has already completed assessment
    const { data: existingAssessment } = await supabase
      .from("personalized_lessons")
      .select("*")
      .eq("user_id", user.id)
      .eq("lesson_type", "assessment")
      .eq("completed", true)
      .limit(1)

    if (existingAssessment && existingAssessment.length > 0) {
      return NextResponse.json(
        { error: "Assessment already completed. You cannot repeat this lesson." },
        { status: 403 },
      )
    }

    // Generate assessment lesson
    const lesson = generateAssessmentLesson()

    // Save to database
    await supabase.from("personalized_lessons").insert({
      user_id: user.id,
      lesson_data: lesson,
      lesson_type: "assessment",
      difficulty_level: 1,
      refreshed_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    })

    return NextResponse.json(lesson)
  } catch (error) {
    console.error("[v0] Error generating assessment:", error)
    return NextResponse.json({ error: "Failed to generate assessment" }, { status: 500 })
  }
}
