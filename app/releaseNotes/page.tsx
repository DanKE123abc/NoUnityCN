import { micromark } from 'micromark';
import { headers } from 'next/headers';

interface UnityReleaseData {
    results: {
        releaseNotes: { type: string; url: string; };
    }[];
}

async function fetchReleaseNotes(version: string): Promise<UnityReleaseData> {
    const h = await headers();
    const host = h.get('host') || 'localhost:3000';
    const protocol = h.get('x-forwarded-proto') || 'http';
    const url = `${protocol}://${host}/api/releases?version=${encodeURIComponent(version)}`;
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error(`API 请求失败: ${res.status}`);
    return await res.json() as UnityReleaseData;
}

async function fetchMarkdownContent(url: string): Promise<string | null> {
    try {
        const res = await fetch(url, { headers: { 'User-Agent': 'Next.js' } });
        return res.ok ? await res.text() : null;
    } catch { return null; }
}

function parseUnityHubUri(uri: string) {
    const pattern = /^unityhub:\/\/([^\/]+)\/(.+)$/;
    const matches = uri.match(pattern);
    return matches ? { version: matches[1] } : null;
}

type Props = { searchParams: Promise<{ v?: string | string[] }>; };

export default async function ReleaseNotesPage({ searchParams }: Props) {
    const { v } = await searchParams;
    const versionParam = Array.isArray(v) ? v[0] : v;
    const parsed = versionParam ? parseUnityHubUri(versionParam) : null;

    let htmlContent: string | null = null;
    let fallbackUrl: string | undefined = undefined;

    if (parsed?.version) {
        try {
            const data = await fetchReleaseNotes(parsed.version);
            if (data.results?.length > 0) {
                const { type, url } = data.results[0].releaseNotes;
                fallbackUrl = url;
                if (type === 'MD') {
                    const mdText = await fetchMarkdownContent(url);
                    if (mdText) htmlContent = micromark(mdText);
                }
            }
        } catch (e) { console.error(e); }
    }

    // 成功渲染 Markdown
    if (htmlContent) {
        return (
            <div className="flex items-center justify-center px-4 py-10">
                <div className="w-full max-w-5xl bg-white shadow-xl rounded-3xl p-8 md:p-16 space-y-8">
                    <div className="text-center space-y-4">
                        <h1 className="text-3xl md:text-5xl font-black text-gray-900 leading-tight">
                            {parsed?.version ? `Release Notes - ${parsed.version}` : 'Release Notes'}
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

    // 无法渲染但有原始链接 (fallback)
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

    // 400 Bad Request
    return (
        <div className="flex flex-col items-center justify-center text-center p-10 h-[60vh]">
            <span className="text-8xl mb-6">🏜️</span>
            <h1 className="text-4xl font-black text-gray-900 mb-2">400 Bad Request</h1>
            <p className="text-gray-500">无法识别该 Unity 版本或 URI 格式有误。</p>
        </div>
    );
}