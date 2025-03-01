"use client";
import { Download, Share, Box} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { useEffect, useState } from 'react';

type VersionDictionary = Record<string, string[]>;

export default function Page() {
  const [versions, setVersions] = useState<VersionDictionary>({});
  const [showAllVersions, setShowAllVersions] = useState(false);


  useEffect(() => {
    const fetchVersions = async () => {
      try {
        const response = await fetch(`./versions.json`);
        if (!response.ok) {
          throw new Error(`请求失败，状态码：${response.status}`);
        }
        const contentType = response.headers.get('content-type');
        if (!contentType?.includes('application/json')) {
          throw new Error('响应不是有效的JSON');
        }
        const data = await response.json();
        setVersions(data);
      } catch (error) {
        console.error('加载版本失败:', error);
        // 回退数据
        setVersions({
          "6000": ["unityhub://6000.0.38f1/82314a941f2d"]
        });
      }
    };
    fetchVersions();
  }, []);


  const [selectedVersion, setSelectedVersion] = useState("all");

  function getLatestVersion(): string {
    // 获取所有年份并按数字降序排列
    const availableYears = Object.keys(versions)
        .map(Number)
        .sort((a, b) => b - a);

    if (availableYears.length === 0) return "unityhub://6000.0.38f1/82314a941f2d";

    // 取最大年份的版本列表（将数字转回字符串key）
    const latestYear = availableYears[0].toString();
    // @ts-ignore
    const yearVersions = versions[latestYear];

    if (!yearVersions || yearVersions.length === 0) {
      return "unityhub://6000.0.38f1/82314a941f2d";
    }

    // @ts-ignore
    return yearVersions.sort((a, b) => {
      const aVer = a.split('/')[2].split('.')[1];
      const bVer = b.split('/')[2].split('.')[1];
      return bVer.localeCompare(aVer);
    })[0];
  }

  function getVersionName(url: string)
  {
    const version = url.split("://")[1].split("/")[0];
    return `Unity ${version}`;
  }

  // @ts-ignore
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* 标题区域 */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">下载 Unity</h2>
            <p className="text-lg text-gray-600">选择适合您的版本开始创作</p>
          </div>

          {/* 下载卡片 */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* 稳定版 */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xl">最新版本</CardTitle>
                <Badge>国际</Badge>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{getVersionName(getLatestVersion())}</p>
                <div className="space-y-4">
                  <Button className="w-full" size="lg" href={`./download?v=${getLatestVersion()}`}>
                    <Download className="w-5 h-5 mr-2"/>
                    立刻下载
                  </Button>
                    <Button variant="secondary" className="w-full" size="lg" href={`./component?v=${getLatestVersion()}`}>
                        <Box className="w-5 h-5 mr-2"/>
                        添加组件
                    </Button>
                </div>
              </CardContent>
            </Card>

            {/* Hub */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xl">团结引擎</CardTitle>
                <Badge>中国</Badge>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">下载Unity的中国版本</p>
                <p className="text-gray-600 mb-4">请注意：您可以将您的项目从Unity迁移到团结引擎，但目前不支持从团结引擎迁移到Unity。</p>
                <div className="space-y-4">
                  <Button variant="secondary" className="w-full" size="lg" href="https://unity.cn/releases">
                    <Share className="w-5 h-5 mr-2"/>
                    前往官网
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 历史版本下载 */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle>历史版本下载</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-4 mb-4 overflow-x-auto flex-nowrap pb-2">
                <Button
                    key="all"
                    variant={selectedVersion === "all" ? "default" : "outline"}
                    onClick={() => setSelectedVersion("all")}
                >
                  所有版本
                </Button>
                {Object.keys(versions)
                    .sort((a, b) => parseInt(b) - parseInt(a)) // 对年份进行排序
                    .map((year) => (
                        <Button
                            key={year}
                            variant={selectedVersion === year ? "default" : "outline"}
                            onClick={() => setSelectedVersion(year)}
                        >
                          {year} 系列
                        </Button>
                    ))}
              </div>
              <ul className = "space-y-4">
                {selectedVersion === "all"
                    ? Object.keys(versions)
                        .sort((a, b) => parseInt(b) - parseInt(a))
                        .flatMap(year => versions[year])
                        .slice(0, showAllVersions ? undefined : 5) // 控制显示数量
                        .map((url) => (
                            <div className="overflow-x-auto">
                            <li key={url} className="flex gap-2">
                              <Button
                                  variant="secondary"
                                  className="flex-grow" // 修改为 flex-grow 自动扩展
                                  size="lg"
                                  href={`./download?v=${url}`}>
                                <Download className="w-5 h-5 mr-2"/>
                                {getVersionName(url)}下载
                              </Button>
                              <Button
                                  className="flex-initial"
                                  size="lg"
                                  href={`./component?v=${url}`}>
                                <Box className="w-5 h-5 mr-2"/>
                                添加组件
                              </Button>
                            </li>
                            </div>
                        ))
                    : versions[selectedVersion].map((url: string) => (
                        <div className="overflow-x-auto">
                          <li key={url} className="flex gap-2">
                            <Button
                                variant="secondary"
                                className="flex-grow" // 修改为 flex-grow 自动扩展
                                size="lg"
                                href={`./download?v=${url}`}>
                              <Download className="w-5 h-5 mr-2"/>
                              {getVersionName(url)}下载
                            </Button>
                            <Button
                                className="flex-initial"
                                size="lg"
                                href={`./component?v=${url}`}>
                              <Box className="w-5 h-5 mr-2"/>
                              添加组件
                            </Button>
                          </li>
                        </div>
                    ))}

                {/* 添加更多版本按钮 */}
                {!showAllVersions && selectedVersion === "all" && (
                    <li>
                      <Button
                          variant="ghost"
                          className="w-full"
                          onClick={() => setShowAllVersions(true)}
                      >
                        显示更多版本 ↓
                      </Button>
                    </li>
                )}
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>
      <SiteFooter/>
    </div>
  );
}