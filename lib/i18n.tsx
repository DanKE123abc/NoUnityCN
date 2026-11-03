"use client"

import React, { createContext, useContext, useEffect, useState } from "react"

export type Locale = "zh" | "en"

const STORAGE_KEY = "nounitycn-locale"

type Params = Record<string, string | number>

type I18nContextValue = {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string, params?: Params) => string
}

const I18nContext = createContext<I18nContextValue | null>(null)

// Translation dictionaries. Keys use dot notation.
const dictionaries: Record<Locale, Record<string, string>> = {
  zh: {
    // common
    "common.loading": "加载中...",
    "common.download": "下载",
    "common.home": "主页",

    // nav
    "nav.home": "主页",
    "nav.unityHub": "Unity Hub",
    "nav.tools": "工具",
    "nav.githubStar": "在GitHub上给我们star⭐",

    // footer
    "footer.product": "产品",
    "footer.resources": "资源",
    "footer.more": "更多",
    "footer.downloadEditor": "下载 Unity Editor",
    "footer.downloadHub": "下载 Unity Hub",
    "footer.officialDocs": "Unity Editor 官方文档",
    "footer.unityModule": "UnityHub modules.json 生成器",
    "footer.hubRoute": "HubRoute",
    "footer.github": "GitHub",
    "footer.desc1": "NoUnityCN是一项大家一起实现的开源项目，我们旨在为有中文使用需求的海外Unity开发者提供Unity Editor版本检索服务。",
    "footer.desc2": "“Unity”、Unity 徽标及其他 Unity 商标是 Unity Technologies 或其在美国和其他地区的分支机构的商标或注册商标。NoUnityCN不是Unity Technologies (优三缔科技有限公司) 软件提供的一项服务，本站徽标版权归Unity Technologies 或其在美国和其他地区的分支机构所有。",
    "footer.desc3": "我们不会保存任何的文件与数据，所有的内容来自官方下载渠道以及公益服务器，请自行甄别。",
    "footer.language": "语言",
    "footer.build": "构建版本",
    "footer.language.zh": "中文",
    "footer.language.en": "English",

    // home
    "home.title": "下载 Unity",
    "home.subtitle": "选择适合您的版本开始创作",
    "home.tab.tech": "技术支持",
    "home.tab.lts": "长期支持",
    "home.tab.beta": "测试版",
    "home.tab.alpha": "预览版",
    "home.search.placeholder": "全局搜索版本...",
    "home.card.title.all": "所有{stream}版本",
    "home.card.title.search": "全局搜索结果 \"{query}\"",
    "home.stream.tech": "技术支持",
    "home.stream.lts": "长期支持",
    "home.stream.beta": "测试",
    "home.stream.alpha": "预览",
    "home.version.all": "所有版本",
    "home.version.series": "{year} 系列",
    "home.table.version": "版本",
    "home.table.releaseDate": "发布时间",
    "home.table.releaseNotes": "发布说明",
    "home.table.downloadPage": "下载页面",
    "home.table.addComponent": "添加组件",
    "home.releaseNotesBtn": "发布说明",
    "home.downloadBtn": "下载",
    "home.addComponentBtn": "添加组件",
    "home.showMore": "显示更多版本 ({count} 个) ↓",
    "home.showMoreSearch": "显示更多搜索结果 ({count} 个) ↓",
    "home.noResults": "没有找到匹配的版本",
    "home.loadingAll": "全量数据加载中...",

    // tools
    "tools.title": "工具",
    "tools.subtitle": "一些在线小工具",
    "tools.card.modules": "UnityHub modules.json 生成器",
    "tools.card.modules.desc": "解析 UnityHub URI，快速生成 modules.json 安装配置，便于自动化安装 Unity 模块。",
    "tools.card.modules.badge": "测试",
    "tools.card.use": "使用",
    "tools.card.hubRoute": "HubRoute",
    "tools.card.hubRoute.desc": "轻量、开源、跨平台的 Unity Hub 工具，可打开国际版 Unity Hub 官方下载地址，并通过本地 HTTP 代理启动 Hub。",
    "tools.card.hubRoute.badge": "推荐",
    "tools.card.visit": "访问",

    // unityHub
    "unityHub.title": "Unity Hub 下载",
    "unityHub.subtitle": "选择适合您系统的安装包格式",
    "unityHub.license": "了解更多关于 许可协议 的信息",

    // download
    "download.preparing": "准备下载：",
    "download.releaseNotes": "发行说明",
    "download.addComponent": "添加组件",
    "download.useHub": "使用Unity Hub下载",
    "download.recommended": "推荐方式",
    "download.win64": "Windows(x86-64)下载",
    "download.win64.note": "支持所有版本",
    "download.win32": "Windows(32 bit)下载",
    "download.win32.note": "仅支持Unity 5.x",
    "download.winArm": "Windows(ARM64)下载",
    "download.winArm.note": "仅支持Unity 6.x或更高",
    "download.macIntel": "MacOS(Intel)下载",
    "download.macIntel.note": "支持所有版本",
    "download.macArm": "MacOS(Apple Silicon)下载",
    "download.macArm.note": "仅支持2021.2.0或更高",
    "download.linux": "Linux(x86-64)下载",
    "download.linux.note": "仅支持2017.4.6或更高",

    // component
    "component.add": "添加组件：",
    "component.other": "其他内容",
    "component.otherBadge": "其他",
    "component.otherDesc": "下载 Unity {version} 的 其他内容",
    "component.offlineDocs": "离线文档",
    "component.builtinShaders": "Builtin Shaders (内置着色器)",
    "component.moduleJson": "module.json 生成",
    "component.windows": "Windows专区",
    "component.windowsBadge": "WINDOWS",
    "component.windowsDesc": "下载适用于Windows平台下Unity {version}的组件",
    "component.mac": "Mac OS专区",
    "component.macBadge": "Mac",
    "component.macDesc": "下载适用于Mac OS平台下Unity {version}的组件",
    "component.linux": "Linux专区",
    "component.linuxBadge": "LINUX",
    "component.linuxDesc": "下载适用于LINUX平台下Unity {version}的组件",

    // releaseNotes
    "releaseNotes.title": "Release Notes - {version}",
    "releaseNotes.unsupported": "暂不支持在线预览",
    "releaseNotes.unsupportedDesc": "该版本说明无法直接显示，请前往原始页面查看。",
    "releaseNotes.openOriginal": "打开原始文件",
    "releaseNotes.badRequest": "400 Bad Request",
    "releaseNotes.badRequestDesc": "无法识别该 Unity 版本或 URI 格式有误。",
    "releaseNotes.source": "来源:",
    "releaseNotes.loading": "加载中...",

    // unityModule
    "unityModule.title": "UnityHub modules.json 生成器",
    "unityModule.subtitle": "解析 UnityHub URI 并快速构建自动化安装配置文件",
    "unityModule.uriLabel": "UnityHub URI",
    "unityModule.parseBtn": "解析版本",
    "unityModule.parseError": "无法解析 URI，请检查格式是否正确！",
    "unityModule.parseError2": "无法解析 URI，请检查格式是否正确",
    "unityModule.needParse": "请先解析一个有效的 URI 以获取版本号。",
    "unityModule.platform": "平台",
    "unityModule.architecture": "架构",
    "unityModule.stream": "流",
    "unityModule.entitlements": "授权",
    "unityModule.unspecified": "(不指定)",
    "unityModule.currentVersion": "当前解析版本",
    "unityModule.fetchBtn": "获取模块列表",
    "unityModule.fetching": "获取中...",
    "unityModule.success": "成功获取 {count} 个模块",
    "unityModule.downloadJson": "下载 JSON",
    "unityModule.notFound": "未找到该版本的发布信息。",
    "unityModule.noModules": "返回的数据结构异常，未找到模块列表。",
    "unityModule.fetchError": "获取或处理模块时发生未知错误。",
    "unityModule.loadingFallback": "Loading...",
  },
  en: {
    "common.loading": "Loading...",
    "common.download": "Download",
    "common.home": "Home",

    "nav.home": "Home",
    "nav.unityHub": "Unity Hub",
    "nav.tools": "Tools",
    "nav.githubStar": "Star us on GitHub⭐",

    "footer.product": "Product",
    "footer.resources": "Resources",
    "footer.more": "More",
    "footer.downloadEditor": "Download Unity Editor",
    "footer.downloadHub": "Download Unity Hub",
    "footer.officialDocs": "Unity Editor Official Docs",
    "footer.hubRoute": "HubRoute",
    "footer.unityModule": "UnityHub modules.json Generator",
    "footer.github": "GitHub",
    "footer.desc1": "NoUnityCN is an open-source project built together by the community, providing Unity Editor version lookup for developers with Chinese language needs.",
    "footer.desc2": "\"Unity\", the Unity logo and other Unity trademarks are trademarks or registered trademarks of Unity Technologies or its affiliates in the U.S. and elsewhere. NoUnityCN is not a service provided by Unity Technologies (Unity Software Inc.), and the site logo copyright belongs to Unity Technologies or its affiliates.",
    "footer.desc3": "We do not store any files or data; all content comes from official download channels and public servers. Please verify on your own.",
    "footer.language": "Language",
    "footer.build": "Build",
    "footer.language.zh": "中文",
    "footer.language.en": "English",

    "home.title": "Download Unity",
    "home.subtitle": "Choose a version to start creating",
    "home.tab.tech": "Tech Support",
    "home.tab.lts": "Long Term Support",
    "home.tab.beta": "Beta",
    "home.tab.alpha": "Alpha",
    "home.search.placeholder": "Search versions globally...",
    "home.card.title.all": "All {stream} versions",
    "home.card.title.search": "Global search results \"{query}\"",
    "home.stream.tech": "Tech Support",
    "home.stream.lts": "Long Term Support",
    "home.stream.beta": "Test",
    "home.stream.alpha": "Preview",
    "home.version.all": "All versions",
    "home.version.series": "{year} series",
    "home.table.version": "Version",
    "home.table.releaseDate": "Release Date",
    "home.table.releaseNotes": "Release Notes",
    "home.table.downloadPage": "Download Page",
    "home.table.addComponent": "Add Component",
    "home.releaseNotesBtn": "Release Notes",
    "home.downloadBtn": "Download",
    "home.addComponentBtn": "Add Component",
    "home.showMore": "Show more versions ({count}) ↓",
    "home.showMoreSearch": "Show more search results ({count}) ↓",
    "home.noResults": "No matching versions found",
    "home.loadingAll": "Loading all data...",

    "tools.title": "Tools",
    "tools.subtitle": "Some online small tools",
    "tools.card.modules": "UnityHub modules.json Generator",
    "tools.card.modules.desc": "Parse a UnityHub URI and quickly generate a modules.json install config for automated Unity module installation.",
    "tools.card.modules.badge": "Test",
    "tools.card.use": "Use",
    "tools.card.hubRoute": "HubRoute",
    "tools.card.hubRoute.desc": "A lightweight, open-source, cross-platform Unity Hub tool that opens official international Unity Hub downloads and launches Hub via a local HTTP proxy.",
    "tools.card.hubRoute.badge": "Recommended",
    "tools.card.visit": "Visit",

    "unityHub.title": "Download Unity Hub",
    "unityHub.subtitle": "Choose the installer format for your system",
    "unityHub.license": "Learn more about the License Agreement",

    "download.preparing": "Preparing download:",
    "download.releaseNotes": "Release Notes",
    "download.addComponent": "Add Component",
    "download.useHub": "Download with Unity Hub",
    "download.recommended": "Recommended",
    "download.win64": "Windows (x86-64) Download",
    "download.win64.note": "Supports all versions",
    "download.win32": "Windows (32-bit) Download",
    "download.win32.note": "Unity 5.x only",
    "download.winArm": "Windows (ARM64) Download",
    "download.winArm.note": "Unity 6.x or higher",
    "download.macIntel": "MacOS (Intel) Download",
    "download.macIntel.note": "Supports all versions",
    "download.macArm": "MacOS (Apple Silicon) Download",
    "download.macArm.note": "2021.2.0 or higher",
    "download.linux": "Linux (x86-64) Download",
    "download.linux.note": "2017.4.6 or higher",

    "component.add": "Add Component:",
    "component.other": "Other Content",
    "component.otherBadge": "Other",
    "component.otherDesc": "Download other content for Unity {version}",
    "component.offlineDocs": "Offline Documentation",
    "component.builtinShaders": "Builtin Shaders",
    "component.moduleJson": "Generate module.json",
    "component.windows": "Windows Section",
    "component.windowsBadge": "WINDOWS",
    "component.windowsDesc": "Download components for Unity {version} on Windows",
    "component.mac": "Mac OS Section",
    "component.macBadge": "Mac",
    "component.macDesc": "Download components for Unity {version} on Mac OS",
    "component.linux": "Linux Section",
    "component.linuxBadge": "LINUX",
    "component.linuxDesc": "Download components for Unity {version} on Linux",

    "releaseNotes.title": "Release Notes - {version}",
    "releaseNotes.unsupported": "Online preview not supported",
    "releaseNotes.unsupportedDesc": "These release notes cannot be displayed directly. Please view the original page.",
    "releaseNotes.openOriginal": "Open original file",
    "releaseNotes.badRequest": "400 Bad Request",
    "releaseNotes.badRequestDesc": "Unable to recognize this Unity version or the URI format is invalid.",
    "releaseNotes.source": "Source:",
    "releaseNotes.loading": "Loading...",

    "unityModule.title": "UnityHub modules.json Generator",
    "unityModule.subtitle": "Parse a UnityHub URI and quickly build an automated install config file",
    "unityModule.uriLabel": "UnityHub URI",
    "unityModule.parseBtn": "Parse Version",
    "unityModule.parseError": "Unable to parse URI. Please check the format.",
    "unityModule.parseError2": "Unable to parse URI. Please check the format.",
    "unityModule.needParse": "Please parse a valid URI to get the version number first.",
    "unityModule.platform": "Platform",
    "unityModule.architecture": "Architecture",
    "unityModule.stream": "Stream",
    "unityModule.entitlements": "Entitlements",
    "unityModule.unspecified": "(Not specified)",
    "unityModule.currentVersion": "Current parsed version",
    "unityModule.fetchBtn": "Fetch Module List",
    "unityModule.fetching": "Fetching...",
    "unityModule.success": "Successfully fetched {count} modules",
    "unityModule.downloadJson": "Download JSON",
    "unityModule.notFound": "No release info found for this version.",
    "unityModule.noModules": "Unexpected data structure; module list not found.",
    "unityModule.fetchError": "An unknown error occurred while fetching or processing modules.",
    "unityModule.loadingFallback": "Loading...",
  },
}

// We'll populate below by importing? Keep inline to avoid async.
// For maintainability, dictionaries are filled in this file's bottom.

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("zh")

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY)
      if (saved === "zh" || saved === "en") {
        setLocaleState(saved)
        return
      }
      // 没有手动选择过语言时，根据浏览器语言自动选择
      const browserLang = (window.navigator.language || window.navigator.languages?.[0] || "").toLowerCase()
      const detected: Locale = browserLang.startsWith("zh") ? "zh" : "en"
      setLocaleState(detected)
    } catch {
      // ignore
    }
  }, [])

  useEffect(() => {
    try {
      document.documentElement.lang = locale === "zh" ? "zh-CN" : "en"
    } catch {
      // ignore
    }
  }, [locale])

  const setLocale = (next: Locale) => {
    setLocaleState(next)
    try {
      window.localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // ignore
    }
  }

  const t = (key: string, params?: Params) => {
    const dict = dictionaries[locale] || {}
    let value = dict[key]
    if (value == null) {
      value = dictionaries.zh[key]
    }
    if (value == null) {
      value = key
    }
    if (params) {
      for (const [k, v] of Object.entries(params)) {
        value = value.replace(new RegExp(`\\{${k}\\}`, "g"), String(v))
      }
    }
    return value
  }

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) {
    throw new Error("useI18n must be used within I18nProvider")
  }
  return ctx
}

export { dictionaries }
