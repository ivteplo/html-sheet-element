// Copyright (c) 2022-2023 Ivan Teplov

import { defineConfig } from "vite"
import { resolve } from "path"

export default defineConfig({
  root: __dirname,
  build: {
    outDir: resolve(__dirname, "./build/"),
    rollupOptions: {
      input: resolve(__dirname, "./index.html")
    }
  }
})
