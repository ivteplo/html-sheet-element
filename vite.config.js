// Copyright (c) 2022-2023 Ivan Teplov

import { defineConfig } from "vite"
import { resolve } from "path"

export default defineConfig({
  build: {
    outDir: resolve(__dirname, "./build/"),
    lib: {
      entry: resolve(__dirname, "./library/index.js"),
      name: "BottomSheet",
      fileName: "index"
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: []
    }
  }
})
