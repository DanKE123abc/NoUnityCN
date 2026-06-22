"use client";
import { Download, Share, Box, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";

type VersionDictionary = Record<string, string[]>;

function extractFileId(downloadUrl: string): string | null {
  const match = downloadUrl.match(/download_unity\/([^/]+)\//);
  return match ? match[1] : null;
}

function buildUnityHubUri(version: string, fileId: string): string {
  return `unityhub://${version}/${fileId}`;
}

function groupReleasesByStreamAndYear(results: any[]): Record<string, Record<string, string[]>> {
  const grouped: Record<string, Record<string, string[]>> = {};

  const streamMapping: Record<string, string> = {
    "SUPPORTED": "TECH",
  };

  for (const release of results) {
    const version: string = release.version;
    const rawStream: string = release.stream;
    const stream = streamMapping[rawStream] || rawStream;
    const versionNum = version.split('.')[0];
    const year = versionNum;

    const winDownload = release.downloads?.find((d: any) => d.platform === 'WINDOWS' && d.architecture === 'X86_64');
    const macDownload = release.downloads?.find((d: any) => d.platform === 'MAC_OS' && d.architecture === 'X86_64');
    const linuxDownload = release.downloads?.find((d: any) => d.platform === 'LINUX' && d.architecture === 'X86_64');

    const fileId = extractFileId(winDownload?.url || macDownload?.url || linuxDownload?.url || '');
    if (!fileId) continue;

    if (!grouped[stream]) grouped[stream] = {};
    if (!grouped[stream][year]) grouped[stream][year] = [];
    grouped[stream][year].push(buildUnityHubUri(version, fileId));
  }

  for (const stream of Object.keys(grouped)) {
    for (const year of Object.keys(grouped[stream])) {
      grouped[stream][year].sort((a, b) => {
        const aVer = a.split('/')[2].split('.')[1];
        const bVer = b.split('/')[2].split('.')[1];
        return bVer.localeCompare(aVer);
      });
    }
  }

  return grouped;
}

export default function Page() {

  const [versionsData, setVersionsData] = useState<Record<string, VersionDictionary>>({});
  const [showAllVersions, setShowAllVersions] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState("all");
  const [versionType, setVersionType] = useState("TECH");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<Array<{type: string, url: string}>>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAllVersions = async () => {
      setIsLoading(true);
      try {
        const streams = ["TECH", "LTS", "BETA", "ALPHA", "SUPPORTED"];
        const fetches = streams.map(stream =>
          fetch(`/api/releases?limit=25&stream=${stream}`)
            .then(r => r.json())
            .then(d => ({ stream, results: d.results || [] }))
            .catch(() => ({ stream, results: [] }))
        );
        const allResults = await Promise.all(fetches);
        const allData: Record<string, Record<string, string[]>> = {};

        for (const { stream, results } of allResults) {
          const grouped = groupReleasesByStreamAndYear(results);
          for (const s of Object.keys(grouped)) {
            const targetStream = s === "SUPPORTED" ? "TECH" : s;
            if (!allData[targetStream]) allData[targetStream] = {};
            for (const year of Object.keys(grouped[s])) {
              if (!allData[targetStream][year]) allData[targetStream][year] = [];
              allData[targetStream][year].push(...grouped[s][year]);
            }
          }
        }

        if (Object.keys(allData).length === 0) {
          allData["LTS"] = { "6000": ["unityhub://6000.0.38f1/82314a941f2d"] };
        }

        for (const stream of Object.keys(allData)) {
          for (const year of Object.keys(allData[stream])) {
            allData[stream][year].sort((a, b) => {
              const aVer = a.split('/')[2].split('.')[1];
              const bVer = b.split('/')[2].split('.')[1];
              return bVer.localeCompare(aVer);
            });
          }
        }

        setVersionsData(allData);
      } catch (error) {
        console.error('加载版本失败:', error);
        setVersionsData({
          "LTS": { "6000": ["unityhub://6000.0.38f1/82314a941f2d"] }
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllVersions();
  }, []);

  const versions = versionsData[versionType] || {};

  useEffect(() => {
    if (searchQuery) {
      setIsSearching(true);
      const results: Array<{type: string, url: string}> = [];

      const typeOrder = ["LTS", "TECH", "BETA", "ALPHA", "SUPPORTED"];

      for (const type of typeOrder) {
        const typeVersions = versionsData[type] || {};

        for (const year in typeVersions) {
          for (const url of typeVersions[year]) {
            const versionName = getVersionName(url);
            if (versionName.toLowerCase().includes(searchQuery.toLowerCase())) {
              results.push({ type, url });
            }
          }
        }
      }

      results.sort((a, b) => {
        const aVersion = a.url.split("://")[1].split("/")[0];
        const bVersion = b.url.split("://")[1].split("/")[0];

        const aMain = parseInt(aVersion.split(".")[0]);
        const bMain = parseInt(bVersion.split(".")[0]);
        if (aMain !== bMain) return bMain - aMain;

        const typeIndexA = typeOrder.indexOf(a.type);
        const typeIndexB = typeOrder.indexOf(b.type);
        if (typeIndexA !== typeIndexB) return typeIndexA - typeIndexB;

        const aRev = aVersion.split(".")[1];
        const bRev = bVersion.split(".")[1];
        return bRev.localeCompare(aRev);
      });

      setSearchResults(results);
    } else {
      setIsSearching(false);
    }
  }, [searchQuery, versionsData]);

  function getLatestVersion(type: string = "LTS"): string {
    const typeVersions = versionsData[type] || {};
    const availableYears = Object.keys(typeVersions)
        .map(Number)
        .sort((a, b) => b - a);

    if (availableYears.length === 0) return "unityhub://6000.0.38f1/82314a941f2d";

    const latestYear = availableYears[0].toString();
    const yearVersions = typeVersions[latestYear];

    if (!yearVersions || yearVersions.length === 0) {
      return "unityhub://6000.0.38f1/82314a941f2d";
    }

    return yearVersions.sort((a, b) => {
      const aVer = a.split('/')[2].split('.')[1];
      const bVer = b.split('/')[2].split('.')[1];
      return bVer.localeCompare(aVer);
    })[0];
  }

  function getVersionName(url: string) {
    const version = url.split("://")[1].split("/")[0];
    return `Unity ${version}`;
  }

  const filterVersions = (versions: string[]) => {
    if (!searchQuery) return versions;
    return versions.filter(url =>
      getVersionName(url).toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const renderVersionItem = (url: string, type?: string) => (
    <div className="overflow-x-auto" key={`${type || versionType}-${url}`}>
      <li className="flex gap-2">
        <Button
          variant="secondary"
          className="flex-grow"
          size="lg"
          href={`./download?v=${url}`}
        >
          <Download className="w-5 h-5 mr-2"/>
          {type ? <><span className="font-bold">[{type}]</span> {getVersionName(url)} </> : getVersionName(url)}下载
        </Button>
        <Button
            variant="secondary"
            className="flex-initial"
            size="lg"
            href={`./releaseNotes?v=${url}`}
        >
          <Share className="w-5 h-5 mr-2"/>
          查看发行说明
        </Button>
        <Button
            className="flex-initial"
            size="lg"
            href={`./component?v=${url}`}
        >
          <Box className="w-5 h-5 mr-2"/>
          添加组件
        </Button>
      </li>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        {isLoading && (
          <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50">
            <div className="text-center">
              <div className="animate-spin inline-block w-8 h-8 border-[3px] border-current border-t-transparent rounded-full mb-2"></div>
              <p className="text-lg text-gray-700">加载中...</p>
            </div>
          </div>
        )}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">下载 Unity</h2>
            <p className="text-lg text-gray-600">选择适合您的版本开始创作</p>
          </div>

          <div className="flex justify-center space-x-4 mb-8">
            {[
              { id: "TECH", name: "技术支持" },
              { id: "LTS", name: "长期支持" },
              { id: "BETA", name: "测试版" },
              { id: "ALPHA", name: "预览版" }
            ].map((type) => (
              <Button
                key={type.id}
                variant={versionType === type.id ? "default" : "outline"}
                className="rounded-full px-6 py-2"
                onClick={() => {
                  setVersionType(type.id);
                  setSelectedVersion("all");
                  if (searchQuery) {
                    setSearchQuery("");
                  }
                }}
              >
                {type.name}
              </Button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xl">
                  {versionType === "LTS" && "长期支持版本"}
                  {versionType === "TECH" && "技术支持版本"}
                  {versionType === "BETA" && "测试版本"}
                  {versionType === "ALPHA" && "预览版本"}
                </CardTitle>
                <Badge>{versionType === "TECH" ? "SUPPORTED" : versionType}</Badge>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{getVersionName(getLatestVersion(versionType))}</p>
                <div className="space-y-4">
                  <Button className="w-full" size="lg" href={`./download?v=${getLatestVersion(versionType)}`}>
                    <Download className="w-5 h-5 mr-2"/>
                    立刻下载
                  </Button>
                  <Button variant="secondary" className="w-full" size="lg" href={`./component?v=${getLatestVersion(versionType)}`}>
                    <Box className="w-5 h-5 mr-2"/>
                    添加组件
                  </Button>
                </div>
              </CardContent>
            </Card>

          </div>

          <Card className="mb-12">
            <CardHeader>
              <CardTitle>
                {isSearching
                  ? `全局搜索结果 "${searchQuery}"`
                  : `所有${versionType === "LTS" ? "长期支持" :
                         versionType === "TECH" ? "技术支持" :
                         versionType === "BETA" ? "测试" :
                         versionType === "ALPHA" ? "预览" : ""}版本`
                }
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative mb-6">
                <Input
                  type="text"
                  placeholder="全局搜索版本..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10"
                />
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              </div>

              {!isSearching && (
                <div className="flex space-x-4 mb-4 overflow-x-auto flex-nowrap pb-2">
                  <Button
                    key="all"
                    variant={selectedVersion === "all" ? "default" : "outline"}
                    onClick={() => setSelectedVersion("all")}
                  >
                    所有版本
                  </Button>
                  {Object.keys(versions)
                    .sort((a, b) => parseInt(b) - parseInt(a))
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
              )}

              <ul className="space-y-4">
                {isSearching ? (
                  <>
                    {searchResults.length > 0 ? (
                      searchResults
                        .slice(0, showAllVersions ? undefined : 10)
                        .map(item => renderVersionItem(item.url, item.type))
                    ) : (
                      <li className="text-center text-gray-500 py-4">
                        没有找到匹配的版本
                      </li>
                    )}

                    {!showAllVersions && searchResults.length > 10 && (
                      <li>
                        <Button
                          variant="ghost"
                          className="w-full"
                          onClick={() => setShowAllVersions(true)}
                        >
                          显示更多搜索结果 ({searchResults.length - 10} 个) ↓
                        </Button>
                      </li>
                    )}
                  </>
                ) : (
                  <>
                    {selectedVersion === "all"
                      ? Object.keys(versions)
                        .sort((a, b) => parseInt(b) - parseInt(a))
                        .flatMap(year => versions[year])
                        .filter(url => !searchQuery || getVersionName(url).toLowerCase().includes(searchQuery.toLowerCase()))
                        .slice(0, showAllVersions ? undefined : 5)
                        .map(url => renderVersionItem(url))
                      : filterVersions(versions[selectedVersion] || []).map(url => renderVersionItem(url))}

                    {!showAllVersions && selectedVersion === "all" && (
                      Object.keys(versions)
                        .flatMap(year => versions[year])
                        .filter(url => !searchQuery || getVersionName(url).toLowerCase().includes(searchQuery.toLowerCase()))
                        .length > 5
                    ) && (
                      <li>
                        <Button
                          variant="ghost"
                          className="w-full"
                          onClick={() => setShowAllVersions(true)}
                        >
                          显示更多版本 ({Object.keys(versions)
                            .flatMap(year => versions[year])
                            .filter(url => !searchQuery || getVersionName(url).toLowerCase().includes(searchQuery.toLowerCase()))
                            .length} 个) ↓
                        </Button>
                      </li>
                    )}

                    {((selectedVersion === "all" &&
                      Object.keys(versions)
                        .flatMap(year => versions[year])
                        .filter(url => !searchQuery || getVersionName(url).toLowerCase().includes(searchQuery.toLowerCase()))
                        .length === 0) ||
                      (selectedVersion !== "all" && filterVersions(versions[selectedVersion] || []).length === 0)) &&
                      searchQuery && (
                        <li className="text-center text-gray-500 py-4">
                          没有找到匹配的版本
                        </li>
                    )}
                  </>
                )}
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
