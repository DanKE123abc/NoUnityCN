"use client"

import React from "react"
import { useI18n } from "@/lib/i18n"

export function SiteFooter() {
  const { t, locale, setLocale } = useI18n()
  const [buildHash, setBuildHash] = React.useState<string>("")

  React.useEffect(() => {
    let cancelled = false
    fetch("/version.json")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled && data?.hash) setBuildHash(data.hash)
      })
      .catch(() => {})
    return () => { cancelled = true }
  }, [])

  const footerNavigation = [
    {
      category: t("footer.product"),
      items: [
        { name: t("footer.downloadEditor"), href: "/" },
        { name: t("footer.downloadHub"), href: "/unityhub" },
      ],
    },
    {
      category: t("footer.resources"),
      items: [
        { name: t("footer.officialDocs"), href: "https://docs.unity3d.com/Manual/index.html" },
      ],
    },
    {
      category: t("footer.more"),
      items: [
        { name: t("footer.github"), href: "https://github.com/NoUnityCN/NoUnityCN" },
      ],
    },
  ]

  return (
    <footer className="bg-gray-800">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {footerNavigation.map((group) => (
            <div key={group.category}>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">{group.category}</h3>
              <ul className="mt-4 space-y-4">
                {group.items.map((item) => (
                  <li key={item.name}>
                    <a href={item.href} className="text-base text-gray-300 hover:text-white">
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">{t("footer.language")}</h3>
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => setLocale("zh")}
                className={`px-3 py-1.5 rounded text-sm font-medium border transition-colors ${
                  locale === "zh"
                    ? "bg-white text-gray-900 border-white"
                    : "bg-transparent text-gray-300 border-gray-600 hover:text-white"
                }`}
              >
                {t("footer.language.zh")}
              </button>
              <button
                type="button"
                onClick={() => setLocale("en")}
                className={`px-3 py-1.5 rounded text-sm font-medium border transition-colors ${
                  locale === "en"
                    ? "bg-white text-gray-900 border-white"
                    : "bg-transparent text-gray-300 border-gray-600 hover:text-white"
                }`}
              >
                {t("footer.language.en")}
              </button>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-700 pt-8">
          <p className="text-base text-gray-400 text-left">{t("footer.desc1")}</p>
          <p className="text-base text-gray-400 text-left">{t("footer.desc2")}</p>
          <p className="text-base text-gray-400 text-left">{t("footer.desc3")}</p>
          {buildHash && (
            <p className="text-base text-gray-400 text-left">{t("footer.build")}: {buildHash}</p>
          )}
        </div>
      </div>
    </footer>
  )
}