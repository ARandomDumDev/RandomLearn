import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function AuthErrorPage() {
  return (
    <Card className="border-0 shadow-2xl">
      <CardHeader className="space-y-2 text-center">
        <CardTitle className="text-2xl">Authentication Error</CardTitle>
        <CardDescription>Something went wrong during authentication</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">
          <p className="font-medium">Please try again or contact support if the problem persists.</p>
        </div>
        <Link href="/auth/login" className="block">
          <Button className="w-full">Back to Login</Button>
        </Link>
      </CardContent>
    </Card>
  )
}
