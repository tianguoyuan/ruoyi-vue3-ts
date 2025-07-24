import { createRouter, createWebHashHistory } from 'vue-router'
import { setupPermission } from './permission'
import { constantRoutes } from './routes'
import type { App } from 'vue'

const router = createRouter({
	history: createWebHashHistory(import.meta.env.VITE_PUBLIC_PATH),
	routes: constantRoutes,
	strict: true,
	scrollBehavior: () => ({
		left: 0,
		top: 0
	})
})

export function setupRouter(app: App) {
	app.use(router)
	// 创建路由守卫
	setupPermission(router)
}

export function resetRouter(): void {
	const resetWhiteNameList = ['redirect', 'login']
	router.getRoutes().forEach(route => {
		const { name } = route
		if (name && !resetWhiteNameList.includes(name as string)) {
			router.hasRoute(name) && router.removeRoute(name)
		}
	})
}

export default router
export { constantRoutes } from './routes'
