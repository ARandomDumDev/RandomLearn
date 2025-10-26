import Groq from "groq-sdk"

let groqClient: Groq | null = null

export function getGroqClient(): Groq | null {
  if (!process.env.GROQ_API_KEY) {
    console.warn("[v0] GROQ_API_KEY not configured. AI features will use fallbacks.")
    return null
  }

  if (!groqClient) {
    groqClient = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    })
  }

  return groqClient
}

export async function callGroq(
  messages: Array<{ role: "user" | "system" | "assistant"; content: string }>,
  options?: {
    model?: string
    maxTokens?: number
    temperature?: number
  },
): Promise<string | null> {
  const client = getGroqClient()

  if (!client) {
    console.log("[v0] Groq not available, returning null")
    return null
  }

  try {
    const response = await client.chat.completions.create({
      model: options?.model || "llama-3.1-8b-instant",
      messages,
      max_tokens: options?.maxTokens || 1024,
      temperature: options?.temperature || 0.7,
    })

    return response.choices[0]?.message?.content || null
  } catch (error) {
    console.error("[v0] Groq API error:", error instanceof Error ? error.message : error)
    return null
  }
}
