"use client";
import { Download, Share, Box, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";

interface VersionInfo {
  url: string;
  releaseDate: string;
}

type VersionDictionary = Record<string, VersionInfo[]>;

function extractFileId(downloadUrl: string): string | null {
  const match = downloadUrl.match(/download_unity\/([^/]+)\//);
  return match ? match[1] : null;
}

function buildUnityHubUri(version: string, fileId: string): string {
  return `unityhub://${version}/${fileId}`;
}

function groupReleasesByStreamAndYear(results: any[]): Record<string, Record<string, VersionInfo[]>> {
  const grouped: Record<string, Record<string, VersionInfo[]>> = {};

  const streamMapping: Record<string, string> = {
    "SUPPORTED": "TECH",
  };

  for (const release of results) {
    const version: string = release.version;
    const rawStream: string = release.stream;
    const stream = streamMapping[rawStream] || rawStream;
    const versionNum = version.split('.')[0];
    const year = versionNum;
    const releaseDate = release.releaseDate || '';

    const winDownload = release.downloads?.find((d: any) => d.platform === 'WINDOWS' && d.architecture === 'X86_64');
    const macDownload = release.downloads?.find((d: any) => d.platform === 'MAC_OS' && d.architecture === 'X86_64');
    const linuxDownload = release.downloads?.find((d: any) => d.platform === 'LINUX' && d.architecture === 'X86_64');

    const fileId = extractFileId(winDownload?.url || macDownload?.url || linuxDownload?.url || '');
    if (!fileId) continue;

    if (!grouped[stream]) grouped[stream] = {};
    if (!grouped[stream][year]) grouped[stream][year] = [];
    grouped[stream][year].push({ url: buildUnityHubUri(version, fileId), releaseDate });
  }

  for (const stream of Object.keys(grouped)) {
    for (const year of Object.keys(grouped[stream])) {
      grouped[stream][year].sort((a, b) => {
        const aVer = a.url.split('/')[2].split('.')[1];
        const bVer = b.url.split('/')[2].split('.')[1];
        return bVer.localeCompare(aVer);
      });
    }
  }

  return grouped;
}

function formatDate(dateStr: string): string {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return '-';
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  return `${y}年${m}月${d}日`;
}

export default function Page() {

  const [versionsData, setVersionsData] = useState<Record<string, VersionDictionary>>({});
  const [showAllVersions, setShowAllVersions] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState("all");
  const [versionType, setVersionType] = useState("TECH");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<Array<{type: string, url: string, releaseDate: string}>>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [loadedOffsets, setLoadedOffsets] = useState<Record<string, number>>({});
  const [hasMore, setHasMore] = useState<Record<string, boolean>>({});
  const [isFullyLoaded, setIsFullyLoaded] = useState(false);

  const fetchStreamPage = async (stream: string, limit: number, offset: number): Promise<{results: any[], total: number}> => {
    try {
      const res = await fetch(`/api/releases?limit=${limit}&offset=${offset}&stream=${stream}`);
      if (!res.ok) return { results: [], total: 0 };
      const data = await res.json();
      return { results: data.results || [], total: data.total || 0 };
    } catch {
      return { results: [], total: 0 };
    }
  };

  const mergeResultsIntoData = (
    prev: Record<string, Record<string, VersionInfo[]>>,
    allResults: { stream: string; results: any[]; total: number }[]
  ): { data: Record<string, Record<string, VersionInfo[]>>; offsets: Record<string, number>; more: Record<string, boolean> } => {
    const next = { ...prev };
    const newOffsets: Record<string, number> = {};
    const newHasMore: Record<string, boolean> = {};

    for (const { stream, results, total } of allResults) {
      const grouped = groupReleasesByStreamAndYear(results);
      for (const s of Object.keys(grouped)) {
        const targetStream = s === "SUPPORTED" ? "TECH" : s;
        if (!next[targetStream]) next[targetStream] = {};
        for (const year of Object.keys(grouped[s])) {
          if (!next[targetStream][year]) next[targetStream][year] = [];
          next[targetStream][year].push(...grouped[s][year]);
        }
      }
      const targetKey = stream === "SUPPORTED" ? "TECH" : stream;
      newOffsets[targetKey] = (prev[targetKey] ? Object.values(prev[targetKey]).flat().length : 0) + results.length;
      newHasMore[targetKey] = newOffsets[targetKey] < total;
    }

    for (const streamKey of Object.keys(next)) {
      for (const year of Object.keys(next[streamKey])) {
        next[streamKey][year].sort((a, b) => {
          const aVer = a.url.split('/')[2].split('.')[1];
          const bVer = b.url.split('/')[2].split('.')[1];
          return bVer.localeCompare(aVer);
        });
      }
    }

    return { data: next, offsets: { ...prev, ...newOffsets }, more: newHasMore };
  };

  useEffect(() => {
    let cancelled = false;

    const fetchAllVersions = async () => {
      setIsLoading(true);
      try {
        const streams = ["TECH", "LTS", "BETA", "ALPHA", "SUPPORTED"];

        const quickFetches = streams.map(stream =>
          fetchStreamPage(stream, 10, 0).then(d => ({ stream, ...d }))
        );
        const quickResults = await Promise.all(quickFetches);
        if (cancelled) return;

        let allData: Record<string, Record<string, VersionInfo[]>> = {};
        let offsets: Record<string, number> = {};
        let more: Record<string, boolean> = {};

        const { data, offsets: o, more: m } = mergeResultsIntoData({}, quickResults);
        allData = data;
        offsets = o;
        more = m;

        if (Object.keys(allData).length === 0) {
          allData["LTS"] = { "6000": [{ url: "unityhub://6000.0.38f1/82314a941f2d", releaseDate: "" }] };
        }

        setVersionsData(allData);
        setLoadedOffsets(offsets);
        setHasMore(more);
        setIsLoading(false);

        const fullFetches = streams.map(stream =>
          fetchStreamPage(stream, 999, 0).then(d => ({ stream, ...d }))
        );
        const fullResults = await Promise.all(fullFetches);
        if (cancelled) return;

        const { data: fullData, offsets: fullOffsets, more: fullMore } = mergeResultsIntoData({}, fullResults);
        setVersionsData(fullData);
        setLoadedOffsets(fullOffsets);
        setHasMore(fullMore);
        setIsFullyLoaded(true);
      } catch (error) {
        if (!cancelled) {
          console.error('加载版本失败:', error);
          setVersionsData({
            "LTS": { "6000": [{ url: "unityhub://6000.0.38f1/82314a941f2d", releaseDate: "" }] }
          });
          setIsLoading(false);
        }
      }
    };

    fetchAllVersions();
    return () => { cancelled = true; };
  }, []);

  const loadMoreForStream = async (stream: string) => {
    if (isFullyLoaded) return;
    const offset = loadedOffsets[stream] || 0;
    const { results, total } = await fetchStreamPage(stream, 25, offset);
    if (results.length === 0) return;

    const grouped = groupReleasesByStreamAndYear(results);
    setVersionsData(prev => {
      const next = { ...prev };
      for (const s of Object.keys(grouped)) {
        const targetStream = s === "SUPPORTED" ? "TECH" : s;
        if (!next[targetStream]) next[targetStream] = {};
        for (const year of Object.keys(grouped[s])) {
          if (!next[targetStream][year]) next[targetStream][year] = [];
          next[targetStream][year].push(...grouped[s][year]);
        }
      }
      for (const streamKey of Object.keys(next)) {
        for (const year of Object.keys(next[streamKey])) {
          next[streamKey][year].sort((a, b) => {
            const aVer = a.url.split('/')[2].split('.')[1];
            const bVer = b.url.split('/')[2].split('.')[1];
            return bVer.localeCompare(aVer);
          });
        }
      }
      return next;
    });
    setLoadedOffsets(prev => ({ ...prev, [stream]: offset + results.length }));
    setHasMore(prev => ({ ...prev, [stream]: offset + results.length < total }));
  };

  const versions = versionsData[versionType] || {};

  useEffect(() => {
    if (searchQuery) {
      setIsSearching(true);
      const results: Array<{type: string, url: string, releaseDate: string}> = [];

      const typeOrder = ["LTS", "TECH", "BETA", "ALPHA", "SUPPORTED"];

      for (const type of typeOrder) {
        const typeVersions = versionsData[type] || {};

        for (const year in typeVersions) {
          for (const v of typeVersions[year]) {
            const versionName = getVersionName(v.url);
            if (versionName.toLowerCase().includes(searchQuery.toLowerCase())) {
              results.push({ type, url: v.url, releaseDate: v.releaseDate });
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
      const aVer = a.url.split('/')[2].split('.')[1];
      const bVer = b.url.split('/')[2].split('.')[1];
      return bVer.localeCompare(aVer);
    })[0].url;
  }

  function getVersionName(url: string) {
    const version = url.split("://")[1].split("/")[0];
    return `${version}`;
  }

  const renderVersionRow = (url: string, releaseDate: string, type?: string) => (
    <tr key={`${type || versionType}-${url}`} className="border-b border-gray-100 hover:bg-gray-50">
      <td className="py-3 px-4 font-medium text-gray-900">
        {type && <Badge variant="outline" className="mr-2 text-xs">{type}</Badge>}
        {getVersionName(url)}
      </td>
      <td className="py-3 px-4 text-gray-500 text-sm">{formatDate(releaseDate)}</td>
      <td className="py-3 px-4">
        <Button variant="secondary" size="sm" href={`./releaseNotes?v=${url}`}>
          <Share className="w-4 h-4 mr-1"/>
          发布说明
        </Button>
      </td>
      <td className="py-3 px-4">
        <Button size="sm" href={`./download?v=${url}`}>
          <Download className="w-4 h-4 mr-1"/>
          下载
        </Button>
      </td>
      <td className="py-3 px-4">
        <Button variant="outline" size="sm" href={`./component?v=${url}`}>
          <Box className="w-4 h-4 mr-1"/>
          添加组件
        </Button>
      </td>
    </tr>
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
                  setShowAllVersions(false);
                  if (searchQuery) {
                    setSearchQuery("");
                  }
                }}
              >
                {type.name}
              </Button>
            ))}
          </div>

          <div className="relative mb-6 max-w-md mx-auto">
            <Input
              type="text"
              placeholder="全局搜索版本..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10"
            />
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
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

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">版本</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">发布时间</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">发布说明</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">下载页面</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">添加组件</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isSearching ? (
                      searchResults.length > 0 ? (
                        searchResults
                          .slice(0, showAllVersions ? undefined : 10)
                          .map(item => renderVersionRow(item.url, item.releaseDate, item.type))
                      ) : (
                        <tr>
                          <td colSpan={5} className="text-center text-gray-500 py-4">没有找到匹配的版本</td>
                        </tr>
                      )
                    ) : (
                      selectedVersion === "all"
                        ? Object.keys(versions)
                          .sort((a, b) => parseInt(b) - parseInt(a))
                          .flatMap(year => versions[year])
                          .slice(0, showAllVersions ? undefined : 10)
                          .map(v => renderVersionRow(v.url, v.releaseDate))
                        : (versions[selectedVersion] || []).map(v => renderVersionRow(v.url, v.releaseDate))
                    )}
                  </tbody>
                </table>
              </div>

              {!isSearching && !showAllVersions && selectedVersion === "all" && Object.keys(versions).flatMap(year => versions[year]).length > 10 && (
                <div className="mt-4">
                  {!isFullyLoaded ? (
                    <div className="text-center text-sm text-gray-400 py-2">全量数据加载中...</div>
                  ) : (
                    <Button
                      variant="ghost"
                      className="w-full"
                      onClick={() => setShowAllVersions(true)}
                    >
                      显示更多版本 ({Object.keys(versions).flatMap(year => versions[year]).length} 个) ↓
                    </Button>
                  )}
                </div>
              )}

              {!isSearching && !showAllVersions && selectedVersion !== "all" && (versions[selectedVersion] || []).length > 10 && (
                <div className="mt-4">
                  {!isFullyLoaded ? (
                    <div className="text-center text-sm text-gray-400 py-2">全量数据加载中...</div>
                  ) : (
                    <Button
                      variant="ghost"
                      className="w-full"
                      onClick={() => setShowAllVersions(true)}
                    >
                      显示更多版本 ({(versions[selectedVersion] || []).length} 个) ↓
                    </Button>
                  )}
                </div>
              )}

              {isSearching && !showAllVersions && searchResults.length > 10 && (
                <div className="mt-4">
                  <Button
                    variant="ghost"
                    className="w-full"
                    onClick={() => setShowAllVersions(true)}
                  >
                    显示更多搜索结果 ({searchResults.length - 10} 个) ↓
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
