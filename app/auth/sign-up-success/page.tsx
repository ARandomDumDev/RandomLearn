import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function SignUpSuccessPage() {
  return (
    <Card className="border-0 shadow-2xl">
      <CardHeader className="space-y-2 text-center">
        <CardTitle className="text-2xl">Check Your Email</CardTitle>
        <CardDescription>We&apos;ve sent you a confirmation link to verify your account</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-md bg-blue-50 p-4 text-sm text-blue-700">
          <p className="font-medium">Next steps:</p>
          <ul className="mt-2 list-inside list-disc space-y-1">
            <li>Check your email inbox</li>
            <li>Click the confirmation link</li>
            <li>Return here to sign in</li>
          </ul>
        </div>
        <Link href="/auth/login" className="block">
          <Button className="w-full">Back to Sign In</Button>
        </Link>
      </CardContent>
    </Card>
  )
}
