import Groq from "groq-sdk"

export function getGroqClient(): Groq | null {
  if (!process.env.GROQ_API_KEY) {
    console.warn("[v0] GROQ_API_KEY not configured. AI features will use fallbacks.")
    return null
  }

  try {
    return new Groq({
      apiKey: process.env.GROQ_API_KEY,
    })
  } catch (error) {
    console.error("[v0] Failed to initialize Groq client:", error instanceof Error ? error.message : error)
    return null
  }
}

export async function callGroq(
  messages: Array<{ role: "user" | "system" | "assistant"; content: string }>,
  options?: {
    model?: string
    maxTokens?: number
    temperature?: number
  },
): Promise<string | null> {
  const model = options?.model || "llama-3.1-8b-instant"
  const maxTokens = options?.maxTokens || 1024
  const temperature = options?.temperature || 0.7

  const client = getGroqClient()

  if (client) {
    try {
      console.log("[v0] Groq - Using SDK to call", model)
      const response = await client.chat.completions.create({
        model,
        messages,
        max_tokens: maxTokens,
        temperature,
      })

      const content = response.choices[0]?.message?.content
      if (content) {
        console.log("[v0] Groq - SDK response successful")
        return content
      }
    } catch (error) {
      console.warn("[v0] Groq SDK failed:", error instanceof Error ? error.message : error)
      // Fall through to raw fetch fallback
    }
  }

  if (!process.env.GROQ_API_KEY) {
    console.log("[v0] Groq - No API key, cannot use raw fetch fallback")
    return null
  }

  try {
    console.log("[v0] Groq - Falling back to raw fetch for", model)
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model,
        messages,
        max_tokens: maxTokens,
        temperature,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error("[v0] Groq raw fetch error:", response.status, error)
      return null
    }

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content
    if (content) {
      console.log("[v0] Groq - Raw fetch response successful")
      return content
    }
  } catch (error) {
    console.error("[v0] Groq raw fetch failed:", error instanceof Error ? error.message : error)
  }

  console.log("[v0] Groq - All methods failed, returning null")
  return null
}
