import { defineConfig } from "vite"
import path from "node:path"
import react from "@vitejs/plugin-react"
import { viteStaticCopy } from "vite-plugin-static-copy"
import url from "node:url"

const dirname = path.dirname(url.fileURLToPath(import.meta.url))

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(dirname, "src"),
    },
  },
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          src: "src/extension/manifest.json",
          dest: ".",
        },
        {
          src: "public/*.png",
          dest: ".",
        },
      ],
    }),
  ],
  build: {
    target: "esnext",
    emptyOutDir: true,
    minify: false,
    modulePreload: {
      polyfill: false,
      resolveDependencies: () => [],
    },
    rollupOptions: {
      strictDeprecations: true,
      preserveEntrySignatures: "strict",
      input: [path.resolve(dirname, "src/extension/popup.html")],
      output: {
        minifyInternalExports: false,
        inlineDynamicImports: false,
        validate: true,
        entryFileNames: `[name].js`,
        assetFileNames: `[name].[ext]`,
        chunkFileNames: `[name].js`,
        esModule: true,
      },
    },
  },
})
