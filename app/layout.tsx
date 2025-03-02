import type React from "react"
import "@/styles/globals.css"
import { Inter } from "next/font/google"
import { cn } from "@/lib/utils"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "NoUnityCN | Unity国际版下载站",
  description: "NoUnityCN - Unity国际版下载站 | NoUnityCN是一项大家一起实现的开源项目，我们旨在为部分特殊地区的Unity开发者提供与世界上大多数用户一致的Unity Editor下载方式。支持通过直链和Unity Hub下载Unity Editor，支持下载Unity Build Support组件。",
  keywords: "Unity国际版下载,Unity免中国版,Unity海外版,绕过Unity中国版,Unity汉化教程,团结引擎,Unity6,Unity6000,Unity下载站,Unity引擎下载站,Unity Hub,下载unity国际版,unityhub海外版,unity6000,unity镜像站,国际版unity下载,unity国际版,unity国际版下载,unity下载,unityhub国际版,unityhub,unityhub国际版下载,nounitycn,unity国际,国际版unity,unity6下载,unity海外版下载下载国际版,Unity组件下载,Unity Build Support,Unity Editor"
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