// main.ts

// 如果您正在使用CDN引入，请删除下面一行。
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import type { ISizeEnumType } from '@/enums/SizeEnum'
import { useAppStoreWithOut } from '@/store/app'
import type { App } from 'vue'

export function setupElementUI(app: App) {
	const appStore = useAppStoreWithOut()
	app.use(ElementPlus, {
		size: (appStore.size || 'default') as ISizeEnumType
	})
	// for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
	// 	app.component(key, component)
	// }
}
