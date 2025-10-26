import { callGroq } from "@/lib/groq-client"

export async function POST(request: Request) {
  try {
    const { messages, courseId } = await request.json()

    if (!messages || !Array.isArray(messages)) {
      return Response.json({ message: "Invalid messages format" }, { status: 400 })
    }

    const systemPrompt = `You are an enthusiastic and patient English learning assistant. You help students practice English, explain grammar, build vocabulary, and improve their writing and speaking skills.

Current Course: ${courseId || "General English"}

Guidelines:
- Be encouraging and supportive
- Correct mistakes gently with explanations
- Ask follow-up questions to deepen learning
- Provide examples when explaining concepts
- Keep responses concise and clear
- Use simple English when appropriate`

    const formattedMessages = [
      { role: "system" as const, content: systemPrompt },
      ...messages.map((m: any) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
    ]

    console.log("[v0] AI Chat - Calling Groq with", messages.length, "messages")

    const response = await callGroq(formattedMessages, {
      maxTokens: 1024,
      temperature: 0.7,
    })

    if (!response) {
      console.log("[v0] AI Chat - Groq unavailable, returning helpful message")
      return Response.json({
        message:
          "I'm currently offline, but I'm here to help! Try asking me about grammar, vocabulary, or English learning tips.",
      })
    }

    console.log("[v0] AI Chat - Response generated successfully")
    return Response.json({ message: response })
  } catch (error) {
    console.error("[v0] AI Chat Error:", error)
    return Response.json({
      message: "I encountered an issue. Please try again in a moment.",
    })
  }
}
