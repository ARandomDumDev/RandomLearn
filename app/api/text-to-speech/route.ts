export async function POST(request: Request) {
  try {
    const { text } = await request.json()

    // For now, we'll use a simple text-to-speech API
    // In production, you'd use a service like Google Cloud TTS or AWS Polly
    const response = await fetch("https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "xi-api-key": process.env.ELEVENLABS_API_KEY || "",
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_monolingual_v1",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
        },
      }),
    })

    if (response.ok) {
      const audioBuffer = await response.arrayBuffer()
      return new Response(audioBuffer, {
        headers: {
          "Content-Type": "audio/mpeg",
        },
      })
    }

    // Fallback: return a simple error response
    return Response.json({ error: "Failed to generate speech" }, { status: 500 })
  } catch (error) {
    console.error("Text-to-speech error:", error)
    return Response.json({ error: "Failed to generate speech" }, { status: 500 })
  }
}
