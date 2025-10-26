import { callGroq } from "@/lib/groq-client"

export async function POST(request: Request) {
  try {
    const { question, userAnswer, correctAnswer, explanation } = await request.json()

    const prompt = `You are an encouraging English teacher. A student answered a question incorrectly.

Question: ${question}
Student's Answer: ${userAnswer}
Correct Answer: ${correctAnswer}
Explanation: ${explanation}

Provide personalized, encouraging feedback that:
1. Acknowledges their effort
2. Explains why their answer was incorrect
3. Gives a tip to remember the correct answer
4. Encourages them to try again

Keep it concise (2-3 sentences).`

    console.log("[v0] AI Feedback - Generating feedback")

    const response = await callGroq([{ role: "user", content: prompt }], {
      maxTokens: 256,
      temperature: 0.7,
    })

    if (!response) {
      console.log("[v0] AI Feedback - Groq unavailable, using fallback")
      return Response.json({
        feedback: `Good try! The correct answer is "${correctAnswer}". ${explanation} Keep practicing!`,
      })
    }

    console.log("[v0] AI Feedback - Feedback generated successfully")
    return Response.json({ feedback: response })
  } catch (error) {
    console.error("[v0] AI Feedback Error:", error)
    return Response.json({
      feedback: "Great effort! Review the explanation and try again.",
    })
  }
}
