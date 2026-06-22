// unityModule/page.tsx
// 感谢 @HotYearKit 提供 C# 版本代码，没有他的贡献就没有这个模块的诞生。
// 感谢 Larusso/unity-version-manager 开源项目

'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
// --- 枚举类型定义 ---

enum UnityReleaseDownloadArchitecture {
    X86_64 = 'X86_64',
    ARM64 = 'ARM64'
}

enum UnityReleaseDownloadPlatform {
    MACOS = 'MAC_OS',
    LINUX = 'LINUX',
    WINDOWS = 'WINDOWS'
}

enum UnityReleaseStream {
    LTS = 'LTS',
    BETA = 'BETA',
    ALPHA = 'ALPHA',
    TECH = 'TECH'
}

enum UnityReleaseEntitlement {
    XLTS = 'XLTS',
    U7ALPHA = 'U7ALPHA'
}

interface EulaEntry {
    url?: string;
    label?: string;
    message?: string;
    [k: string]: unknown;
}

interface ExtractedPathRename {
    to?: string;
    from?: string;
    [k: string]: unknown;
}

interface ModuleOnline {
    url?: string;
    integrity?: string;
    type?: string;
    id?: string;
    name?: string;
    slug?: string;
    description?: string;
    category?: string;
    downloadSize: { value: number };
    installedSize: { value: number };
    required: boolean;
    hidden: boolean;
    extractedPathRename?: ExtractedPathRename;
    preSelected: boolean;
    destination?: string;
    eula?: EulaEntry[];
    subModules?: ModuleOnline[];
    [k: string]: unknown;
}

interface Module {
    url: string;
    integrity: string;
    type: string;
    id: string;
    name: string;
    slug: string;
    description: string;
    category: string;
    downloadSize: number;
    installedSize: number;
    required: boolean;
    hidden: boolean;
    extractedPathRename: ExtractedPathRename | null;
    preSelected: boolean;
    destination: string | null;
    eula: EulaEntry[] | null;
    subModules: Module[];

    // Additional properties added in the C# constructor logic
    downloadUrl: string;
    visible: boolean;
    selected: boolean; // is_installed
    sync: string;
    parent: string;
    eulaUrl1: string;
    eulaLabel1: string;
    eulaMessage: string;
    renameTo: string;
    renameFrom: string;
    preselected: boolean;
}

// --- URI 解析函数 ---
function parseUnityHubUri(uri: string) {
    const pattern = /^unityhub:\/\/([^\/]+)\/(.+)$/;
    const matches = uri.match(pattern);
    if (!matches || matches.length < 3) return null;
    return { version: matches[1] };
}

// --- 处理函数 ---
const fetch_modules_from_release = (
    modules: Module[],
    moduleOnline: ModuleOnline,
    parent_id: string = ''
): void => {
    const newModule: Module = {
        url: moduleOnline.url || '',
        integrity: moduleOnline.integrity || '',
        type: moduleOnline.type || '',
        id: moduleOnline.id || '',
        name: moduleOnline.name || '',
        slug: moduleOnline.slug || '',
        description: moduleOnline.description || '',
        category: moduleOnline.category || '',
        downloadSize: moduleOnline.downloadSize?.value || 0,
        installedSize: moduleOnline.installedSize?.value || 0,
        required: moduleOnline.required || false,
        hidden: moduleOnline.hidden || false,
        extractedPathRename:
            (moduleOnline.extractedPathRename &&
                Object.keys(moduleOnline.extractedPathRename).length > 0)
                ? { ...moduleOnline.extractedPathRename }
                : null,
        preSelected: moduleOnline.preSelected || false,
        destination: moduleOnline.destination || null,
        eula:
            (moduleOnline.eula && moduleOnline.eula.length > 0)
                ? [...moduleOnline.eula]
                : null,
        subModules: [],

        // Properties added by C# logic
        downloadUrl: moduleOnline.url || '',
        visible: !(moduleOnline.hidden || false),
        selected: moduleOnline.id === 'android',
        sync: parent_id === 'android-sdk-ndk-tools' ? parent_id : '',
        parent: parent_id,
        eulaUrl1: moduleOnline.eula?.[0]?.url || '',
        eulaLabel1: moduleOnline.eula?.[0]?.label || '',
        eulaMessage: moduleOnline.eula?.[0]?.message || '',
        renameTo: moduleOnline.extractedPathRename?.to || '',
        renameFrom: moduleOnline.extractedPathRename?.from || '',
        preselected: moduleOnline.preSelected || false,
    };

    modules.push(newModule);

    const subModules = moduleOnline.subModules;
    if (subModules && subModules.length > 0) {
        const currentId = moduleOnline.id || '';
        for (const item of subModules) {
            fetch_modules_from_release(modules, item, currentId);
        }
    }
};

// --- React 组件 ---
const UnityModuleFetcherInner: React.FC = () => {
    // --- 使用钩子获取 URL 参数和路由控制 ---
    const searchParams = useSearchParams(); // 获取查询参数对象
    const router = useRouter();             // 用于更新浏览器 URL
    const pathname = usePathname();         // 当前页面路径（不含查询参数）

    const [inputUri, setInputUri] = useState<string>('');
    const [parsedVersion, setParsedVersion] = useState<string | null>(null);

    // --- 用户选择的状态 ---
    const [selectedPlatform, setSelectedPlatform] = useState<UnityReleaseDownloadPlatform>(UnityReleaseDownloadPlatform.WINDOWS);
    const [selectedArchitecture, setSelectedArchitecture] = useState<UnityReleaseDownloadArchitecture>(UnityReleaseDownloadArchitecture.X86_64);
    const [selectedStream, setSelectedStream] = useState<UnityReleaseStream | ''>(''); // 允许空字符串表示不指定
    const [selectedEntitlements, setSelectedEntitlements] = useState<UnityReleaseEntitlement[]>([]); // 允许空数组

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [modules, setModules] = useState<Module[] | null>(null);

    // --- 在组件挂载时处理 URL 查询参数 ---
    useEffect(() => {
        // 从 URL 中获取 'v' 参数
        const uriFromParam = searchParams.get('v');
        const platformFromParam = searchParams.get('platform') as UnityReleaseDownloadPlatform | null;
        const archFromParam = searchParams.get('arch') as UnityReleaseDownloadArchitecture | null;
        const streamFromParam = searchParams.get('stream') as UnityReleaseStream | null;
        const entitlementsFromParam = searchParams.get('entitlements');

        if (uriFromParam) {
            setInputUri(uriFromParam);
            const result = parseUnityHubUri(uriFromParam);
            if (result) {
                setParsedVersion(result.version);
                setError(null);
            } else {
                setParsedVersion(null);
                setError('无法解析 URI，请检查格式是否正确！');
            }
        }

        // 设置平台
        if (platformFromParam && Object.values(UnityReleaseDownloadPlatform).includes(platformFromParam)) {
            setSelectedPlatform(platformFromParam);
        }

        // 设置架构
        if (archFromParam && Object.values(UnityReleaseDownloadArchitecture).includes(archFromParam)) {
            setSelectedArchitecture(archFromParam);
        }

        // 设置 Stream
        if (!streamFromParam) {
            setSelectedStream('');
        } else if (Object.values(UnityReleaseStream).includes(streamFromParam as UnityReleaseStream)) {
            setSelectedStream(streamFromParam);
        }

        // 设置 Entitlements
        if (entitlementsFromParam) {
            const ents = entitlementsFromParam.split(',').map(e => e.trim() as UnityReleaseEntitlement)
                .filter(e => Object.values(UnityReleaseEntitlement).includes(e));
            setSelectedEntitlements(ents);
        }

    }, [searchParams]); // 依赖项为 searchParams，在初始加载时运行一次

    // --- 处理函数 ---
    const handleParseUri = useCallback(() => {
        const result = parseUnityHubUri(inputUri);
        if (result) {
            setParsedVersion(result.version);
            setError(null);
            // --- URL 参数获取 ---
            const newParams = new URLSearchParams(searchParams.toString());
            newParams.set('v', inputUri);
            newParams.set('platform', selectedPlatform);
            newParams.set('arch', selectedArchitecture);
            if(selectedStream) {
                newParams.set('stream', selectedStream);
            } else {
                newParams.delete('stream');
            }
            if(selectedEntitlements.length > 0) {
                newParams.set('entitlements', selectedEntitlements.join(','));
            } else {
                newParams.delete('entitlements');
            }
            router.push(`${pathname}?${newParams.toString()}`, { scroll: false });
        } else {
            setParsedVersion(null);
            setError('无法解析 URI，请检查格式是否正确');
            // 清除 URL 中的 'v' 参数
            const newParams = new URLSearchParams(searchParams.toString());
            newParams.delete('v');
            router.push(`${pathname}?${newParams.toString()}`, { scroll: false });
        }
    }, [inputUri, router, pathname, searchParams, selectedPlatform, selectedArchitecture, selectedStream, selectedEntitlements]); // 添加了所有相关状态作为依赖


    const handleFetchModules = useCallback(async () => {
        if (!parsedVersion) {
            setError('请先解析一个有效的 URI 以获取版本号。');
            return;
        }

        setLoading(true);
        setError(null);
        setModules(null);

        const params = new URLSearchParams({ version: parsedVersion });
        if (selectedPlatform) params.set('platform', selectedPlatform);
        if (selectedArchitecture) params.set('architecture', selectedArchitecture);
        if (selectedStream) params.set('stream', selectedStream);
        if (selectedEntitlements.length > 0) {
            selectedEntitlements.forEach(e => params.append('entitlement', e));
        }

        try {
            const response = await fetch(`/api/releases?${params.toString()}`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            const release = data.results?.[0];
            if (!release) {
                throw new Error('未找到该版本的发布信息。');
            }

            const download = release.downloads?.find(
                (d: any) => d.platform === selectedPlatform && d.architecture === selectedArchitecture
            ) || release.downloads?.[0];

            const modulesOnline = download?.modules;

            if (!modulesOnline || modulesOnline.length === 0) {
                throw new Error('返回的数据结构异常，未找到模块列表。');
            }

            const processedModules: Module[] = [];
            for (const module of modulesOnline) {
                fetch_modules_from_release(processedModules, module);
            }

            setModules(processedModules);
        } catch (err: any) {
            console.error("Fetching or processing failed:", err);
            setError(err.message || '获取或处理模块时发生未知错误。');
        } finally {
            setLoading(false);
        }
    }, [parsedVersion, selectedArchitecture, selectedPlatform, selectedStream, selectedEntitlements]);

    const handleDownloadJson = useCallback(() => {
        if (!modules) return;
        const dataStr = JSON.stringify(modules, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'modules.json';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }, [modules]);

    // --- 处理下拉菜单变化 ---
    const handlePlatformChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedPlatform(e.target.value as UnityReleaseDownloadPlatform);
    };

    const handleArchitectureChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedArchitecture(e.target.value as UnityReleaseDownloadArchitecture);
    };

    const handleStreamChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value as UnityReleaseStream | '';
        setSelectedStream(value);
    };

    const handleEntitlementChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value as UnityReleaseEntitlement;
        const isChecked = e.target.checked;
        setSelectedEntitlements(prev =>
            isChecked
                ? [...prev, value]
                : prev.filter(ent => ent !== value)
        );
    };


    return (
        <>
            <br/>
            <div className="max-w-3xl mx-auto my-8 p-8 bg-white rounded-2xl shadow-xl border border-gray-100 space-y-8">
                {/* 头部标题 */}
                <div className="border-b border-gray-100 pb-4">
                    <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                        UnityHub <span className="text-blue-600">modules.json</span> 生成器
                    </h2>
                    <p className="mt-2 text-sm text-gray-500">解析 UnityHub URI 并快速构建自动化安装配置文件</p>
                </div>

                {/* URI 解析输入 */}
                <div className="bg-gray-50 p-5 rounded-xl space-y-4">
                    <div className="flex items-center space-x-2 mb-2">
                        <label htmlFor="uriInput" className="text-sm font-semibold text-gray-700">UnityHub URI</label>
                    </div>
                    <div className="flex flex-col md:flex-row gap-3">
                        <input
                            type="text"
                            id="uriInput"
                            value={inputUri}
                            onChange={(e) => setInputUri(e.target.value)}
                            placeholder="unityhub://6000.0.63f1/9438f9b77a46"
                            className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-gray-400"
                        />
                        <button
                            onClick={handleParseUri}
                            disabled={!inputUri}
                            className={`px-6 py-3 rounded-lg font-bold text-white shadow-sm transition-all active:scale-95 ${
                                inputUri ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-300 cursor-not-allowed'
                            }`}
                        >
                            解析版本
                        </button>
                    </div>
                </div>

                {/* 配置参数 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* 平台选择 */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">平台 (Platform)</label>
                        <select
                            value={selectedPlatform}
                            onChange={handlePlatformChange}
                            className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
                        >
                            {Object.values(UnityReleaseDownloadPlatform).map((p) => (
                                <option key={p} value={p}>{p}</option>
                            ))}
                        </select>
                    </div>

                    {/* 架构选择 */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">架构 (Architecture)</label>
                        <select
                            value={selectedArchitecture}
                            onChange={handleArchitectureChange}
                            className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
                        >
                            {Object.values(UnityReleaseDownloadArchitecture).map((a) => (
                                <option key={a} value={a}>{a}</option>
                            ))}
                        </select>
                    </div>

                    {/* 流选择 */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">流 (Stream)</label>
                        <select
                            value={selectedStream}
                            onChange={handleStreamChange}
                            className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
                        >
                            <option value="">(不指定)</option>
                            {Object.values(UnityReleaseStream).map((s) => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* 授权复选框 */}
                <div className="pt-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-3">授权 (Entitlements)</label>
                    <div className="flex flex-wrap gap-2">
                        {Object.values(UnityReleaseEntitlement).map((ent) => (
                            <label
                                key={ent}
                                className={`flex items-center px-4 py-2 rounded-full border transition-all cursor-pointer ${
                                    selectedEntitlements.includes(ent)
                                        ? 'bg-blue-50 border-blue-200 text-blue-700 shadow-sm'
                                        : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                                }`}
                            >
                                <input
                                    type="checkbox"
                                    value={ent}
                                    checked={selectedEntitlements.includes(ent)}
                                    onChange={handleEntitlementChange}
                                    className="hidden" // 隐藏原生 checkbox，使用父容器样式
                                />
                                <span className="text-sm font-medium">{ent}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* 错误显示 */}
                {error && (
                    <div className="flex items-center p-4 bg-red-50 text-red-700 rounded-xl border border-red-100 animate-pulse">
                        <span className="mr-2">⚠️</span>
                        <p className="text-sm font-medium">{error}</p>
                    </div>
                )}

                {/* 执行获取按钮 */}
                {parsedVersion && (
                    <div className="flex items-center justify-between p-4 bg-blue-600 rounded-xl text-white shadow-lg shadow-blue-200">
                        <div>
                            <p className="text-xs opacity-80">当前解析版本</p>
                            <p className="font-mono font-bold text-lg">{parsedVersion}</p>
                        </div>
                        <button
                            onClick={handleFetchModules}
                            disabled={loading}
                            className="px-8 py-3 bg-white text-blue-600 rounded-lg font-bold hover:bg-blue-50 transition-colors disabled:opacity-50"
                        >
                            {loading ? '获取中...' : '获取模块列表'}
                        </button>
                    </div>
                )}

                {/* 结果展示 */}
                {modules && (
                    <div className="mt-8 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold text-gray-800 flex items-center">
                                <span className="mr-2 text-green-500">✓</span>
                                成功获取 {modules.length} 个模块
                            </h3>
                            <button
                                onClick={handleDownloadJson}
                                className="flex items-center px-4 py-2 bg-purple-100 text-purple-700 rounded-lg text-sm font-bold hover:bg-purple-200 transition"
                            >
                                下载 JSON
                            </button>
                        </div>

                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-purple-400 to-blue-400 rounded-xl blur opacity-20 group-hover:opacity-30 transition"></div>
                            <pre className="relative bg-gray-900 text-gray-300 p-5 rounded-xl text-xs font-mono overflow-x-auto max-h-80 leading-relaxed shadow-inner">
                                {JSON.stringify(modules, null, 2)}
                            </pre>
                        </div>
                    </div>
                )}
            </div>
            <br/>
        </>
    );
};

// --- Suspense 包装组件 ---
const UnityModuleFetcherWithSuspense: React.FC = () => {
    return (
        <React.Suspense fallback={<div>Loading...</div>}>
            <UnityModuleFetcherInner />
        </React.Suspense>
    );
};

export default UnityModuleFetcherWithSuspense;
