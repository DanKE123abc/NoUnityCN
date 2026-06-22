"use client";

import { Download, ExternalLink } from "lucide-react";

const UnityLogo = () => (
  <svg
    width="48"
    height="48"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M41.2 17.4L27.2 9.5c-1.2-0.7-2.8-0.7-4 0L9.2 17.4C8 18.1 7.2 19.4 7.2 20.8v15.9c0 1.4 0.8 2.7 2 3.4l14 8.1c1.2 0.7 2.8 0.7 4 0l14-8.1c1.2-0.7 2-2 2-3.4V20.8c0-1.4-0.8-2.7-2-3.4z"
      fill="white"
    />
    <path
      d="M33.5 24.5l-6.8-4v8l-6.8-4 6.8-4 6.8 4-6.8 4z"
      fill="#222"
    />
    <path
      d="M33.5 24.5l-6.8-4v8l-6.8-4 6.8-4 6.8 4-6.8 4z"
      fill="white"
      opacity="0.3"
    />
  </svg>
);

const PlatformIcon = ({ platform }: { platform: string }) => {
  if (platform === "mac") {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
      </svg>
    );
  }
  if (platform === "linux") {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
        <path d="M12.504 0c-.155 0-.315.008-.48.021-4.226.333-3.105 4.807-3.17 6.298-.076 1.092-.3 1.953-1.05 3.02-.885 1.051-2.127 2.75-2.716 4.521-.278.832-.41 1.684-.287 2.489a.424.424 0 00-.11.135c-.26.268-.45.6-.663.839-.199.199-.485.267-.797.4-.313.136-.658.269-.864.68-.09.189-.136.394-.132.602 0 .199.027.4.055.536.058.399.116.728.04.97-.249.68-.28 1.145-.106 1.484.174.334.535.47.94.601.81.2 1.91.135 2.774.6.926.466 1.866.67 2.616.47.526-.116.97-.464 1.208-.946.587-.003 1.23-.269 2.26-.334.699-.058 1.574.267 2.577.2.025.134.063.198.114.333l.003.003c.391.778 1.113 1.368 1.884 1.43.485.04.8-.066.947-.202.112-.168.157-.37.148-.563-.014-.4-.138-.735-.276-1.074a7.28 7.28 0 01-.192-.574c-.148-.536-.212-1.076-.106-1.559.106-.484.373-.87.742-1.142.194-.135.414-.2.612-.268a4.03 4.03 0 00.235-.067 8.3 8.3 0 00.443-.17c.25-.1.476-.213.641-.358.14-.135.213-.334.167-.536-.047-.267-.3-.468-.64-.575-.446-.134-.978-.166-1.428-.332-.629-.234-1.142-.667-1.462-1.257a1.79 1.79 0 01-.164-.398c.157-.336.373-.614.662-.796.386-.246.85-.364 1.314-.437.269-.04.543-.07.783-.234.213-.134.357-.365.373-.572a5.434 5.434 0 00-.058-.764 4.67 4.67 0 00-.37-1.236 7.03 7.03 0 00-.313-.637c-.46-.801-.86-1.337-1.122-1.668-.204-.234-.333-.332-.434-.398-.09-.067-.156-.067-.258-.034z" />
      </svg>
    );
  }
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
      <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801" />
    </svg>
  );
};

export default function UnityHubPage() {
  return (
    <div className="min-h-screen bg-[#1a1a2e] text-white">
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <UnityLogo />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            Unity Hub 下载
          </h1>
          <p className="text-gray-400 text-lg mb-2">
            选择适合您系统的安装包格式
          </p>
          <p className="text-gray-500 text-sm">
            了解更多关于{" "}
            <a href="#" className="text-blue-400 hover:underline">
              许可协议
            </a>{" "}
            的信息
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-[#252540] rounded-xl p-6 border border-white/5 hover:border-white/10 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                  <PlatformIcon platform="mac" />
                </div>
                <h3 className="text-xl font-bold">MacOS</h3>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <a
                href="https://pd.zwc365.com/cfdownload/https://public-cdn.cloud.unity3d.com/hub/prod/UnityHubSetup-arm64.dmg"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm font-medium transition-colors border border-white/10"
              >
                <Download className="w-4 h-4" />
                Apple Silicon
              </a>
              <a
                href="https://pd.zwc365.com/cfdownload/https://public-cdn.cloud.unity3d.com/hub/prod/UnityHubSetup-x64.deb"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm font-medium transition-colors border border-white/10"
              >
                <Download className="w-4 h-4" />
                Intel
              </a>
            </div>
          </div>

          <div className="bg-[#252540] rounded-xl p-6 border border-white/5 hover:border-white/10 transition-colors">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                <PlatformIcon platform="linux" />
              </div>
              <h3 className="text-xl font-bold">Linux</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              <a
                href="https://pd.zwc365.com/cfdownload/https://public-cdn.cloud.unity3d.com/hub/prod/UnityHubSetup-amd64.deb"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm font-medium transition-colors border border-white/10"
              >
                <Download className="w-4 h-4" />
                .deb
              </a>
              <a
                href="https://pd.zwc365.com/cfdownload/https://public-cdn.cloud.unity3d.com/hub/prod/UnityHubSetup-x86_64.rpm"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm font-medium transition-colors border border-white/10"
              >
                <Download className="w-4 h-4" />
                .rpm
              </a>
            </div>
          </div>

          <div className="bg-[#252540] rounded-xl p-6 border border-white/5 hover:border-white/10 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                  <PlatformIcon platform="windows" />
                </div>
                <h3 className="text-xl font-bold">Windows</h3>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <a
                href="https://pd.zwc365.com/cfdownload/https://public-cdn.cloud.unity3d.com/hub/prod/UnityHubSetup-x64.exe"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm font-medium transition-colors border border-white/10"
              >
                <Download className="w-4 h-4" />
                x64
              </a>
              <a
                href="https://pd.zwc365.com/cfdownload/https://public-cdn.cloud.unity3d.com/hub/prod/UnityHubSetup-arm64.exe"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm font-medium transition-colors border border-white/10"
              >
                <Download className="w-4 h-4" />
                Arm64
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
