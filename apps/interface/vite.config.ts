import { sveltekit } from "@sveltejs/kit/vite";
import fs from "node:fs";
import path from "node:path";
import copy from "rollup-plugin-copy";
import { defineConfig, type Plugin } from "vite";
import resolve from "vite-plugin-resolve";

export default defineConfig((configEnv) => ({
  plugins: [
    sveltekit(),
    copy({
      targets: [
        { src: "node_modules/**/*.wasm", dest: "node_modules/.vite/dist" },
      ],
      copySync: true,
      hook: "buildStart",
    }),
    wasmContentTypePlugin(),
    resolve({
      util: `export const inspect = {}`,
      ...(process.env.NODE_ENV === "production" && !configEnv.isSsrBuild
        ? {
            // `unreachable` error in wasm is caused by incorrect version of bb.js. Consult pnpm-lock.yaml
            "@aztec/bb.js": `export * from "https://unpkg.com/@aztec/bb.js@0.55.0/dest/browser/index.js"`,
          }
        : {}),
    }),
  ],
  build: {
    target: "esnext",
  },
  optimizeDeps: {
    esbuildOptions: {
      target: "esnext",
    },
  },
  test: {
    hookTimeout: 99999999,
    testTimeout: 99999999,
    teardownTimeout: 99999999,
  },
}));

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
