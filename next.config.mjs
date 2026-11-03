import { execSync } from "child_process"
import fs from "fs"
import path from "path"

let buildHash = "dev"
try {
  buildHash = execSync("git rev-parse --short HEAD", { encoding: "utf8" }).trim()
} catch (e) {
  // ignore
}

try {
  const versionFile = path.join(process.cwd(), "public", "version.json")
  fs.writeFileSync(versionFile, JSON.stringify({ hash: buildHash }))
} catch (e) {
  // ignore
}

let userConfig = undefined

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    webpackBuildWorker: true,
    parallelServerBuildTraces: true,
    parallelServerCompiles: true,
  },
  async rewrites() {
    return [
      {
        source: '/docs',
        destination: '/docs/index.html'
      }
    ]
  }
}

mergeConfig(nextConfig, userConfig)

function mergeConfig(nextConfig, userConfig) {
  if (!userConfig) {
    return
  }

  for (const key in userConfig) {
    if (
      typeof nextConfig[key] === 'object' &&
      !Array.isArray(nextConfig[key])
    ) {
      nextConfig[key] = {
        ...nextConfig[key],
        ...userConfig[key],
      }
    } else {
      nextConfig[key] = userConfig[key]
    }
  }
}

export default nextConfig
