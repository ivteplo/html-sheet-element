//
// Copyright (c) 2022-2023 Ivan Teplov
// Licensed under the Apache license 2.0
//

import { defineConfig } from "vite"
import { resolve } from "path"

export default defineConfig({
	root: __dirname,
	css: {
		modules: {
			localsConvention: "camelCase"
		}
	},
	build: {
		outDir: resolve(__dirname, "./build/"),
		cssCodeSplit: true,
		rollupOptions: {
			input: resolve(__dirname, "./index.html")
		}
	}
})
