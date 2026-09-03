# NoUnityCN

#### 官方网址：[nounitycn.top](https://nounitycn.top/)

##### 备用网址1：[nounitycn-vinext.danke666.top](https://nounitycn-vinext.danke666.top/)

##### 备用网址2：[nounitycn.danke666.top](https://nounitycn.danke666.top/)

NoUnityCN是为有中文使用需求的海外Unity开发者提供Unity Editor版本检索服务，使用官方公开接口开发，我们不会保留任何数据。

> [!IMPORTANT]
> NoUnityCN**不是破解、修改、下载工具**，而是使用官方公开接口开发的检索服务
> 
> 我们尊重任何内容的版权，我们不会提供任何盗版、破解版相关服务，如果我们的内容侵害到您的权益，请及时联系我们删除。
> 
> 我们面向的开发者群体是**在华办公的海外开发者或使用中文作为工作语言的海外开发者及需要远程协助工作的开发者**，而**不为大中华区（包含中国大陆及港澳台区域）本土开发者提供服务**，对于后者，我们更推荐使用[团结引擎](https://unity.cn/).
> 
> 本项目下载服务由[开源项目](https://github.com/zwc456baby/file-proxy)提供，请勿用于商业用途。

> [!CAUTION]
> 下载服务由公益项目提供，可能会因技术原因随时中断
> 
> 使用前请务必确认符合您所在地区的软件使用规定
> 
> 本项目不提供任何技术授权文件(如激活License)
> 
> 本站不为不在Unity支持地区的用户服务

### 版权所有

本软件遵循 MIT License，项目内所有代码遵循协议分发，但不包括通过API(Application Programming Interface)获取的内容及基于本项目开发的衍生内容。

“Unity”、Unity 徽标及其他 Unity 商标是 Unity Technologies 或其在美国和其他地区的分支机构的商标或注册商标。NoUnityCN不是Unity Technologies优美缔软件提供的一项服务，本站徽标版权归Unity Technologies 或其在美国和其他地区的分支机构所有。

### 历史版本兼容

NoUnityCN v2版本在2026年6月上线，网站结构有所调整，但为了兼容历史遗留的url，我们保留了/download /component /tools /releaseNotses /unityModule 端点，这些端点仅为兼容旧版本url所保留，不会在新版网页中使用。

Unity自6000系列开始属于“SUPPORTED”标签替代“TECH标签”，我们将其与“TECH”标签一并放在“技术支持”栏目中。

---

## 部署指南

本仓库同时支持 **Next.js** 与 **[vinext](https://github.com/vinext/vinext)** 两种框架，可任选其一进行部署。两者共用同一套 `app/` 目录源码，切换框架无需修改业务代码。

### 环境要求

- Node.js >= 20
- 包管理器：`pnpm`（推荐，仓库默认） / `npm` / `yarn` / `bun`

```bash
# 安装依赖
pnpm install
```

### 一、Next.js 部署

Next.js 版本使用官方工作流，适合部署到 Vercel 等通用 Node.js 平台（推荐直接使用 [Vercel](https://vercel.com)）。

#### 本地开发与构建

```bash
# 本地开发（默认端口 3000）
pnpm dev

# 生产构建
pnpm build

# 本地预览生产构建
pnpm start
```

> 说明：`/docs` 路径由 `next.config.mjs` 中的 `rewrites` 转发到静态目录，构建时需保证 `public/docs` 资源存在。

#### 部署到 Vercel

1. 将仓库导入 [Vercel](https://vercel.com/new)，仓库根目录即项目根目录
2. 框架预设自动识别为 **Next.js**
3. Build Command：`pnpm build`，Output Directory：`.next`
4. 点击 Deploy 即可

> 提示：也可使用 [Vercel CLI](https://vercel.com/docs/cli)（`pnpm add -g vercel` 后运行 `pnpm vercel`）进行命令行部署。

### 二、vinext 部署（Cloudflare Workers）

vinext 基于 Vite 重新实现了 Next.js 的接口，部署目标是 **Cloudflare Workers**。仓库已内置相关配置（`wrangler.jsonc`、`vite.config.ts`、`worker/index.ts`），开箱即用。

#### 本地开发与构建

```bash
# 本地开发（默认端口 3001）
pnpm dev:vinext

# 生产构建（输出到 dist/ 目录）
pnpm build:vinext

# 本地预览生产构建
pnpm start:vinext
```

#### Cloudflare 资源配置

部署前需要在 [Cloudflare Dashboard](https://dash.cloudflare.com) 完成以下资源并同步至 `wrangler.jsonc`：

| 资源             | 说明                                           |
| -------------- | -------------------------------------------- |
| Workers        | 创建 Worker，名称需与 `wrangler.jsonc` 中的 `name` 一致 |
| KV Namespace   | 新建 KV 并替换 `kv_namespaces[].id`（用于数据缓存）       |
| Image Resizing | 若启用图片优化，需在 Worker 设置中开启                      |
| 自定义域名          | 绑定备用域名（如 `*.danke666.top`）完成回源配置             |

#### 一键部署

```bash
pnpm build:vinext

# 部署到 Cloudflare Workers（自动生成/读取 wrangler.jsonc）
pnpm exec vinext deploy          # 或 pnpm exec wrangler deploy
```

vinext 会自动构建并上传静态资源与 worker 代码。若已执行过 `pnpm build:vinext`（产物在 `dist/`），也可直接使用 wrangler 部署：

```bash
pnpm exec wrangler deploy
```

如需使用 Cloudflare 自定义域名，可添加相关配置并运行 `pnpm exec wrangler deploy --dry-run` 预览生效配置。

#### 环境变量

本项目不依赖服务端密钥。若后续新增，通过 `pnpm exec wrangler secret put <KEY>` 配置，或在 `wrangler.jsonc` 的 `vars` 中声明。


