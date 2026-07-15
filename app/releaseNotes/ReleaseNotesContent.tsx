'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { micromark } from 'micromark';
import { fetchUnityReleases } from '@/lib/unity-api';

function parseUnityHubUri(uri: string) {
    const pattern = /^unityhub:\/\/([^\/]+)\/(.+)$/;
    const matches = uri.match(pattern);
    return matches ? { version: matches[1] } : null;
}

export default function ReleaseNotesContent() {
    const searchParams = useSearchParams();
    const v = searchParams.get('v');

    const [htmlContent, setHtmlContent] = useState<string | null>(null);
    const [fallbackUrl, setFallbackUrl] = useState<string | undefined>(undefined);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const parsed = v ? parseUnityHubUri(v) : null;

        if (!parsed?.version) {
            setLoading(false);
            return;
        }

        const fetchReleaseNotes = async () => {
            try {
                const data = await fetchUnityReleases({ version: parsed.version });

                if (data.results?.length > 0) {
                    const { type, url } = data.results[0].releaseNotes;
                    setFallbackUrl(url);

                    if (type === 'MD') {
                        const mdRes = await fetch(url, {
                            headers: { 'User-Agent': 'Next.js' },
                        });

                        if (mdRes.ok) {
                            const mdText = await mdRes.text();
                            setHtmlContent(micromark(mdText));
                        }
                    }
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };

        fetchReleaseNotes();
    }, [v]);

    if (loading) {
        return (
            <div className="flex items-center justify-center p-12">
                <div className="text-gray-500">加载中...</div>
            </div>
        );
    }

    const parsed = v ? parseUnityHubUri(v) : null;

    if (htmlContent) {
        return (
            <div className="flex items-center justify-center px-4 py-10">
                <div className="w-full max-w-5xl bg-white shadow-xl rounded-3xl p-8 md:p-16 space-y-8">
                    <div className="text-center space-y-4">
                        <h1 className="text-3xl md:text-5xl font-black text-gray-900 leading-tight">
                            Release Notes - {parsed?.version || ''}
                        </h1>
                        <div className="w-24 h-1.5 bg-indigo-600 mx-auto rounded-full" />
                    </div>
                    <div
                        className="prose prose-slate prose-lg max-w-none prose-headings:font-bold prose-a:text-indigo-600"
                        dangerouslySetInnerHTML={{ __html: htmlContent }}
                    />
                    <div className="pt-8 border-t border-gray-100 text-center text-sm text-gray-400">
                        来源: <a href={fallbackUrl} target="_blank" className="text-indigo-500 hover:underline">Unity API</a>
                    </div>
                </div>
            </div>
        );
    }

    if (fallbackUrl) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center h-[60vh]">
                <div className="bg-white p-10 rounded-3xl shadow-lg border border-gray-100">
                    <h1 className="text-2xl font-bold mb-4">暂不支持在线预览</h1>
                    <p className="text-gray-500 mb-6">该版本说明无法直接显示，请前往原始页面查看。</p>
                    <a href={fallbackUrl} target="_blank" className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition">
                        打开原始文件
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center text-center p-10 h-[60vh]">
            <span className="text-8xl mb-6">🏜️</span>
            <h1 className="text-4xl font-black text-gray-900 mb-2">400 Bad Request</h1>
            <p className="text-gray-500">无法识别该 Unity 版本或 URI 格式有误。</p>
        </div>
    );
}
