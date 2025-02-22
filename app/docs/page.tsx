import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

export default function DocsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">文档</h1>
          <div className="prose prose-blue max-w-none">
            <p className="text-xl text-gray-600">
              欢迎来到 NoUnityCN 文档。但是这里还什么都没有做！
            </p>
            {/* 添加更多文档内容 */}
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}

