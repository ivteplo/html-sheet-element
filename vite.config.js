//
// Copyright (c) 2022-2025 Ivan Teplov
// Licensed under the Apache license 2.0
//

import { defineConfig } from "vite"
import dtsPlugin from "vite-plugin-dts"

import { resolve } from "path"

export default defineConfig({
	css: {
		modules: {
			localsConvention: "camelCase"
		}
	},
	build: {
		outDir: resolve(__dirname, "./build/"),
		minify: false,
		cssMinify: false,
		lib: {
			entry: resolve(__dirname, "./library/index.js"),
			name: "SheetElement",
			fileName: "index",
		},
		cssCodeSplit: true,
		rollupOptions: {
			// make sure to externalize deps that shouldn't be bundled
			// into your library
			external: [],
			output: {
				exports: "named",
			}
		}
	},
	plugins: [
		dtsPlugin({
			rollupTypes: true
		})
	]
})
