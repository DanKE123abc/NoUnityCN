import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import {Download, Home} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";

export const dynamic = 'force-dynamic'; 

export default function ComponentPage({searchParams,}: {
    searchParams?: { [key: string]: string | string[] | undefined };
}) {
    const version = searchParams?.v;

    const ANDROID_BS = "Android";
    const IOS_BS = "iOS";
    const WEBGL_BS = "WebGL";
    const APPLETV_BS = "AppleTV";
    const LINUX_IL2CPP_BS = 'Linux-IL2CPP';
    const LINUX_MONO_BS = "Linux-Mono";
    const LINUX_SERVER_BS = "Linux-Server";
    const MAC_IL2CPP_BS = "Mac-IL2CPP";
    const MAC_SERVER_BS = "Mac-Server";
    const WINDOWS_MONO_BS = "Windows-Mono";
    const WINDOWS_SERVER_BS = "Windows-Server";
    const UWP_BS = "Universal-Windows-Platform";

    function parseUnityHubUri(uri: string): { version: string; fileId: string } | null {
        const pattern = /^unityhub:\/\/([^\/]+)\/(.+)$/;
        const matches = uri.match(pattern);

        if (!matches || matches.length < 3) {
            return null;
        }

        return {
            version: matches[1],  // 6000.0.38f1
            fileId: matches[2]    // 82314a941f2d
        };
    }

    function parseLinkwin(bs:string , key:string) {
        let downloadLink = `https://download.unity3d.com/download_unity/${parseUnityHubUri(key)?.fileId}/TargetSupportInstaller/UnitySetup-${bs}-Support-for-Editor-${parseUnityHubUri(key)?.version}.exe`;
        return downloadLink;
    }

    function parseLinkmac(bs:string , key:string) {
        let downloadLink = `https://download.unity3d.com/download_unity/${parseUnityHubUri(key)?.fileId}/MacEditorTargetInstaller/UnitySetup-${bs}-Support-for-Editor-${parseUnityHubUri(key)?.version}.pkg`;
        return downloadLink;
    }

    function parseLinklinux(bs:string , key:string) {
        let downloadLink = `https://download.unity3d.com/download_unity/${parseUnityHubUri(key)?.fileId}/LinuxEditorTargetInstaller/UnitySetup-${bs}-Support-for-Editor-${parseUnityHubUri(key)?.version}.tar.xz`;
        return downloadLink;
    }

    return (
        <div className="min-h-screen flex flex-col">
            <SiteHeader />
            <main className="flex-1">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-8 flex items-center gap-2">
                        <a href="/" className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                            <Home className="w-6 h-6 text-gray-500 hover:text-gray-700 transition-colors"/>
                        </a>
                        <div className="flex items-baseline gap-2">
                            添加组件：
                            <span className="text-lg text-gray-500">{version}</span>
                        </div>
                    </h1>
                    <div className="prose prose-blue max-w-none overflow-x-auto">
                        <ul>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-xl">Windows专区</CardTitle>
                                    <Badge>WINDOWS</Badge>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-600 mb-4">下载适用于Windows平台下Unity {parseUnityHubUri(version)?.version}的组件</p>
                                    <div className="space-y-4">
                                        <Button variant="secondary" className="w-full" size="lg"
                                                href={parseLinkwin(ANDROID_BS, version)}>
                                            <Download className="w-5 h-5 mr-2"/>
                                            Android Build Support
                                        </Button>
                                        <Button variant="secondary" className="w-full" size="lg"
                                                href={parseLinkwin(IOS_BS, version)}>
                                            <Download className="w-5 h-5 mr-2"/>
                                            iOS Build Support
                                        </Button>
                                        <Button variant="secondary" className="w-full" size="lg"
                                                href={parseLinkwin(WEBGL_BS, version)}>
                                            <Download className="w-5 h-5 mr-2"/>
                                            WebGL Build Support
                                        </Button>
                                        <Button variant="secondary" className="w-full" size="lg"
                                                href={parseLinkwin(APPLETV_BS, version)}>
                                            <Download className="w-5 h-5 mr-2"/>
                                            Apple tvOS Build Support
                                        </Button>
                                        <Button variant="secondary" className="w-full" size="lg"
                                                href={parseLinkwin(LINUX_IL2CPP_BS, version)}>
                                            <Download className="w-5 h-5 mr-2"/>
                                            Linux Build Support (IL2CPP)
                                        </Button>
                                        <Button variant="secondary" className="w-full" size="lg"
                                                href={parseLinkwin(LINUX_MONO_BS, version)}>
                                            <Download className="w-5 h-5 mr-2"/>
                                            Linux Build Support (Mono)
                                        </Button>
                                        <Button variant="secondary" className="w-full" size="lg"
                                                href={parseLinkwin(LINUX_SERVER_BS, version)}>
                                            <Download className="w-5 h-5 mr-2"/>
                                            Linux Dedicated Server Build Support
                                        </Button>
                                        <Button variant="secondary" className="w-full" size="lg"
                                                href={parseLinkwin(MAC_IL2CPP_BS, version)}>
                                            <Download className="w-5 h-5 mr-2"/>
                                            Mac Build Support (IL2CPP)
                                        </Button>
                                        <Button variant="secondary" className="w-full" size="lg"
                                                href={parseLinkwin(MAC_SERVER_BS, version)}>
                                            <Download className="w-5 h-5 mr-2"/>
                                            Mac Dedicated Server Build Support
                                        </Button>
                                        <Button variant="secondary" className="w-full" size="lg"
                                                href={parseLinkwin(WINDOWS_MONO_BS, version)}>
                                            <Download className="w-5 h-5 mr-2"/>
                                            Windows Build Support (Mono)
                                        </Button>
                                        <Button variant="secondary" className="w-full" size="lg"
                                                href={parseLinkwin(WINDOWS_SERVER_BS, version)}>
                                            <Download className="w-5 h-5 mr-2"/>
                                            Windows Dedicated Server Build Support
                                        </Button>
                                        <Button variant="secondary" className="w-full" size="lg"
                                                href={parseLinkwin(UWP_BS, version)}>
                                            <Download className="w-5 h-5 mr-2"/>
                                            Universal Windows Platform Build Support
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </ul>
                        <ul>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-xl">Mac OS专区</CardTitle>
                                    <Badge>Mac</Badge>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-600 mb-4">下载适用于Mac OS平台下Unity {parseUnityHubUri(version)?.version}的组件</p>
                                    <div className="space-y-4">
                                        <Button variant="secondary" className="w-full" size="lg"
                                                href={parseLinkmac(ANDROID_BS, version)}>
                                            <Download className="w-5 h-5 mr-2"/>
                                            Android Build Support
                                        </Button>
                                        <Button variant="secondary" className="w-full" size="lg"
                                                href={parseLinkmac(IOS_BS, version)}>
                                            <Download className="w-5 h-5 mr-2"/>
                                            iOS Build Support
                                        </Button>
                                        <Button variant="secondary" className="w-full" size="lg"
                                                href={parseLinkmac(WEBGL_BS, version)}>
                                            <Download className="w-5 h-5 mr-2"/>
                                            WebGL Build Support
                                        </Button>
                                        <Button variant="secondary" className="w-full" size="lg"
                                                href={parseLinkmac(APPLETV_BS, version)}>
                                            <Download className="w-5 h-5 mr-2"/>
                                            Apple tvOS Build Support
                                        </Button>
                                        <Button variant="secondary" className="w-full" size="lg"
                                                href={parseLinkmac(LINUX_IL2CPP_BS, version)}>
                                            <Download className="w-5 h-5 mr-2"/>
                                            Linux Build Support (IL2CPP)
                                        </Button>
                                        <Button variant="secondary" className="w-full" size="lg"
                                                href={parseLinkmac(LINUX_MONO_BS, version)}>
                                            <Download className="w-5 h-5 mr-2"/>
                                            Linux Build Support (Mono)
                                        </Button>
                                        <Button variant="secondary" className="w-full" size="lg"
                                                href={parseLinkmac(LINUX_SERVER_BS, version)}>
                                            <Download className="w-5 h-5 mr-2"/>
                                            Linux Dedicated Server Build Support
                                        </Button>
                                        <Button variant="secondary" className="w-full" size="lg"
                                                href={parseLinkmac(MAC_IL2CPP_BS, version)}>
                                            <Download className="w-5 h-5 mr-2"/>
                                            Mac Build Support (IL2CPP)
                                        </Button>
                                        <Button variant="secondary" className="w-full" size="lg"
                                                href={parseLinkmac(MAC_SERVER_BS, version)}>
                                            <Download className="w-5 h-5 mr-2"/>
                                            Mac Dedicated Server Build Support
                                        </Button>
                                        <Button variant="secondary" className="w-full" size="lg"
                                                href={parseLinkmac(WINDOWS_MONO_BS, version)}>
                                            <Download className="w-5 h-5 mr-2"/>
                                            Windows Build Support (Mono)
                                        </Button>
                                        <Button variant="secondary" className="w-full" size="lg"
                                                href={parseLinkmac(WINDOWS_SERVER_BS, version)}>
                                            <Download className="w-5 h-5 mr-2"/>
                                            Windows Dedicated Server Build Support
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </ul>
                        <ul>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-xl">Linux专区</CardTitle>
                                    <Badge>LINUX</Badge>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-600 mb-4">下载适用于LINUX平台下Unity {parseUnityHubUri(version)?.version}的组件</p>
                                    <div className="space-y-4">
                                        <Button variant="secondary" className="w-full" size="lg"
                                                href={parseLinklinux(ANDROID_BS, version)}>
                                            <Download className="w-5 h-5 mr-2"/>
                                            Android Build Support
                                        </Button>
                                        <Button variant="secondary" className="w-full" size="lg"
                                                href={parseLinklinux(IOS_BS, version)}>
                                            <Download className="w-5 h-5 mr-2"/>
                                            iOS Build Support
                                        </Button>
                                        <Button variant="secondary" className="w-full" size="lg"
                                                href={parseLinklinux(WEBGL_BS, version)}>
                                            <Download className="w-5 h-5 mr-2"/>
                                            WebGL Build Support
                                        </Button>
                                        <Button variant="secondary" className="w-full" size="lg"
                                                href={parseLinklinux(LINUX_IL2CPP_BS, version)}>
                                            <Download className="w-5 h-5 mr-2"/>
                                            Linux Build Support (IL2CPP)
                                        </Button>
                                        <Button variant="secondary" className="w-full" size="lg"
                                                href={parseLinklinux(LINUX_SERVER_BS, version)}>
                                            <Download className="w-5 h-5 mr-2"/>
                                            Linux Dedicated Server Build Support
                                        </Button>
                                        <Button variant="secondary" className="w-full" size="lg"
                                                href={parseLinklinux(MAC_IL2CPP_BS, version)}>
                                            <Download className="w-5 h-5 mr-2"/>
                                            Mac Build Support (IL2CPP)
                                        </Button>
                                        <Button variant="secondary" className="w-full" size="lg"
                                                href={parseLinklinux(MAC_SERVER_BS, version)}>
                                            <Download className="w-5 h-5 mr-2"/>
                                            Mac Dedicated Server Build Support
                                        </Button>
                                        <Button variant="secondary" className="w-full" size="lg"
                                                href={parseLinklinux(WINDOWS_MONO_BS, version)}>
                                            <Download className="w-5 h-5 mr-2"/>
                                            Windows Build Support (Mono)
                                        </Button>
                                        <Button variant="secondary" className="w-full" size="lg"
                                                href={parseLinklinux(WINDOWS_SERVER_BS, version)}>
                                            <Download className="w-5 h-5 mr-2"/>
                                            Windows Dedicated Server Build Support
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </ul>
                    </div>
                </div>
            </main>
            <SiteFooter/>
        </div>
    )
}
