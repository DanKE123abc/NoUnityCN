import type React from "react"
import "@/styles/globals.css"
import { Inter } from "next/font/google"
import { cn } from "@/lib/utils"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "NoUnityCN",
  description: "NoUnityCN"
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
      <html lang="zh-CN">
      <head>
          <link rel="shortcut icon" href="./favicon.ico"/>
      </head>
      <body className={cn(inter.className, "min-h-screen bg-gray-50")}>{children}</body>
      </html>
  )
}


import './globals.css'