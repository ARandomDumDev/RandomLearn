"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function Home() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const supabase = createClient()

        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (user) {
          router.push("/dashboard")
        } else {
          router.push("/auth/login")
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "An error occurred"
        console.error("[v0] Auth check error:", errorMessage)
        setError(errorMessage)
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [router])

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-900">Configuration Required</CardTitle>
            <CardDescription className="text-red-700">
              Supabase environment variables are not configured
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-md bg-red-100 p-3 text-sm text-red-800">
              <p className="font-mono text-xs break-all">{error}</p>
            </div>
            <div className="space-y-2 text-sm text-red-900">
              <p className="font-semibold">To fix this:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Go to your Vercel project settings</li>
                <li>Click "Connect" in the sidebar</li>
                <li>Add or configure the Supabase integration</li>
                <li>Ensure these env vars are set:</li>
                <ul className="list-disc list-inside ml-4 font-mono text-xs">
                  <li>NEXT_PUBLIC_SUPABASE_URL</li>
                  <li>NEXT_PUBLIC_SUPABASE_ANON_KEY</li>
                </ul>
              </ol>
            </div>
            <Button onClick={() => window.location.reload()} className="w-full bg-red-600 hover:bg-red-700">
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center">
      <div className="text-white text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
        <p>Loading RandomLearn...</p>
      </div>
    </div>
  )
}
