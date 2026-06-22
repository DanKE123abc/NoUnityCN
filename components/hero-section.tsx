"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { Download } from "lucide-react";

const HeroScene = dynamic(() => import("@/components/hero-scene"), { ssr: false });

export default function HeroSection({ isLoading, version, releaseDate, downloadUrl }: { isLoading?: boolean; version?: string; releaseDate?: string; downloadUrl?: string }) {
  const formattedDate = (() => {
    if (!releaseDate) return "未知";
    const d = new Date(releaseDate);
    if (isNaN(d.getTime())) return releaseDate;
    return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
  })();
  return (
    <section className="relative w-full h-screen overflow-hidden" style={{ background: "linear-gradient(135deg, #0a0a1a 0%, #1a1a2e 50%, #16213e 100%)" }}>
      <HeroScene />
      <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-20 z-10">
        {isLoading ? (
          <div>
            <div className="animate-spin inline-block w-8 h-8 border-[3px] border-white border-t-transparent rounded-full mb-4"></div>
            <p className="text-lg text-gray-300">加载中...</p>
          </div>
        ) : (
          <div>
            <p className="text-sm text-gray-400 mb-2">最新版本（{formattedDate}）：</p>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
              Unity {version || ""}
            </h1>
              <Link
                href={downloadUrl ? `/download?v=${downloadUrl}` : "#download-section"}
              className="inline-flex items-center justify-center gap-2 w-fit px-8 py-2 bg-blue-600 rounded-full text-white hover:bg-blue-700 transition-all"
            >
              <Download className="w-4 h-4" />
              立即下载
            </Link>
          </div>
        )}
      </div>
      {!isLoading && (
        <div className="absolute bottom-20 left-0 right-0 flex justify-center z-10">
          <Link
            href="#download-section"
            className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white hover:bg-white/20 transition-all"
          >
            更多版本
          </Link>
        </div>
      )}
    </section>
  );
}
