import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageCircle, Users} from "lucide-react"

export default function CommunityPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">加入社区</h1>
            <p className="text-xl text-gray-600">与其他开发者交流，分享经验，获取帮助</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-6 w-6" />
                  Github
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">查看NoUnityCN的源代码、报告问题</p>
                <Button className="w-full" href="https://github.com/DanKE123abc/NoUnityCN">访问</Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-6 w-6" />
                  BiliBili
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">蛋壳是B站最帅的Up主</p>
                <Button className="w-full" href="https://space.bilibili.com/422698033">看看</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}

