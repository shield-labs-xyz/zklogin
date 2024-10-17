import { sveltekit } from "@sveltejs/kit/vite";
import fs from "node:fs";
import path from "node:path";
import copy from "rollup-plugin-copy";
import { defineConfig, type Plugin, type UserConfig } from "vite";
import { kitRoutes } from "vite-plugin-kit-routes";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import resolve from "vite-plugin-resolve";

export default defineConfig({
  plugins: [
    kitRoutes(),
    sveltekit(),
    copy({
      targets: [
        { src: "node_modules/**/*.wasm", dest: "node_modules/.vite/dist" },
      ],
      copySync: true,
      hook: "buildStart",
    }),
    wasmContentTypePlugin(),
    process.env.NODE_ENV === "production"
      ? resolve({
          // `unreachable` error in wasm is caused by incorrect version of bb.js. Consult pnpm-lock.yaml
          "@aztec/bb.js": `export * from "https://unpkg.com/@aztec/bb.js@0.55.0/dest/browser/index.js"`,
        })
      : undefined,
    nodePolyfills({ include: ["path"] }),
  ],
  build: {
    target: "esnext",
  },
  optimizeDeps: {
    esbuildOptions: {
      target: "esnext",
    },
  },
} satisfies UserConfig);

function wasmContentTypePlugin(): Plugin {
  return {
    name: "wasm-content-type-plugin",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url!.endsWith(".wasm")) {
          res.setHeader("Content-Type", "application/wasm");
          const newPath = req.url!.replace("deps", "dist");
          const targetPath = path.join(__dirname, newPath);
          const wasmContent = fs.readFileSync(targetPath);
          return res.end(wasmContent);
        }
        next();
      });
    },
  };
}
