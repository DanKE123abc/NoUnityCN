'use client';

import { useSearchParams } from "next/navigation";
import React from "react";
import { Download, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ANDROID_BS = "Android";
const IOS_BS = "iOS";
const WEBGL_BS = "WebGL";
const APPLETV_BS = "AppleTV";
const VISIONOS_BS = "VisionOS";
const LINUX_IL2CPP_BS = 'Linux-IL2CPP';
const LINUX_MONO_BS = "Linux-Mono";
const LINUX_SERVER_BS = "Linux-Server";
const MAC_MONO_BS = "Mac-Mono";
const MAC_SERVER_BS = "Mac-Server";
const WINDOWS_IL2CPP_BS = "Windows-IL2CPP";
const WINDOWS_MONO_BS = "Windows-Mono";
const WINDOWS_SERVER_BS = "Windows-Server";
const UWP_BS = "Universal-Windows-Platform";

function parseUnityHubUri(uri: string): { version: string; fileId: string } | null {
    const pattern = /^unityhub:\/\/([^\/]+)\/(.+)$/;
    const matches = uri.match(pattern);
    if (!matches || matches.length < 3) return null;
    return { version: matches[1], fileId: matches[2] };
}

function parseLinkDocumentation(key: string) {
    const pattern = /(?<=unityhub:\/\/)(\d+\.\d+)/;
    const matches = key.match(pattern);
    return `https://cloudmedia-docs.unity3d.com/docscloudstorage/${matches?.[1]}/UnityDocumentation.zip`;
}

function parseLinkBS(key: string) {
    return `https://pd.zwc365.com/https://download.unity3d.com/download_unity/${parseUnityHubUri(key)?.fileId}/builtin_shaders-${parseUnityHubUri(key)?.version}.zip`;
}

function parseLinkwin(bs: string, key: string) {
    return `https://pd.zwc365.com/https://download.unity3d.com/download_unity/${parseUnityHubUri(key)?.fileId}/TargetSupportInstaller/UnitySetup-${bs}-Support-for-Editor-${parseUnityHubUri(key)?.version}.exe`;
}

function parseLinkmac(bs: string, key: string) {
    return `https://pd.zwc365.com/https://download.unity3d.com/download_unity/${parseUnityHubUri(key)?.fileId}/MacEditorTargetInstaller/UnitySetup-${bs}-Support-for-Editor-${parseUnityHubUri(key)?.version}.pkg`;
}

function parseLinklinux(bs: string, key: string) {
    return `https://pd.zwc365.com/https://download.unity3d.com/download_unity/${parseUnityHubUri(key)?.fileId}/LinuxEditorTargetInstaller/UnitySetup-${bs}-Support-for-Editor-${parseUnityHubUri(key)?.version}.tar.xz`;
}

function DownloadButton({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <Button variant="secondary" className="w-full" size="lg" href={href}>
            <Download className="w-5 h-5 mr-2" />
            {children}
        </Button>
    );
}

export default function ComponentContent() {
    const searchParams = useSearchParams();
    const version = searchParams.get('v') || '';
    const parsed = parseUnityHubUri(version);

    return (
        <div className="min-h-screen flex flex-col">
            <main className="flex-1">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-8 flex items-center gap-2">
                        <a href="/" className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                            <Home className="w-6 h-6 text-gray-500 hover:text-gray-700 transition-colors" />
                        </a>
                        <div className="flex items-baseline gap-2">
                            添加组件：
                            <span className="text-lg text-gray-500">{version}</span>
                        </div>
                    </h1>

                    <Card className="mb-6">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-xl">其他内容</CardTitle>
                            <Badge>其他</Badge>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-600 mb-4">下载 Unity {parsed?.version} 的 其他内容</p>
                            <div className="space-y-4">
                                <DownloadButton href={parseLinkDocumentation(version)}>
                                    离线文档
                                </DownloadButton>
                                <DownloadButton href={parseLinkBS(version)}>
                                    Builtin Shaders (内置着色器)
                                </DownloadButton>
                                <DownloadButton href={`./unityModule?v=${version}`}>
                                    module.json 生成
                                </DownloadButton>
                            </div>
                        </CardContent>
                    </Card>

                    <Tabs defaultValue="windows">
                        <TabsList className="w-full justify-start gap-1 h-auto flex-wrap">
                            <TabsTrigger value="windows">Windows</TabsTrigger>
                            <TabsTrigger value="mac">Mac OS</TabsTrigger>
                            <TabsTrigger value="linux">Linux</TabsTrigger>
                        </TabsList>

                        <TabsContent value="windows">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-xl">Windows专区</CardTitle>
                                    <Badge>WINDOWS</Badge>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-600 mb-4">下载适用于Windows平台下Unity {parsed?.version}的组件</p>
                                    <div className="space-y-4">
                                        <DownloadButton href={parseLinkwin(ANDROID_BS, version)}>Android Build Support</DownloadButton>
                                        <DownloadButton href={parseLinkwin(IOS_BS, version)}>iOS Build Support</DownloadButton>
                                        <DownloadButton href={parseLinkwin(WEBGL_BS, version)}>WebGL Build Support</DownloadButton>
                                        <DownloadButton href={parseLinkwin(APPLETV_BS, version)}>Apple tvOS Build Support</DownloadButton>
                                        <DownloadButton href={parseLinkwin(VISIONOS_BS, version)}>VisionOS Build Support</DownloadButton>
                                        <DownloadButton href={parseLinkwin(LINUX_IL2CPP_BS, version)}>Linux Build Support (IL2CPP)</DownloadButton>
                                        <DownloadButton href={parseLinkwin(LINUX_MONO_BS, version)}>Linux Build Support (Mono)</DownloadButton>
                                        <DownloadButton href={parseLinkwin(LINUX_SERVER_BS, version)}>Linux Dedicated Server Build Support</DownloadButton>
                                        <DownloadButton href={parseLinkwin(MAC_MONO_BS, version)}>Mac Build Support (Mono)</DownloadButton>
                                        <DownloadButton href={parseLinkwin(MAC_SERVER_BS, version)}>Mac Dedicated Server Build Support</DownloadButton>
                                        <DownloadButton href={parseLinkwin(WINDOWS_IL2CPP_BS, version)}>Windows Build Support (IL2CPP)</DownloadButton>
                                        <DownloadButton href={parseLinkwin(WINDOWS_SERVER_BS, version)}>Windows Dedicated Server Build Support</DownloadButton>
                                        <DownloadButton href={parseLinkwin(UWP_BS, version)}>Universal Windows Platform Build Support</DownloadButton>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="mac">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-xl">Mac OS专区</CardTitle>
                                    <Badge>Mac</Badge>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-600 mb-4">下载适用于Mac OS平台下Unity {parsed?.version}的组件</p>
                                    <div className="space-y-4">
                                        <DownloadButton href={parseLinkmac(ANDROID_BS, version)}>Android Build Support</DownloadButton>
                                        <DownloadButton href={parseLinkmac(IOS_BS, version)}>iOS Build Support</DownloadButton>
                                        <DownloadButton href={parseLinkmac(WEBGL_BS, version)}>WebGL Build Support</DownloadButton>
                                        <DownloadButton href={parseLinkmac(APPLETV_BS, version)}>Apple tvOS Build Support</DownloadButton>
                                        <DownloadButton href={parseLinkmac(VISIONOS_BS, version)}>VisionOS Build Support</DownloadButton>
                                        <DownloadButton href={parseLinkmac(LINUX_IL2CPP_BS, version)}>Linux Build Support (IL2CPP)</DownloadButton>
                                        <DownloadButton href={parseLinkmac(LINUX_MONO_BS, version)}>Linux Build Support (Mono)</DownloadButton>
                                        <DownloadButton href={parseLinkmac(LINUX_SERVER_BS, version)}>Linux Dedicated Server Build Support</DownloadButton>
                                        <DownloadButton href={parseLinkmac(MAC_MONO_BS, version)}>Mac Build Support (Mono)</DownloadButton>
                                        <DownloadButton href={parseLinkmac(MAC_SERVER_BS, version)}>Mac Dedicated Server Build Support</DownloadButton>
                                        <DownloadButton href={parseLinkmac(WINDOWS_MONO_BS, version)}>Windows Build Support (Mono)</DownloadButton>
                                        <DownloadButton href={parseLinkmac(WINDOWS_SERVER_BS, version)}>Windows Dedicated Server Build Support</DownloadButton>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="linux">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-xl">Linux专区</CardTitle>
                                    <Badge>LINUX</Badge>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-600 mb-4">下载适用于LINUX平台下Unity {parsed?.version}的组件</p>
                                    <div className="space-y-4">
                                        <DownloadButton href={parseLinklinux(ANDROID_BS, version)}>Android Build Support</DownloadButton>
                                        <DownloadButton href={parseLinklinux(IOS_BS, version)}>iOS Build Support</DownloadButton>
                                        <DownloadButton href={parseLinklinux(WEBGL_BS, version)}>WebGL Build Support</DownloadButton>
                                        <DownloadButton href={parseLinklinux(LINUX_IL2CPP_BS, version)}>Linux Build Support (IL2CPP)</DownloadButton>
                                        <DownloadButton href={parseLinklinux(LINUX_SERVER_BS, version)}>Linux Dedicated Server Build Support</DownloadButton>
                                        <DownloadButton href={parseLinklinux(MAC_MONO_BS, version)}>Mac Build Support (Mono)</DownloadButton>
                                        <DownloadButton href={parseLinklinux(MAC_SERVER_BS, version)}>Mac Dedicated Server Build Support</DownloadButton>
                                        <DownloadButton href={parseLinklinux(WINDOWS_IL2CPP_BS, version)}>Windows Build Support (IL2CPP)</DownloadButton>
                                        <DownloadButton href={parseLinklinux(WINDOWS_SERVER_BS, version)}>Windows Dedicated Server Build Support</DownloadButton>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </main>
        </div>
    );
}
