export const sampleLessons = {
  "grammar-101": [
    {
      id: "lesson-1",
      title: "Present Simple Tense",
      questions: [
        {
          type: "multiple-choice" as const,
          prompt: "Which sentence is correct?",
          choices: [
            "She go to school every day",
            "She goes to school every day",
            "She going to school every day",
            "She gone to school every day",
          ],
          answer: "She goes to school every day",
          explanation: "With third person singular (she, he, it), we add 's' to the verb in present simple.",
          difficulty: 1,
        },
        {
          type: "fill-in" as const,
          prompt: "Complete: I _____ coffee every morning.",
          choices: [],
          answer: "drink",
          explanation: "With 'I' (first person singular), we use the base form of the verb.",
          difficulty: 1,
        },
        {
          type: "multiple-choice" as const,
          prompt: "What is the negative form of 'He plays tennis'?",
          choices: ["He not plays tennis", "He doesn't play tennis", "He don't play tennis", "He plays not tennis"],
          answer: "He doesn't play tennis",
          explanation: "For third person singular, we use 'doesn't' + base form of the verb.",
          difficulty: 2,
        },
      ],
    },
    {
      id: "lesson-2",
      title: "Past Simple Tense",
      questions: [
        {
          type: "multiple-choice" as const,
          prompt: "Which is the past simple form of 'go'?",
          choices: ["goed", "went", "going", "goes"],
          answer: "went",
          explanation: "'Go' is an irregular verb. Its past simple form is 'went'.",
          difficulty: 1,
        },
        {
          type: "fill-in" as const,
          prompt: "I _____ to the cinema yesterday.",
          choices: [],
          answer: "went",
          explanation: "Use past simple for completed actions in the past.",
          difficulty: 1,
        },
      ],
    },
  ],
  "vocab-builder": [
    {
      id: "lesson-1",
      title: "Common Verbs",
      questions: [
        {
          type: "multiple-choice" as const,
          prompt: "What does 'procrastinate' mean?",
          choices: [
            "To delay or postpone something",
            "To work very hard",
            "To finish quickly",
            "To start something new",
          ],
          answer: "To delay or postpone something",
          explanation: "Procrastinate means to delay or postpone doing something.",
          difficulty: 2,
        },
        {
          type: "fill-in" as const,
          prompt: "The opposite of 'begin' is _____.",
          choices: [],
          answer: "end",
          explanation: "'End' is the opposite of 'begin'.",
          difficulty: 1,
        },
      ],
    },
  ],
  "writing-skills": [
    {
      id: "lesson-1",
      title: "Sentence Structure",
      questions: [
        {
          type: "multiple-choice" as const,
          prompt: "Which sentence has correct punctuation?",
          choices: [
            "She likes reading books, watching movies and playing games",
            "She likes reading books watching movies and playing games",
            "She likes reading books, watching movies, and playing games",
            "She likes reading books, watching movies and, playing games",
          ],
          answer: "She likes reading books, watching movies, and playing games",
          explanation: "Use commas to separate items in a list. The comma before 'and' is called the Oxford comma.",
          difficulty: 2,
        },
      ],
    },
  ],
}
