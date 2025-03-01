import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import {Download, Home} from "lucide-react";
import {Button} from "@/components/ui/button";
import {CardContent} from "@/components/ui/card";

export const dynamic = 'force-dynamic'; 

export default function DownloadPage({
                                     searchParams,
                                 }: {
    searchParams?: { [key: string]: string | string[] | undefined };
}) {
    const version = searchParams?.v;

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

    function parseLinkwin(key:string) {
        let downloadLink = `https://download.unity3d.com/download_unity/${parseUnityHubUri(key)?.fileId}/Windows64EditorInstaller/UnitySetup64-${parseUnityHubUri(key)?.version}.exe`;
        //downloadLink = downloadLink.replace('unity3d.com', 'unitychina.cn')
        return downloadLink;
    }

    function parseLinkmac(key:string) {
        let downloadLink = `https://download.unity3d.com/download_unity/${parseUnityHubUri(key)?.fileId}/MacEditorInstaller/Unity-${parseUnityHubUri(key)?.version}.pkg`;
        //downloadLink = downloadLink.replace('unity3d.com', 'unitychina.cn')
        return downloadLink;
    }

    function parseLinkmacarm(key:string) {
        let downloadLink = `https://download.unity3d.com/download_unity/${parseUnityHubUri(key)?.fileId}/MacEditorInstallerArm64/Unity-${parseUnityHubUri(key)?.version}.pkg`;
        //downloadLink = downloadLink.replace('unity3d.com', 'unitychina.cn')
        return downloadLink;
    }

    function parseLinklinux(key:string) {
        let downloadLink = `https://download.unity3d.com/download_unity/${parseUnityHubUri(key)?.fileId}/LinuxEditorInstaller/Unity-${parseUnityHubUri(key)?.version}.tar.xz`;
        //downloadLink = downloadLink.replace('unity3d.com', 'unitychina.cn')
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
                            准备下载：
                            <span className="text-lg text-gray-500">{version}</span>
                        </div>
                    </h1>
                    <div className="prose prose-blue max-w-none">
                        <CardContent>
                            <div className="space-y-4">
                                <Button className="w-full" size="lg" href={`${version}`}>
                                    <Download className="w-5 h-5 mr-2"/>
                                    使用Unity Hub下载
                                </Button>
                                <Button variant="secondary" className="w-full" size="lg"
                                        href={`${parseLinkwin(version)}`}>
                                    <Download className="w-5 h-5 mr-2"/>
                                    Windows(x86-64)下载
                                </Button>
                                <Button variant="secondary" className="w-full" size="lg"
                                        href={`${parseLinkmac(version)}`}>
                                    <Download className="w-5 h-5 mr-2"/>
                                    MacOS(x86-64)下载
                                </Button>
                                <Button variant="secondary" className="w-full" size="lg"
                                        href={`${parseLinkmacarm(version)}`}>
                                    <Download className="w-5 h-5 mr-2"/>
                                    MacOS(ARM64)下载
                                </Button>
                                <Button variant="secondary" className="w-full" size="lg"
                                        href={`${parseLinklinux(version)}`}>
                                    <Download className="w-5 h-5 mr-2"/>
                                    Linux(x86-64)下载
                                </Button>
                            </div>
                        </CardContent>
                    </div>
                </div>
            </main>
            <SiteFooter/>
        </div>
    )
}
