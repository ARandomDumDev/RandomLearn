import { groq } from "@ai-sdk/groq"
import { generateText } from "ai"

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

    const { text } = await generateText({
      model: groq("mixtral-8x7b-32768"),
      prompt,
      temperature: 0.7,
      maxTokens: 256,
    })

    return Response.json({ feedback: text })
  } catch (error) {
    console.error("[v0] AI Feedback Error:", error)
    return Response.json({
      feedback: "Great effort! Review the explanation and try again.",
    })
  }
}
