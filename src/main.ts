import '@/styles/index.scss'
import '@unocss/reset/tailwind.css'
import 'animate.css'
import svgIds from 'virtual:svg-icons-names'
import 'virtual:svg-icons-register'
import 'virtual:uno.css'
import { createApp } from 'vue'

import { setupI18n } from '@/languages'
import { setupElementUI } from '@/plugins/elementUI'

import App from './App.vue'
import { setupRouter } from './router'
import { setupStore } from './store'

console.log('svgIds', svgIds)

console.log('环境变量 import.meta.env', import.meta.env)

async function bootstrap() {
	const app = createApp(App)
	// element-ui
	setupElementUI(app)
	// 挂载状态管理
	setupStore(app)
	// vue i18n
	setupI18n(app)
	// 挂载路由
	setupRouter(app)
	app.mount('#app')
}
bootstrap()
