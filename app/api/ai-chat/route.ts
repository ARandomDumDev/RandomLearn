import { groq } from "@ai-sdk/groq"
import { streamText } from "ai"

export async function POST(request: Request) {
  try {
    const { messages } = await request.json()

    if (!messages || !Array.isArray(messages)) {
      return Response.json({ message: "Invalid messages format" }, { status: 400 })
    }

    const systemPrompt = `You are an enthusiastic and patient English learning assistant. You help students practice English, explain grammar, build vocabulary, and improve their writing and speaking skills.

Guidelines:
- Be encouraging and supportive
- Correct mistakes gently with explanations
- Ask follow-up questions to deepen learning
- Provide examples when explaining concepts
- Keep responses concise and clear
- Use simple English when appropriate`

    const result = await streamText({
      model: groq("mixtral-8x7b-32768"),
      system: systemPrompt,
      messages: messages.map((m: any) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
      temperature: 0.7,
      maxTokens: 1024,
    })

    return result.toResponse()
  } catch (error) {
    console.error("[v0] AI Chat Error:", error)
    return Response.json({
      message: "I encountered an issue. Please try again in a moment.",
    })
  }
}
