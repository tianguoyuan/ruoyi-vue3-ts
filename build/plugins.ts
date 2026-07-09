import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { resolve } from 'path'
import { visualizer } from 'rollup-plugin-visualizer'
import UnoCSS from 'unocss/vite'
// https://devtools-next.vuejs.org/
import AutoImport from 'unplugin-auto-import/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import vueSetupExtend from 'unplugin-vue-setup-extend-plus/vite'
import { type PluginOption } from 'vite'
import viteCompression from 'vite-plugin-compression'
import eslintPlugin from 'vite-plugin-eslint'
import { createHtmlPlugin } from 'vite-plugin-html'
// import IconsResolver from 'unplugin-icons/resolver'
import mockDevServerPlugin from 'vite-plugin-mock-dev-server'
import { VitePWA } from 'vite-plugin-pwa'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import VueDevTools from 'vite-plugin-vue-devtools'

/**
 * 创建 vite 插件
 * @param viteEnv
 */
export function createVitePlugins(viteEnv: ViteEnv): (PluginOption | PluginOption[])[] {
	const { VITE_GLOB_APP_TITLE, VITE_MOCK_DEV_SERVER, VITE_PWA, VITE_REPORT } = viteEnv

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
			inject: {
				data: { title: VITE_GLOB_APP_TITLE }
			},
			minify: true,
			viteNext: true
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
				brotliSize: true,
				filename: 'stats.html',
				gzipSize: true
			}) as PluginOption),
		// unocss
		UnoCSS(),
		AutoImport({
			// 指定自动导入函数TS类型声明文件路径 (false:关闭自动生成)
			dts: true,
			eslintrc: {
				// 是否自动生成 eslint 规则，建议生成之后设置 false
				enabled: true,
				// 指定自动导入函数 eslint 规则的文件
				filepath: './.eslintrc-auto-import.json',
				globalsPropValue: true
			},
			// 自动导入 Vue 相关函数，如：ref, reactive, toRef 等
			imports: ['vue', '@vueuse/core', 'pinia', 'vue-router', 'vue-i18n'],
			resolvers: [
				// 自动导入 Element Plus 相关函数，如：ElMessage, ElMessageBox... (带样式)
				ElementPlusResolver({ importStyle: false })
				// 自动导入图标组件
				// IconsResolver({})
			],
			// 是否在 vue 模板中自动导入
			vueTemplate: true
			// dts: "src/types/auto-imports.d.ts",
		}),
		Components({
			// 指定自定义组件位置(默认:src/components)
			dirs: ['src/components'],
			// 指定自动导入组件TS类型声明文件路径 (false:关闭自动生成)
			dts: true,
			resolvers: [
				// 自动导入 Element Plus 组件
				ElementPlusResolver({ importStyle: false })
				// 自动注册图标组件
				// IconsResolver({
				// 	// element-plus图标库，其他图标库 https://icon-sets.iconify.design/
				// 	enabledCollections: ['ep']
				// })
			]
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
				algorithm: 'gzip',
				deleteOriginFile: VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE,
				ext: '.gz'
			})
		)
	}
	if (compressList.includes('brotli')) {
		plugins.push(
			viteCompression({
				algorithm: 'brotliCompress',
				deleteOriginFile: VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE,
				ext: '.br'
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
		manifest: {
			icons: [
				{
					sizes: '192x192',
					src: '/logo.png',
					type: 'image/png'
				},
				{
					sizes: '512x512',
					src: '/logo.png',
					type: 'image/png'
				},
				{
					purpose: 'any maskable',
					sizes: '512x512',
					src: '/logo.png',
					type: 'image/png'
				}
			],
			name: VITE_GLOB_APP_TITLE,
			// eslint-disable-next-line camelcase
			short_name: VITE_GLOB_APP_TITLE,
			// eslint-disable-next-line camelcase
			theme_color: '#ffffff'
		},
		registerType: 'autoUpdate'
	})
}
