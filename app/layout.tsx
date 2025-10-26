import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "RandomLearn - Personalized English Learning",
  description:
    "A comprehensive AI-powered English learning platform with personalized lessons, word practice, and gamified learning experience",
  generator: "v0.app",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "RandomLearn",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: "/logo.webp",
    apple: "/logo.webp",
  },
  viewport: "width=device-width, initial-scale=1, viewport-fit=cover, maximum-scale=5",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#2d1b4e" />
        <meta name="mobile-web-app-capable" content="true" />
        <meta name="apple-mobile-web-app-capable" content="true" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="RandomLearn" />
        <meta name="description" content="Personalized AI English learning platform with gamified lessons" />
        <link rel="apple-touch-icon" href="/logo.webp" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/logo.webp" />
      </head>
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
