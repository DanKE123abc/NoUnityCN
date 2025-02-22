import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-6xl font-bold">404</h1>
      <h2 className="text-2xl font-semibold mt-4">页面未找到</h2>
      <p className="text-gray-600 mt-2">你来到了一片没有知识的荒原。</p>
      <Link href="/" className="mt-4 text-blue-600 hover:text-blue-800 underline">
        返回首页
      </Link>
    </div>
  )
}

