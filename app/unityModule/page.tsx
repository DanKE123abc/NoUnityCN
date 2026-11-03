// unityModule/page.tsx
// 感谢 @HotYearKit 提供 C# 版本代码，没有他的贡献就没有这个模块的诞生。
// 感谢 Larusso/unity-version-manager 开源项目

'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { fetchUnityReleases } from '@/lib/unity-api';
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

const translations = {
    zh: {
        language: '语言 / Language',
        title: '生成器',
        subtitle: '解析 UnityHub URI 并快速构建自动化安装配置文件',
        parseVersion: '解析版本',
        platform: '平台 (Platform)',
        architecture: '架构 (Architecture)',
        stream: '流 (Stream)',
        unspecified: '(不指定)',
        entitlements: '授权 (Entitlements)',
        currentVersion: '当前解析版本',
        fetching: '获取中...',
        fetchModules: '获取模块列表',
        modulesFound: (count: number) => `成功获取 ${count} 个模块`,
        download: '下载 JSON',
        installedNote: '所有模块默认标记为未安装。获取列表后，你可以勾选本机已安装的模块。',
        stepOne: '第 1 步：输入 Unity Hub 链接',
        uriHelp: '粘贴以 unityhub:// 开头的编辑器安装链接，然后解析版本。',
        stepTwo: '第 2 步：选择你的设备',
        deviceHelp: '选择要安装 Unity Editor 的操作系统和处理器架构。大多数 Windows 和 Linux 电脑使用 X86_64；Apple 芯片 Mac 使用 ARM64。',
        advanced: '高级设置',
        advancedHelp: '仅在需要特定发布渠道或授权版本时修改。',
        stepThree: '第 3 步：获取模块并标记已安装项',
        installedHeading: '本机已安装的模块',
        installedHelp: '只勾选这台设备上已经安装的模块。未勾选的模块会在 JSON 中保持 selected: false，供 Unity Hub 选择安装。',
        installedCount: (count: number) => `已标记 ${count} 个已安装模块`,
        clearInstalled: '清除已安装标记',
        searchModules: '搜索模块名称或 ID',
        noMatchingModules: '没有匹配的模块。',
        jsonPreview: '预览 JSON（高级）',
        invalidUri: '无法解析 URI，请检查格式是否正确。',
        parseFirst: '请先解析一个有效的 URI 以获取版本号。',
        noRelease: '未找到该版本的发布信息。',
        noModules: '返回的数据结构异常，未找到模块列表。',
        unknownError: '获取或处理模块时发生未知错误。',
        loading: '加载中...',
    },
    en: {
        language: 'Language / 语言',
        title: 'Generator',
        subtitle: 'Parse a Unity Hub URI and create a modules.json file for installation.',
        parseVersion: 'Parse version',
        platform: 'Platform',
        architecture: 'Architecture',
        stream: 'Stream',
        unspecified: '(Any)',
        entitlements: 'Entitlements',
        currentVersion: 'Parsed version',
        fetching: 'Fetching...',
        fetchModules: 'Fetch modules',
        modulesFound: (count: number) => `Found ${count} modules`,
        download: 'Download JSON',
        installedNote: 'Every module starts as not installed. After fetching the list, you can mark modules already installed on your computer.',
        stepOne: 'Step 1: Enter a Unity Hub link',
        uriHelp: 'Paste an Editor installation link beginning with unityhub://, then parse its version.',
        stepTwo: 'Step 2: Choose your device',
        deviceHelp: 'Choose the operating system and processor architecture for the computer where you will install Unity Editor. Most Windows and Linux PCs use X86_64; Apple silicon Macs use ARM64.',
        advanced: 'Advanced settings',
        advancedHelp: 'Change these only if you need a specific release stream or entitlement.',
        stepThree: 'Step 3: Fetch modules and mark installed ones',
        installedHeading: 'Modules already installed on this computer',
        installedHelp: 'Check only modules already installed on this computer. Unchecked modules keep selected: false in the JSON so Unity Hub can offer to install them.',
        installedCount: (count: number) => `${count} installed modules marked`,
        clearInstalled: 'Clear installed marks',
        searchModules: 'Search module name or ID',
        noMatchingModules: 'No matching modules.',
        jsonPreview: 'Preview JSON (advanced)',
        invalidUri: 'Could not parse the URI. Check its format.',
        parseFirst: 'Parse a valid URI to get a version first.',
        noRelease: 'No release information was found for this version.',
        noModules: 'The response did not contain a module list.',
        unknownError: 'An unknown error occurred while fetching or processing modules.',
        loading: 'Loading...',
    },
} as const;

type ErrorKey = 'invalidUri' | 'parseFirst' | 'noRelease' | 'noModules' | 'unknownError';

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
        selected: false,
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
    const language = searchParams.get('lang') === 'en' ? 'en' : 'zh';
    const t = translations[language];

    const handleLanguageChange = (nextLanguage: 'zh' | 'en') => {
        const newParams = new URLSearchParams(searchParams.toString());
        if (nextLanguage === 'en') newParams.set('lang', 'en');
        else newParams.delete('lang');
        router.replace(`${pathname}${newParams.size ? `?${newParams}` : ''}`, { scroll: false });
    };

    const [inputUri, setInputUri] = useState<string>('');
    const [parsedVersion, setParsedVersion] = useState<string | null>(null);

    // --- 用户选择的状态 ---
    const [selectedPlatform, setSelectedPlatform] = useState<UnityReleaseDownloadPlatform>(UnityReleaseDownloadPlatform.WINDOWS);
    const [selectedArchitecture, setSelectedArchitecture] = useState<UnityReleaseDownloadArchitecture>(UnityReleaseDownloadArchitecture.X86_64);
    const [selectedStream, setSelectedStream] = useState<UnityReleaseStream | ''>(''); // 允许空字符串表示不指定
    const [selectedEntitlements, setSelectedEntitlements] = useState<UnityReleaseEntitlement[]>([]); // 允许空数组

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<ErrorKey | null>(null);
    const [errorDetail, setErrorDetail] = useState<string | null>(null);
    const [modules, setModules] = useState<Module[] | null>(null);
    const [moduleSearch, setModuleSearch] = useState('');
    const installedCount = modules?.filter(module => module.selected).length ?? 0;
    const filteredModules = modules?.map((module, index) => ({ module, index })).filter(({ module }) =>
        `${module.name} ${module.id} ${module.parent}`.toLowerCase().includes(moduleSearch.trim().toLowerCase())
    ) ?? [];

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
                setErrorDetail(null);
            } else {
                setParsedVersion(null);
                setError('invalidUri');
                setErrorDetail(null);
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
        setModules(null);
        const result = parseUnityHubUri(inputUri);
        if (result) {
            setParsedVersion(result.version);
            setError(null);
            setErrorDetail(null);
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
            setError('invalidUri');
            setErrorDetail(null);
            // 清除 URL 中的 'v' 参数
            const newParams = new URLSearchParams(searchParams.toString());
            newParams.delete('v');
            router.push(`${pathname}?${newParams.toString()}`, { scroll: false });
        }
    }, [inputUri, router, pathname, searchParams, selectedPlatform, selectedArchitecture, selectedStream, selectedEntitlements]); // 添加了所有相关状态作为依赖


    const handleFetchModules = useCallback(async () => {
        if (!parsedVersion) {
            setError('parseFirst');
            setErrorDetail(null);
            return;
        }

        setLoading(true);
        setError(null);
        setErrorDetail(null);
        setModules(null);

        try {
            const data = await fetchUnityReleases({
                version: parsedVersion,
                platform: selectedPlatform,
                architecture: selectedArchitecture,
                stream: selectedStream || undefined,
                entitlement: selectedEntitlements.length > 0 ? selectedEntitlements : undefined,
            });

            const release = data.results?.[0];
            if (!release) {
                setError('noRelease');
                return;
            }

            const download = release.downloads?.find(
                (d: any) => d.platform === selectedPlatform && d.architecture === selectedArchitecture
            ) || release.downloads?.[0];

            const modulesOnline = download?.modules;

            if (!modulesOnline || modulesOnline.length === 0) {
                setError('noModules');
                return;
            }

            const processedModules: Module[] = [];
            for (const module of modulesOnline) {
                fetch_modules_from_release(processedModules, module);
            }

            setModules(processedModules);
            setModuleSearch('');
        } catch (err: any) {
            console.error("Fetching or processing failed:", err);
            setError('unknownError');
            setErrorDetail(err instanceof Error ? err.message : null);
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
        setModules(null);
    };

    const handleArchitectureChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedArchitecture(e.target.value as UnityReleaseDownloadArchitecture);
        setModules(null);
    };

    const handleStreamChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value as UnityReleaseStream | '';
        setSelectedStream(value);
        setModules(null);
    };

    const handleEntitlementChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value as UnityReleaseEntitlement;
        const isChecked = e.target.checked;
        setSelectedEntitlements(prev =>
            isChecked
                ? [...prev, value]
                : prev.filter(ent => ent !== value)
        );
        setModules(null);
    };

    const handleInstalledChange = (index: number, selected: boolean) => {
        setModules(previous => previous?.map((module, moduleIndex) =>
            moduleIndex === index ? { ...module, selected } : module
        ) ?? null);
    };


    return (
        <>
            <br/>
            <div lang={language === 'en' ? 'en' : 'zh-CN'} className="max-w-3xl mx-auto my-8 p-8 bg-white rounded-2xl shadow-xl border border-gray-100 space-y-8">
                {/* 头部标题 */}
                <div className="border-b border-gray-100 pb-4">
                    <div className="flex justify-end items-center gap-2 mb-3">
                        <label htmlFor="moduleLanguage" className="text-sm text-gray-600">{t.language}</label>
                        <select id="moduleLanguage" value={language} onChange={(e) => handleLanguageChange(e.target.value as 'zh' | 'en')}
                                className="px-2 py-1 border border-gray-200 rounded-lg text-sm text-gray-700" aria-label={t.language}>
                            <option value="zh">中文</option>
                            <option value="en">English</option>
                        </select>
                    </div>
                    <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                        UnityHub <span className="text-blue-600">modules.json</span> {t.title}
                    </h2>
                    <p className="mt-2 text-sm text-gray-500">{t.subtitle}</p>
                    <p className="mt-2 text-sm text-gray-500">{t.installedNote}</p>
                </div>

                {/* URI 解析输入 */}
                <div className="bg-gray-50 p-5 rounded-xl space-y-4">
                    <div>
                        <h3 className="font-bold text-gray-800">{t.stepOne}</h3>
                        <p className="text-sm text-gray-500">{t.uriHelp}</p>
                    </div>
                    <div className="flex items-center space-x-2 mb-2">
                        <label htmlFor="uriInput" className="text-sm font-semibold text-gray-700">UnityHub URI</label>
                    </div>
                    <div className="flex flex-col md:flex-row gap-3">
                        <input
                            type="text"
                            id="uriInput"
                            value={inputUri}
                            onChange={(e) => {
                                setInputUri(e.target.value);
                                setParsedVersion(null);
                                setModules(null);
                                setError(null);
                                setErrorDetail(null);
                            }}
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
                            {t.parseVersion}
                        </button>
                    </div>
                </div>

                {/* 配置参数 */}
                <div className="space-y-4">
                    <div>
                        <h3 className="font-bold text-gray-800">{t.stepTwo}</h3>
                        <p className="text-sm text-gray-500">{t.deviceHelp}</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* 平台选择 */}
                    <div className="space-y-2">
                        <label htmlFor="modulePlatform" className="text-xs font-bold text-gray-500 uppercase tracking-wider">{t.platform}</label>
                        <select
                            id="modulePlatform"
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
                        <label htmlFor="moduleArchitecture" className="text-xs font-bold text-gray-500 uppercase tracking-wider">{t.architecture}</label>
                        <select
                            id="moduleArchitecture"
                            value={selectedArchitecture}
                            onChange={handleArchitectureChange}
                            className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
                        >
                            {Object.values(UnityReleaseDownloadArchitecture).map((a) => (
                                <option key={a} value={a}>{a}</option>
                            ))}
                        </select>
                    </div>

                    </div>
                </div>

                <details className="border border-gray-200 rounded-xl p-5">
                    <summary className="font-bold text-gray-800 cursor-pointer">{t.advanced}</summary>
                    <p className="text-sm text-gray-500 mt-2 mb-5">{t.advancedHelp}</p>
                    {/* 流选择 */}
                    <div className="space-y-2">
                        <label htmlFor="moduleStream" className="text-xs font-bold text-gray-500 uppercase tracking-wider">{t.stream}</label>
                        <select
                            id="moduleStream"
                            value={selectedStream}
                            onChange={handleStreamChange}
                            className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
                        >
                            <option value="">{t.unspecified}</option>
                            {Object.values(UnityReleaseStream).map((s) => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                    </div>
                    {/* 授权复选框 */}
                    <div className="pt-5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-3">{t.entitlements}</label>
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
                                    className="mr-2 accent-blue-600"
                                />
                                <span className="text-sm font-medium">{ent}</span>
                            </label>
                        ))}
                    </div>
                    </div>
                </details>

                {/* 错误显示 */}
                {error && (
                    <div className="flex items-center p-4 bg-red-50 text-red-700 rounded-xl border border-red-100 animate-pulse">
                        <span className="mr-2">⚠️</span>
                        <p className="text-sm font-medium">{t[error]}{errorDetail ? ` ${errorDetail}` : ''}</p>
                    </div>
                )}

                {/* 执行获取按钮 */}
                {parsedVersion && (
                    <div className="space-y-3">
                        <h3 className="font-bold text-gray-800">{t.stepThree}</h3>
                    <div className="flex items-center justify-between p-4 bg-blue-600 rounded-xl text-white shadow-lg shadow-blue-200">
                        <div>
                            <p className="text-xs opacity-80">{t.currentVersion}</p>
                            <p className="font-mono font-bold text-lg">{parsedVersion}</p>
                        </div>
                        <button
                            onClick={handleFetchModules}
                            disabled={loading}
                            className="px-8 py-3 bg-white text-blue-600 rounded-lg font-bold hover:bg-blue-50 transition-colors disabled:opacity-50"
                        >
                            {loading ? t.fetching : t.fetchModules}
                        </button>
                    </div>
                    </div>
                )}

                {/* 结果展示 */}
                {modules && (
                    <div className="mt-8 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="space-y-3 border border-gray-200 rounded-xl p-5">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                                <h3 className="font-bold text-gray-800">{t.installedHeading}</h3>
                                <button type="button" onClick={() => setModules(previous => previous?.map(module => ({ ...module, selected: false })) ?? null)}
                                        disabled={installedCount === 0} className="text-sm text-blue-700 disabled:text-gray-400">
                                    {t.clearInstalled}
                                </button>
                            </div>
                            <p className="text-sm text-gray-500">{t.installedHelp}</p>
                            <p className="text-sm font-medium text-gray-700" aria-live="polite">{t.installedCount(installedCount)}</p>
                            <input type="search" value={moduleSearch} onChange={event => setModuleSearch(event.target.value)}
                                   placeholder={t.searchModules} aria-label={t.searchModules}
                                   className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
                            <div className="max-h-72 overflow-y-auto divide-y divide-gray-100">
                                {filteredModules.map(({ module, index }) => (
                                    <label key={index} className="flex items-start gap-3 py-2 cursor-pointer">
                                        <input type="checkbox" checked={module.selected}
                                               onChange={event => handleInstalledChange(index, event.target.checked)}
                                               className="mt-1 accent-blue-600" />
                                        <span className="min-w-0">
                                            <span className="block text-sm font-medium text-gray-800">{module.name || module.id}</span>
                                            <span className="block text-xs text-gray-500 break-all">{module.id}{module.parent ? ` · ${module.parent}` : ''}</span>
                                        </span>
                                    </label>
                                ))}
                                {filteredModules.length === 0 && <p className="py-4 text-sm text-gray-500">{t.noMatchingModules}</p>}
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold text-gray-800 flex items-center">
                                <span className="mr-2 text-green-500">✓</span>
                                {t.modulesFound(modules.length)}
                            </h3>
                            <button
                                onClick={handleDownloadJson}
                                className="flex items-center px-4 py-2 bg-purple-100 text-purple-700 rounded-lg text-sm font-bold hover:bg-purple-200 transition"
                            >
                                {t.download}
                            </button>
                        </div>

                        <details className="border border-gray-200 rounded-xl p-5">
                            <summary className="font-bold text-gray-800 cursor-pointer">{t.jsonPreview}</summary>
                            <pre className="mt-4 bg-gray-900 text-gray-300 p-5 rounded-xl text-xs font-mono overflow-x-auto max-h-80 leading-relaxed shadow-inner">
                                {JSON.stringify(modules, null, 2)}
                            </pre>
                        </details>
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
        <React.Suspense fallback={<div>{translations.zh.loading}</div>}>
            <UnityModuleFetcherInner />
        </React.Suspense>
    );
};

export default UnityModuleFetcherWithSuspense;
