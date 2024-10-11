import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig, type UserConfig } from "vite";
import { kitRoutes } from "vite-plugin-kit-routes";

export default defineConfig({
  plugins: [kitRoutes(), sveltekit()],
  build: {
    target: "esnext",
  },
  optimizeDeps: {
    esbuildOptions: {
      target: "esnext",
    },
  },
} satisfies UserConfig);
