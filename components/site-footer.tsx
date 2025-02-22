const footerNavigation = {
  产品: [
    { name: "下载", href: "/" },
  ],
  资源: [
    { name: "文档", href: "/docs" },
  ],
}

export function SiteFooter() {
  return (
    <footer className="bg-gray-800">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {Object.entries(footerNavigation).map(([category, items]) => (
            <div key={category}>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">{category}</h3>
              <ul className="mt-4 space-y-4">
                {items.map((item) => (
                  <li key={item.name}>
                    <a href={item.href} className="text-base text-gray-300 hover:text-white">
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-8 border-t border-gray-700 pt-8">
          <p className="text-base text-gray-400 text-left">NoUnityCN是一项大家一起实现的开源项目，我们旨在为部分特殊地区的Unity开发者提供与世界上大多数用户一致的Unity
            Editor下载方式。</p>
          <p className="text-base text-gray-400 text-left">“Unity”、Unity
            徽标及其他 Unity 商标是 Unity Technologies 或其在美国和其他地区的分支机构的商标或注册商标。NoUnityCN不是Unity Technologies优美缔软件提供的一项服务。</p>
          <p className="text-base text-gray-400 text-left">我们不会保存任何的文件与数据，所有的内容来自官方下载渠道，请自行甄别。</p>
        </div>
      </div>
    </footer>
  )
}

