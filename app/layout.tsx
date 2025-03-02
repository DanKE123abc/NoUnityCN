import type React from "react"
import "@/styles/globals.css"
import { Inter } from "next/font/google"
import { cn } from "@/lib/utils"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "NoUnityCN | Unity国际版下载站 - 让游戏开发更加简单",
  description: "NoUnityCN - Unity国际版下载站 | NoUnityCN是一项开源项目，在为部分特殊地区的开发者提供国际版的Unity下载方式。支持通过直链和Unity Hub下载Unity，支持为Unity添加组件。",
  keywords: "Unity6国际版,Unity组件下载,国际版Unity下载,Unity Hub国际版,UnityHub海外版,Unity引擎下载站,Unity6下载,Unity6000,Unity海外版下载,Unity国际版下载"
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