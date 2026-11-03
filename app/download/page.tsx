"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Download, Home, Package, Share } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { useI18n } from "@/lib/i18n";

function parseUnityHubUri(uri: string): { version: string; fileId: string } | null {
    const pattern = /^unityhub:\/\/([^\/]+)\/(.+)$/;
    const matches = uri.match(pattern);

    if (!matches || matches.length < 3) {
        return null;
    }

    return {
        version: matches[1],
        fileId: matches[2]
    };
}

function compareVersions(version: string, targetVersion: string): number {
    const mainPattern = /^(\d+)(?:\.(\d+))?(?:\.(\d+))?/;
    const v1Match = version.match(mainPattern);
    const v2Match = targetVersion.match(mainPattern);

    if (!v1Match || !v2Match) return 0;

    const v1 = [
        parseInt(v1Match[1] || "0"),
        parseInt(v1Match[2] || "0"),
        parseInt(v1Match[3] || "0")
    ];
    const v2 = [
        parseInt(v2Match[1] || "0"),
        parseInt(v2Match[2] || "0"),
        parseInt(v2Match[3] || "0")
    ];

    if (v1[0] !== v2[0]) return v1[0] - v2[0];
    if (v1[1] !== v2[1]) return v1[1] - v2[1];
    return v1[2] - v2[2];
}

function parseLinkwin(key: string) {
    return `https://download.unity3d.com/download_unity/${parseUnityHubUri(key)?.fileId}/Windows64EditorInstaller/UnitySetup64-${parseUnityHubUri(key)?.version}.exe`;
}

function parseLinkwin32(key: string) {
    return `https://download.unity3d.com/download_unity/${parseUnityHubUri(key)?.fileId}/Windows32EditorInstaller/UnitySetup32-${parseUnityHubUri(key)?.version}.exe`;
}

function parseLinkwinarm(key: string) {
    return `https://download.unity3d.com/download_unity/${parseUnityHubUri(key)?.fileId}/WindowsArm64EditorInstaller/UnitySetupArm64-${parseUnityHubUri(key)?.version}.exe`;
}

function parseLinkmac(key: string) {
    return `https://download.unity3d.com/download_unity/${parseUnityHubUri(key)?.fileId}/MacEditorInstaller/Unity-${parseUnityHubUri(key)?.version}.pkg`;
}

function parseLinkmacarm(key: string) {
    return `https://download.unity3d.com/download_unity/${parseUnityHubUri(key)?.fileId}/MacEditorInstallerArm64/Unity-${parseUnityHubUri(key)?.version}.pkg`;
}

function parseLinklinux(key: string) {
    return `https://download.unity3d.com/download_unity/${parseUnityHubUri(key)?.fileId}/LinuxEditortInstaller/Unity-${parseUnityHubUri(key)?.version}.tar.xz`;
}

function DownloadContent() {
    const { t } = useI18n();
    const searchParams = useSearchParams();
    const version = searchParams?.get('v') || undefined;

    const parsedVersion = version ? parseUnityHubUri(version as string) : null;
    const supportsWin64 = true;
    const supportsWin32 = parsedVersion ?
        (parsedVersion.version.startsWith("5.") || compareVersions(parsedVersion.version, "6.0.0") < 0) : false;
    const supportsWinArm64 = parsedVersion ?
        compareVersions(parsedVersion.version, "6.0.0") >= 0 : false;
    const supportsMacIntel = true;
    const supportsMacArm = parsedVersion ?
        (compareVersions(parsedVersion.version, "2021.2.0") >= 0) : false;
    const supportsLinux = parsedVersion ?
        (compareVersions(parsedVersion.version, "2017.4.6") >= 0) : false;

    return (
        <div className="min-h-screen flex flex-col">
            <main className="flex-1">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-8 flex items-center gap-2">
                        <a href="/" className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                            <Home className="w-6 h-6 text-gray-500 hover:text-gray-700 transition-colors" />
                        </a>
                        <div className="flex items-baseline gap-2">
                            {t('download.preparing')}
                            <span className="text-lg text-gray-500">{version}</span>
                        </div>
                    </h1>
                    <div className="prose prose-blue max-w-none">
                        <CardContent>
                            <div className="space-y-4">
                                <Button variant="secondary" className="w-full" size="lg" href={`./releaseNotes?v=${version}`}>
                                    <div className="flex items-center justify-between w-full">
                                        <div className="flex items-center">
                                            <Share className="w-5 h-5 mr-2" />
                                            {t('download.releaseNotes')}
                                        </div>
                                    </div>
                                </Button>
                                <Button variant="secondary" className="w-full" size="lg" href={`./component?v=${version}`}>
                                    <div className="flex items-center justify-between w-full">
                                        <div className="flex items-center">
                                            <Package className="w-5 h-5 mr-2" />
                                            {t('download.addComponent')}
                                        </div>
                                    </div>
                                </Button>
                                <hr />
                                <Button className="w-full" size="lg" href={`${version}`}>
                                    <div className="flex items-center justify-between w-full">
                                        <div className="flex items-center">
                                            <Download className="w-5 h-5 mr-2" />
                                            {t('download.useHub')}
                                        </div>
                                        <span className="text-xs text-gray-500">{t('download.recommended')}</span>
                                    </div>
                                </Button>

                                {supportsWin64 && (
                                    <Button variant="secondary" className="w-full" size="lg"
                                        href={`${parseLinkwin(version as string)}`}>
                                        <div className="flex items-center justify-between w-full">
                                            <div className="flex items-center">
                                                <Download className="w-5 h-5 mr-2" />
                                                {t('download.win64')}
                                            </div>
                                            <span className="text-xs text-gray-500">{t('download.win64.note')}</span>
                                        </div>
                                    </Button>
                                )}

                                {supportsWin32 && (
                                    <Button variant="secondary" className="w-full" size="lg"
                                        href={`${parseLinkwin32(version as string)}`}>
                                        <div className="flex items-center justify-between w-full">
                                            <div className="flex items-center">
                                                <Download className="w-5 h-5 mr-2" />
                                                {t('download.win32')}
                                            </div>
                                            <span className="text-xs text-gray-500">{t('download.win32.note')}</span>
                                        </div>
                                    </Button>
                                )}

                                {supportsWinArm64 && (
                                    <Button variant="secondary" className="w-full" size="lg"
                                        href={`${parseLinkwinarm(version as string)}`}>
                                        <div className="flex items-center justify-between w-full">
                                            <div className="flex items-center">
                                                <Download className="w-5 h-5 mr-2" />
                                                {t('download.winArm')}
                                            </div>
                                            <span className="text-xs text-gray-500">{t('download.winArm.note')}</span>
                                        </div>
                                    </Button>
                                )}

                                {supportsMacIntel && (
                                    <Button variant="secondary" className="w-full" size="lg"
                                        href={`${parseLinkmac(version as string)}`}>
                                        <div className="flex items-center justify-between w-full">
                                            <div className="flex items-center">
                                                <Download className="w-5 h-5 mr-2" />
                                                {t('download.macIntel')}
                                            </div>
                                            <span className="text-xs text-gray-500">{t('download.macIntel.note')}</span>
                                        </div>
                                    </Button>
                                )}

                                {supportsMacArm && (
                                    <Button variant="secondary" className="w-full" size="lg"
                                        href={`${parseLinkmacarm(version as string)}`}>
                                        <div className="flex items-center justify-between w-full">
                                            <div className="flex items-center">
                                                <Download className="w-5 h-5 mr-2" />
                                                {t('download.macArm')}
                                            </div>
                                            <span className="text-xs text-gray-500">{t('download.macArm.note')}</span>
                                        </div>
                                    </Button>
                                )}

                                {supportsLinux && (
                                    <Button variant="secondary" className="w-full" size="lg"
                                        href={`${parseLinklinux(version as string)}`}>
                                        <div className="flex items-center justify-between w-full">
                                            <div className="flex items-center">
                                                <Download className="w-5 h-5 mr-2" />
                                                {t('download.linux')}
                                            </div>
                                            <span className="text-xs text-gray-500">{t('download.linux.note')}</span>
                                        </div>
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default function DownloadPage() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center p-12"><div className="text-gray-500">Loading...</div></div>}>
            <DownloadContent />
        </Suspense>
    );
}