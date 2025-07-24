import { createI18n } from 'vue-i18n'
import { getBrowserLang } from '@/utils'

import zhCN from './modules/zh-CN'
import en from './modules/en'
import Storage from '@/utils/storage'
import type { App } from 'vue'

const i18n = createI18n({
	// Use Composition API, Set to false
	allowComposition: true,
	legacy: false,
	locale: Storage.get('lang') || getBrowserLang(),
	messages: {
		'zh-CN': zhCN,
		en
	}
})

export function setupI18n(app: App) {
	app.use(i18n)
}

export default i18n
