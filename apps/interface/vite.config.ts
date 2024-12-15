import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

export default defineConfig(() => ({
  plugins: [sveltekit()],
  build: {
    target: "esnext",
  },
  optimizeDeps: {
    exclude: ["@noir-lang/noirc_abi", "@noir-lang/acvm_js"],
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
