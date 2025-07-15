import { createApp } from 'vue'
import App from './App.vue'
import { setupRouter } from './router'
import { setupStore } from './store'
import { setupI18n } from '@/languages'

import '@unocss/reset/tailwind.css'
import 'virtual:uno.css'
import '@/styles/index.scss'
import { setupElementUI } from '@/plugins/elementUI'
// 本地SVG图标
import 'virtual:svg-icons-register'
// 过渡动画
import 'animate.css'

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
