import { cloudflare } from "@cloudflare/vite-plugin";
import vinext from "vinext";
import { kvDataAdapter } from "@vinext/cloudflare/cache/kv-data-adapter";
import { defineConfig } from "vite";
import { execSync } from "child_process";
import fs from "fs";
import path from "path";

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

export default defineConfig({
  plugins: [
    vinext({
      cache: {
        data: kvDataAdapter(),
      },
    }),
    cloudflare({
      viteEnvironment: { name: "rsc", childEnvironments: ["ssr"] },
    }),
  ],
});
