"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Plus, Trash2, Volume2, Lock } from "lucide-react"

interface WordMeaning {
  id: string
  word: string
  meaning: string
  example_sentence: string
  pronunciation: string
  difficulty_level: number
  times_practiced: number
  mastered: boolean
}

export function WordAndMeaning() {
  const [words, setWords] = useState<WordMeaning[]>([])
  const [newWord, setNewWord] = useState("")
  const [newMeaning, setNewMeaning] = useState("")
  const [newExample, setNewExample] = useState("")
  const [newPronunciation, setNewPronunciation] = useState("")
  const [loading, setLoading] = useState(true)
  const [currentPracticeIndex, setCurrentPracticeIndex] = useState(0)
  const [showMeaning, setShowMeaning] = useState(false)
  const [tab, setTab] = useState("practice")
  const [editingId, setEditingId] = useState<string | null>(null)

  const supabase = createClient()

  useEffect(() => {
    fetchWords()
  }, [])

  const fetchWords = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      const { data } = await supabase
        .from("word_meanings")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      setWords(data || [])
    } catch (error) {
      console.error("[v0] Error fetching words:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddWord = async () => {
    if (!newWord || !newMeaning) return

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      const { data } = await supabase
        .from("word_meanings")
        .insert({
          user_id: user.id,
          word: newWord,
          meaning: newMeaning,
          example_sentence: newExample,
          pronunciation: newPronunciation,
          difficulty_level: 1,
        })
        .select()

      if (data) {
        setWords([data[0], ...words])
        setNewWord("")
        setNewMeaning("")
        setNewExample("")
        setNewPronunciation("")
      }
    } catch (error) {
      console.error("[v0] Error adding word:", error)
    }
  }

  const handleDeleteWord = async (id: string) => {
    try {
      await supabase.from("word_meanings").delete().eq("id", id)
      setWords(words.filter((w) => w.id !== id))
    } catch (error) {
      console.error("[v0] Error deleting word:", error)
    }
  }

  const handleMarkMastered = async (id: string, mastered: boolean) => {
    try {
      if (mastered) {
        console.log("[v0] Word already mastered, cannot modify")
        return
      }

      await supabase
        .from("word_meanings")
        .update({
          mastered: true,
          times_practiced: words.find((w) => w.id === id)?.times_practiced || 0 + 1,
          last_practiced_at: new Date().toISOString(),
        })
        .eq("id", id)

      setWords(words.map((w) => (w.id === id ? { ...w, mastered: true, times_practiced: w.times_practiced + 1 } : w)))
    } catch (error) {
      console.error("[v0] Error updating word:", error)
    }
  }

  const handlePracticeNext = () => {
    if (currentPracticeIndex < words.length - 1) {
      setCurrentPracticeIndex((prev) => prev + 1)
      setShowMeaning(false)
    }
  }

  const handlePracticePrev = () => {
    if (currentPracticeIndex > 0) {
      setCurrentPracticeIndex((prev) => prev - 1)
      setShowMeaning(false)
    }
  }

  const masteredCount = words.filter((w) => w.mastered).length
  const masteryPercentage = words.length > 0 ? (masteredCount / words.length) * 100 : 0

  if (loading) {
    return <div className="text-center py-8">Loading words...</div>
  }

  return (
    <Tabs value={tab} onValueChange={setTab} className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="practice">Practice</TabsTrigger>
        <TabsTrigger value="list">My Words</TabsTrigger>
        <TabsTrigger value="add">Add Word</TabsTrigger>
      </TabsList>

      <TabsContent value="practice" className="space-y-4">
        {words.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground">No words to practice yet. Add some words to get started!</p>
            </CardContent>
          </Card>
        ) : (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Mastery Progress</CardTitle>
                <Progress value={masteryPercentage} className="mt-2" />
                <p className="text-sm text-muted-foreground mt-2">
                  {masteredCount} of {words.length} words mastered
                </p>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">{words[currentPracticeIndex].word}</CardTitle>
                <CardDescription>
                  Word {currentPracticeIndex + 1} of {words.length}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Badge variant="outline">Level {words[currentPracticeIndex].difficulty_level}</Badge>
                  <Badge variant="outline">Practiced {words[currentPracticeIndex].times_practiced} times</Badge>
                  {words[currentPracticeIndex].mastered && <Badge className="bg-green-600">Mastered</Badge>}
                </div>

                {words[currentPracticeIndex].pronunciation && (
                  <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                    <Volume2 className="w-4 h-4" />
                    <span className="text-sm italic">{words[currentPracticeIndex].pronunciation}</span>
                  </div>
                )}

                <Button onClick={() => setShowMeaning(!showMeaning)} variant="outline" className="w-full">
                  {showMeaning ? "Hide Meaning" : "Reveal Meaning"}
                </Button>

                {showMeaning && (
                  <div className="space-y-3">
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <p className="text-sm font-medium text-gray-600">Meaning</p>
                      <p className="text-lg mt-2">{words[currentPracticeIndex].meaning}</p>
                    </div>

                    {words[currentPracticeIndex].example_sentence && (
                      <div className="p-4 bg-green-50 rounded-lg">
                        <p className="text-sm font-medium text-gray-600">Example</p>
                        <p className="text-sm mt-2 italic">{words[currentPracticeIndex].example_sentence}</p>
                      </div>
                    )}

                    <Button
                      onClick={() =>
                        handleMarkMastered(words[currentPracticeIndex].id, words[currentPracticeIndex].mastered)
                      }
                      className="w-full"
                      variant={words[currentPracticeIndex].mastered ? "default" : "outline"}
                      disabled={words[currentPracticeIndex].mastered}
                    >
                      {words[currentPracticeIndex].mastered ? (
                        <>
                          <Lock className="w-4 h-4 mr-2" />
                          Mastered (Locked)
                        </>
                      ) : (
                        "Mark as Mastered"
                      )}
                    </Button>
                  </div>
                )}

                <div className="flex gap-2 pt-4">
                  <Button onClick={handlePracticePrev} disabled={currentPracticeIndex === 0} variant="outline">
                    Previous
                  </Button>
                  <Button
                    onClick={handlePracticeNext}
                    disabled={currentPracticeIndex === words.length - 1}
                    className="flex-1"
                  >
                    Next
                  </Button>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </TabsContent>

      <TabsContent value="list" className="space-y-4">
        {words.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground">No words yet. Start adding words to build your vocabulary!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-3">
            {words.map((word) => (
              <Card key={word.id} className={word.mastered ? "border-green-200 bg-green-50" : ""}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">{word.word}</h3>
                      <p className="text-sm text-gray-600 mt-1">{word.meaning}</p>
                      {word.example_sentence && (
                        <p className="text-xs text-gray-500 mt-2 italic">{word.example_sentence}</p>
                      )}
                      <div className="flex gap-2 mt-3">
                        <Badge variant="outline" className="text-xs">
                          Level {word.difficulty_level}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {word.times_practiced} practices
                        </Badge>
                        {word.mastered && <Badge className="text-xs bg-green-600">Mastered</Badge>}
                      </div>
                    </div>
                    <Button
                      onClick={() => handleDeleteWord(word.id)}
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-700"
                      disabled={word.mastered}
                      title={word.mastered ? "Cannot delete mastered words" : "Delete word"}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="add" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Add New Word</CardTitle>
            <CardDescription>Build your vocabulary for spelling tests</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="word">Word</Label>
              <Input
                id="word"
                placeholder="Enter the word"
                value={newWord}
                onChange={(e) => setNewWord(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="meaning">Meaning</Label>
              <Textarea
                id="meaning"
                placeholder="Enter the meaning"
                value={newMeaning}
                onChange={(e) => setNewMeaning(e.target.value)}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="example">Example Sentence</Label>
              <Textarea
                id="example"
                placeholder="Enter an example sentence"
                value={newExample}
                onChange={(e) => setNewExample(e.target.value)}
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pronunciation">Pronunciation</Label>
              <Input
                id="pronunciation"
                placeholder="e.g., /ˈɪntərɪst/"
                value={newPronunciation}
                onChange={(e) => setNewPronunciation(e.target.value)}
              />
            </div>

            <Button onClick={handleAddWord} className="w-full" disabled={!newWord || !newMeaning}>
              <Plus className="w-4 h-4 mr-2" />
              Add Word
            </Button>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
