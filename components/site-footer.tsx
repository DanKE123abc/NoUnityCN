const footerNavigation = {
  产品: [
    { name: "下载 Unity Editor", href: "/" },
  ],
  资源: [
    { name: "Unity Editor 官方文档", href: "https://docs.unity3d.com/Manual/index.html" },
  ],
  更多: [
    { name: "GitHub", href: "https://github.com/NoUnityCN/NoUnityCN"},
  ]
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
          <p className="text-base text-gray-400 text-left">NoUnityCN是一项大家一起实现的开源项目，我们旨在为有中文使用需求的海外Unity开发者提供Unity Editor版本检索服务。</p>
          <p className="text-base text-gray-400 text-left">“Unity”、Unity
            徽标及其他 Unity 商标是 Unity Technologies 或其在美国和其他地区的分支机构的商标或<a href="https://unity.com/legal/trademarks">注册商标</a>。NoUnityCN不是Unity Technologies (优三缔科技有限公司) 软件提供的一项服务，本站徽标版权归Unity Technologies 或其在美国和其他地区的分支机构所有。</p>
          <p className="text-base text-gray-400 text-left">我们不会保存任何的文件与数据，所有的内容来自官方下载渠道以及公益服务器，请自行甄别。</p>
        </div>
      </div>
    </footer>
  )
}

