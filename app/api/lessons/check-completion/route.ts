import { createClient } from "@/lib/supabase/server"
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

    const { searchParams } = new URL(request.url)
    const lessonType = searchParams.get("type")

    if (!lessonType) {
      return NextResponse.json({ error: "Lesson type required" }, { status: 400 })
    }

    // Check if user has completed this lesson type
    const { data: completedLessons } = await supabase
      .from("personalized_lessons")
      .select("id, completed, lesson_data")
      .eq("user_id", user.id)
      .eq("lesson_type", lessonType)
      .eq("completed", true)

    const { data: userProgress } = await supabase
      .from("user_progress")
      .select("lesson_id, is_correct")
      .eq("user_id", user.id)
      .in("lesson_id", completedLessons?.map((l) => l.id) || [])

    return NextResponse.json({
      isCompleted: completedLessons && completedLessons.length > 0,
      completedCount: completedLessons?.length || 0,
      totalQuestionsAnswered: userProgress?.length || 0,
      canRepeat: false,
    })
  } catch (error) {
    console.error("[v0] Error checking completion:", error)
    return NextResponse.json({ error: "Failed to check completion" }, { status: 500 })
  }
}
