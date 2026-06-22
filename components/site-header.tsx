"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import Image from "next/image"

const navigation = [
  { name: "主页", href: "/" },
  { name: "Unity Hub", href: "/unityhub" },
  { name: "工具", href: "/tools" },
  { name: "在GitHub上给我们star⭐", href: "https://github.com/NoUnityCN/NoUnityCN" },
]

export function SiteHeader() {
  const pathname = usePathname()

  return (
    <nav className="bg-black shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="flex items-center">
                <Image src="/logo.svg" alt="NoUnityCN" width={122} height={48} />
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "inline-flex items-center px-1 pt-1 border-b-2 text-base font-bold",
                    pathname === item.href
                      ? "border-blue-500 text-white"
                      : "border-transparent text-white",
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

