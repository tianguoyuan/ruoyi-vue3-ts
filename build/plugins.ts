import { resolve } from 'path'
import { type PluginOption } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import { createHtmlPlugin } from 'vite-plugin-html'
import { visualizer } from 'rollup-plugin-visualizer'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import eslintPlugin from 'vite-plugin-eslint'
import viteCompression from 'vite-plugin-compression'
import vueSetupExtend from 'unplugin-vue-setup-extend-plus/vite'
import UnoCSS from 'unocss/vite'
// https://devtools-next.vuejs.org/
import VueDevTools from 'vite-plugin-vue-devtools'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import IconsResolver from 'unplugin-icons/resolver'
import mockDevServerPlugin from 'vite-plugin-mock-dev-server'

/**
 * 创建 vite 插件
 * @param viteEnv
 */
export function createVitePlugins(viteEnv: ViteEnv): (PluginOption | PluginOption[])[] {
	const { VITE_GLOB_APP_TITLE, VITE_REPORT, VITE_PWA, VITE_MOCK_DEV_SERVER } = viteEnv

	return [
		VueDevTools(),
		vue(),
		// vue 可以使用 jsx/tsx 语法
		vueJsx(),
		// esLint 报错信息显示在浏览器界面上
		eslintPlugin({
			cache: false,
			include: ['src/**/*.vue', 'src/**/*.ts', 'src/**/*.tsx'] // 检查的文件
		}),
		// name 可以写在 script 标签上
		vueSetupExtend({}),
		// 创建打包压缩配置
		createCompression(viteEnv),
		// 注入变量到 html 文件
		createHtmlPlugin({
			minify: true,
			viteNext: true,
			inject: {
				data: { title: VITE_GLOB_APP_TITLE }
			}
		}),
		// 使用 svg 图标
		createSvgIconsPlugin({
			iconDirs: [resolve(process.cwd(), 'src/assets/icons')],
			symbolId: 'icon-[dir]-[name]'
		}),
		// vitePWA
		VITE_PWA && createVitePwa(viteEnv),
		// 是否生成包预览，分析依赖包大小做优化处理
		VITE_REPORT &&
			(visualizer({
				filename: 'stats.html',
				gzipSize: true,
				brotliSize: true
			}) as PluginOption),
		// unocss
		UnoCSS(),
		AutoImport({
			// 自动导入 Vue 相关函数，如：ref, reactive, toRef 等
			imports: ['vue', '@vueuse/core', 'pinia', 'vue-router', 'vue-i18n'],
			resolvers: [
				// 自动导入 Element Plus 相关函数，如：ElMessage, ElMessageBox... (带样式)
				ElementPlusResolver(),
				// 自动导入图标组件
				IconsResolver({})
			],
			eslintrc: {
				// 是否自动生成 eslint 规则，建议生成之后设置 false
				enabled: true,
				// 指定自动导入函数 eslint 规则的文件
				filepath: './.eslintrc-auto-import.json',
				globalsPropValue: true
			},
			// 是否在 vue 模板中自动导入
			vueTemplate: true,
			// 指定自动导入函数TS类型声明文件路径 (false:关闭自动生成)
			dts: true
			// dts: "src/types/auto-imports.d.ts",
		}),
		Components({
			resolvers: [
				// 自动导入 Element Plus 组件
				ElementPlusResolver(),
				// 自动注册图标组件
				IconsResolver({
					// element-plus图标库，其他图标库 https://icon-sets.iconify.design/
					enabledCollections: ['ep']
				})
			],
			// 指定自定义组件位置(默认:src/components)
			dirs: ['src/components'],
			// 指定自动导入组件TS类型声明文件路径 (false:关闭自动生成)
			dts: true
			// dts: "src/types/components.d.ts",
		}),
		// MOCK 服务
		VITE_MOCK_DEV_SERVER ? mockDevServerPlugin() : null
	]
}

/**
 * @description 根据 compress 配置，生成不同的压缩规则
 * @param viteEnv
 */
function createCompression(viteEnv: ViteEnv): PluginOption | PluginOption[] {
	const { VITE_BUILD_COMPRESS = 'none', VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE } = viteEnv
	const compressList = VITE_BUILD_COMPRESS.split(',')
	const plugins: PluginOption[] = []
	if (compressList.includes('gzip')) {
		plugins.push(
			viteCompression({
				ext: '.gz',
				algorithm: 'gzip',
				deleteOriginFile: VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE
			})
		)
	}
	if (compressList.includes('brotli')) {
		plugins.push(
			viteCompression({
				ext: '.br',
				algorithm: 'brotliCompress',
				deleteOriginFile: VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE
			})
		)
	}
	return plugins
}

/**
 * @description VitePwa
 * @param viteEnv
 */
function createVitePwa(viteEnv: ViteEnv): PluginOption | PluginOption[] {
	const { VITE_GLOB_APP_TITLE } = viteEnv
	return VitePWA({
		registerType: 'autoUpdate',
		manifest: {
			name: VITE_GLOB_APP_TITLE,
			// eslint-disable-next-line camelcase
			short_name: VITE_GLOB_APP_TITLE,
			// eslint-disable-next-line camelcase
			theme_color: '#ffffff',
			icons: [
				{
					src: '/logo.png',
					sizes: '192x192',
					type: 'image/png'
				},
				{
					src: '/logo.png',
					sizes: '512x512',
					type: 'image/png'
				},
				{
					src: '/logo.png',
					sizes: '512x512',
					type: 'image/png',
					purpose: 'any maskable'
				}
			]
		}
	})
}
