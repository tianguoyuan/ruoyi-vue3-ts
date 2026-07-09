import dayjs from 'dayjs'
import { resolve } from 'path'
import { defineConfig, loadEnv, type ConfigEnv, type UserConfig } from 'vite'

import { wrapperEnv } from './build/getEnv'
import { createVitePlugins } from './build/plugins'
import { createProxy } from './build/proxy'
import pkg from './package.json'

const { dependencies, devDependencies, engines, name, version } = pkg
const __APP_INFO__ = {
	lastBuildTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
	pkg: {
		dependencies,
		devDependencies,
		engines,
		name,
		version
	}
}

// @see: https://vitejs.dev/config/
export default defineConfig(({ mode }: ConfigEnv): UserConfig => {
	const root = process.cwd()
	const env = loadEnv(mode, root)
	const viteEnv = wrapperEnv(env)

	return {
		base: viteEnv.VITE_PUBLIC_PATH,
		build: {
			// 规定触发警告的 chunk 大小
			chunkSizeWarningLimit: 2000,
			minify: 'esbuild',
			outDir: 'dist',
			// 禁用 gzip 压缩大小报告，可略微减少打包时间
			reportCompressedSize: false,
			rollupOptions: {
				output: {
					assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
					// Static resource classification and packaging
					chunkFileNames: 'assets/js/[name]-[hash].js',
					entryFileNames: 'assets/js/[name]-[hash].js'
				}
			},
			// esbuild 打包更快，但是不能去除 console.log，terser打包慢，但能去除 console.log
			// minify: "terser",
			// terserOptions: {
			// 	compress: {
			// 		drop_console: viteEnv.VITE_DROP_CONSOLE,
			// 		drop_debugger: true
			// 	}
			// },
			sourcemap: false
		},
		css: {
			preprocessorOptions: {
				scss: {
					additionalData: `@import "@/styles/variables.scss";`
				}
			}
		},
		define: {
			__APP_INFO__: JSON.stringify(__APP_INFO__)
		},
		esbuild: {
			pure: viteEnv.VITE_DROP_CONSOLE ? ['console.log', 'debugger'] : []
		},
		optimizeDeps: {
			include: ['element-plus/es', '@element-plus/icons-vue']
		},
		plugins: createVitePlugins(viteEnv),
		resolve: {
			alias: {
				'@': resolve(__dirname, './src'),
				'/#/': resolve(__dirname, './src/types'),
				'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js'
			}
		},
		root,
		server: {
			cors: true,
			host: '0.0.0.0',
			open: viteEnv.VITE_OPEN,
			port: viteEnv.VITE_PORT,
			// Load proxy configuration from .env.development
			proxy: createProxy(viteEnv.VITE_PROXY)
		}
	}
})
