import { callGroq } from "./groq-client"
import { z } from "zod"

const lessonSchema = z.object({
  lessonNames: z.array(z.string()),
  lessons: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      topic: z.string(),
      difficulty: z.enum(["beginner", "intermediate", "advanced"]),
      description: z.string(),
      questions: z.array(
        z.object({
          id: z.string(),
          type: z.enum(["multiple-choice", "fill-in", "listening", "speaking"]),
          question: z.string(),
          options: z.array(z.string()).optional(),
          correctAnswer: z.string(),
          explanation: z.string(),
          xpReward: z.number(),
        }),
      ),
    }),
  ),
})

type Lesson = z.infer<typeof lessonSchema>

export async function generatePersonalizedLesson(
  userId: string,
  lessonType: string,
  difficultyLevel: number,
  seed: number,
): Promise<Lesson> {
  const difficultyMap = {
    1: "beginner",
    2: "intermediate",
    3: "advanced",
  } as const

  const difficulty = difficultyMap[difficultyLevel as keyof typeof difficultyMap] || "beginner"

  const prompt = `Generate a personalized English learning lesson in JSON format.

Lesson Type: ${lessonType}
Difficulty: ${difficulty}
Seed: ${seed}

Create a lesson with:
1. lessonNames: array of 3-5 topic titles related to ${lessonType}
2. lessons: array with 1 lesson containing 4-5 questions
3. Mix of question types: multiple-choice, fill-in, listening, speaking
4. XP rewards: 10-50 points per question
5. Clear explanations for correct answers

Return ONLY valid JSON (no markdown, no extra text):
{
  "lessonNames": ["Topic 1", "Topic 2", "Topic 3"],
  "lessons": [{
    "id": "lesson-1",
    "title": "Lesson Title",
    "topic": "${lessonType}",
    "difficulty": "${difficulty}",
    "description": "Description",
    "questions": [{
      "id": "q1",
      "type": "multiple-choice",
      "question": "Question text?",
      "options": ["A", "B", "C", "D"],
      "correctAnswer": "A",
      "explanation": "Explanation",
      "xpReward": 20
    }]
  }]
}`

  try {
    console.log("[v0] Generating personalized lesson for", lessonType)
    const response = await callGroq([{ role: "user", content: prompt }], {
      maxTokens: 2048,
    })

    if (!response) {
      console.log("[v0] Groq returned null, using fallback")
      return generateFallbackLesson(lessonType, difficultyLevel)
    }

    const jsonMatch = response.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      console.log("[v0] No JSON found in response, using fallback")
      return generateFallbackLesson(lessonType, difficultyLevel)
    }

    const lesson = JSON.parse(jsonMatch[0]) as Lesson
    console.log("[v0] Successfully generated lesson")
    return lesson
  } catch (error) {
    console.error("[v0] Error generating lesson:", error)
    return generateFallbackLesson(lessonType, difficultyLevel)
  }
}

export async function generateAssessmentLesson(): Promise<Lesson> {
  const prompt = `Generate an English proficiency assessment lesson in JSON format.

Create an assessment with:
1. lessonNames: ["Grammar", "Vocabulary", "Writing", "Speaking", "Listening"]
2. lessons: array with 1 lesson containing 10 questions
3. Questions covering all skill areas
4. Mix of all question types
5. Each question worth 10 XP
6. Questions designed to identify weaknesses

Return ONLY valid JSON (no markdown, no extra text):
{
  "lessonNames": ["Grammar", "Vocabulary", "Writing", "Speaking", "Listening"],
  "lessons": [{
    "id": "assessment-1",
    "title": "English Proficiency Assessment",
    "topic": "assessment",
    "difficulty": "beginner",
    "description": "Assess your English level",
    "questions": [{
      "id": "q1",
      "type": "multiple-choice",
      "question": "Question?",
      "options": ["A", "B", "C", "D"],
      "correctAnswer": "A",
      "explanation": "Explanation",
      "xpReward": 10
    }]
  }]
}`

  try {
    console.log("[v0] Generating assessment lesson")
    const response = await callGroq([{ role: "user", content: prompt }], {
      maxTokens: 2048,
    })

    if (!response) {
      console.log("[v0] Groq returned null, using fallback")
      return generateFallbackAssessment()
    }

    const jsonMatch = response.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      console.log("[v0] No JSON found in response, using fallback")
      return generateFallbackAssessment()
    }

    const lesson = JSON.parse(jsonMatch[0]) as Lesson
    console.log("[v0] Successfully generated assessment")
    return lesson
  } catch (error) {
    console.error("[v0] Error generating assessment:", error)
    return generateFallbackAssessment()
  }
}

function generateFallbackLesson(lessonType: string, difficultyLevel: number): Lesson {
  const difficultyMap = {
    1: "beginner",
    2: "intermediate",
    3: "advanced",
  } as const

  return {
    lessonNames: [`${lessonType} Basics`, `${lessonType} Practice`, `${lessonType} Mastery`],
    lessons: [
      {
        id: `lesson-${Date.now()}`,
        title: `${lessonType} Fundamentals`,
        topic: lessonType,
        difficulty: difficultyMap[difficultyLevel as keyof typeof difficultyMap] || "beginner",
        description: `Learn the fundamentals of ${lessonType}`,
        questions: [
          {
            id: "q1",
            type: "multiple-choice",
            question: `Which is the correct example of ${lessonType}?`,
            options: ["Example A", "Example B", "Example C", "Example D"],
            correctAnswer: "Example A",
            explanation: `Example A demonstrates proper ${lessonType} usage.`,
            xpReward: 20,
          },
          {
            id: "q2",
            type: "fill-in",
            question: `Complete: "The _____ way to use ${lessonType} is..."`,
            options: ["correct", "best", "proper", "right"],
            correctAnswer: "correct",
            explanation: "The correct way is the most accurate description.",
            xpReward: 15,
          },
          {
            id: "q3",
            type: "multiple-choice",
            question: `What is a common mistake in ${lessonType}?`,
            options: ["Mistake A", "Mistake B", "Mistake C", "Mistake D"],
            correctAnswer: "Mistake A",
            explanation: "Mistake A is a common error to avoid.",
            xpReward: 20,
          },
          {
            id: "q4",
            type: "fill-in",
            question: `Fill in the blank: "When using ${lessonType}, always remember to _____"`,
            options: ["practice", "study", "focus", "learn"],
            correctAnswer: "practice",
            explanation: "Practice is essential for mastering any skill.",
            xpReward: 15,
          },
        ],
      },
    ],
  }
}

function generateFallbackAssessment(): Lesson {
  return {
    lessonNames: ["Grammar", "Vocabulary", "Writing", "Speaking", "Listening"],
    lessons: [
      {
        id: "assessment-1",
        title: "English Proficiency Assessment",
        topic: "assessment",
        difficulty: "beginner",
        description: "Assess your current English proficiency level",
        questions: [
          {
            id: "a1",
            type: "multiple-choice",
            question: 'What is the past tense of "go"?',
            options: ["goes", "went", "going", "gone"],
            correctAnswer: "went",
            explanation: 'The past tense of "go" is "went".',
            xpReward: 10,
          },
          {
            id: "a2",
            type: "multiple-choice",
            question: 'Which word means "very happy"?',
            options: ["sad", "angry", "delighted", "tired"],
            correctAnswer: "delighted",
            explanation: '"Delighted" means very happy or pleased.',
            xpReward: 10,
          },
          {
            id: "a3",
            type: "fill-in",
            question: 'Complete: "She _____ to the store yesterday."',
            options: ["go", "goes", "went", "going"],
            correctAnswer: "went",
            explanation: "Use past tense 'went' for actions that already happened.",
            xpReward: 10,
          },
          {
            id: "a4",
            type: "multiple-choice",
            question: "Which sentence is correct?",
            options: ["He don't like pizza", "He doesn't like pizza", "He not like pizza", "He no like pizza"],
            correctAnswer: "He doesn't like pizza",
            explanation: "Use 'doesn't' with third person singular (he/she/it).",
            xpReward: 10,
          },
          {
            id: "a5",
            type: "fill-in",
            question: 'Complete: "I have _____ to Paris three times."',
            options: ["go", "goes", "been", "going"],
            correctAnswer: "been",
            explanation: "Use 'been' with 'have' for past experiences.",
            xpReward: 10,
          },
          {
            id: "a6",
            type: "multiple-choice",
            question: "What is the plural of 'child'?",
            options: ["childs", "children", "childes", "childer"],
            correctAnswer: "children",
            explanation: '"Children" is the irregular plural of "child".',
            xpReward: 10,
          },
          {
            id: "a7",
            type: "fill-in",
            question: 'Complete: "If I _____ you were coming, I would have prepared."',
            options: ["knew", "know", "had known", "would know"],
            correctAnswer: "had known",
            explanation: "Use past perfect 'had known' in conditional sentences.",
            xpReward: 10,
          },
          {
            id: "a8",
            type: "multiple-choice",
            question: "Which word is spelled correctly?",
            options: ["recieve", "receive", "recive", "recieve"],
            correctAnswer: "receive",
            explanation: '"Receive" is spelled with "ei" not "ie".',
            xpReward: 10,
          },
          {
            id: "a9",
            type: "fill-in",
            question: 'Complete: "She is _____ than her sister."',
            options: ["tall", "taller", "tallest", "more tall"],
            correctAnswer: "taller",
            explanation: "Use comparative form 'taller' when comparing two people.",
            xpReward: 10,
          },
          {
            id: "a10",
            type: "multiple-choice",
            question: "What does 'procrastinate' mean?",
            options: ["To plan ahead", "To delay or postpone", "To work quickly", "To organize"],
            correctAnswer: "To delay or postpone",
            explanation: '"Procrastinate" means to delay or put off doing something.',
            xpReward: 10,
          },
        ],
      },
    ],
  }
}

export function shouldRefreshLesson(lastRefreshDate: Date): boolean {
  const now = new Date()
  const daysSinceRefresh = (now.getTime() - lastRefreshDate.getTime()) / (1000 * 60 * 60 * 24)
  return daysSinceRefresh >= 2
}
