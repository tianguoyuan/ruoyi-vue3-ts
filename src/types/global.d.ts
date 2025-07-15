/* Vite */
declare type Recordable<T = any> = Record<string, T>

interface ImportMeta {
	env: ImportMetaEnv
}
/** 环境变量 */
declare interface ViteEnv {
	VITE_USER_NODE_ENV: 'development' | 'production' | 'staging'
	VITE_GLOB_APP_TITLE: string
	VITE_PORT: number
	VITE_OPEN: boolean
	VITE_REPORT: boolean
	VITE_ROUTER_MODE: 'hash' | 'history'
	VITE_BUILD_COMPRESS: 'gzip' | 'brotli' | 'gzip,brotli' | 'none'
	VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE: boolean
	VITE_DROP_CONSOLE: boolean
	VITE_PWA: boolean
	/** 网站前缀 */
	VITE_PUBLIC_PATH: string
	/** 接口前缀 */
	VITE_API_URL: string
	/** 接口代理 */
	VITE_PROXY: [string, string][]
	/** 开启mock */
	VITE_MOCK_DEV_SERVER: boolean
}

interface ImportMetaEnv extends ViteEnv {
	__: unknown
}

/* __APP_INFO__ */
declare const __APP_INFO__: {
	pkg: {
		name: string
		version: string
		dependencies: Recordable<string>
		devDependencies: Recordable<string>
	}
	lastBuildTime: string
}

/**
 * 系统设置
 */
interface AppSettings {
	/** 系统标题 */
	title: string
	/** 系统版本 */
	version: string
	/** 是否显示设置 */
	showSettings: boolean
	/** 是否固定头部 */
	fixedHeader: boolean
	/** 是否显示多标签导航 */
	tagsView: boolean
	/** 是否显示侧边栏Logo */
	sidebarLogo: boolean
	/** 导航栏布局(left|top|mix) */
	layout: string
	/** 主题颜色 */
	themeColor: string
	/** 主题模式(dark|light) */
	theme: string
	/** 布局大小(default |large |small) */
	size: string
	/** 语言( zh-cn| en) */
	language: string
	/** 是否开启水印 */
	watermarkEnabled: boolean
	/** 水印内容 */
	watermarkContent: string
	/** 是否展示errorLog */
	needErrorLog: ViteEnv['VITE_USER_NODE_ENV'][]
}
