import type { Router } from 'vue-router'
import Storage from '@/utils/storage'
import defaultSettings from '@/settings'
import NProgress from '@/plugins/nprogress'
import { useUserStoreWidthOut } from '@/store/user'
import { to as apiTo } from 'await-to-js'
import { ElMessage } from 'element-plus'
import { usePermissionStoreWidthOut } from '@/store/permission'
import { isExternal } from '@/utils/is'

export function setupPermission(router: Router) {
	const whiteList = ['/login'] // no redirect whitelist

	router.beforeEach(async (to, _from, next) => {
		NProgress.start()
		// 设置页面标题
		document.title = `${to.meta?.title} - ${defaultSettings.title}`
		const userStore = useUserStoreWidthOut()
		const permissionStore = usePermissionStoreWidthOut()

		const hasToken = Storage.get('token')
		if (hasToken) {
			if (to.path === '/login') {
				next({ path: '/' })
			} else {
				const hasRoles = userStore.userInfo.roles && userStore.userInfo.roles.length > 0
				if (hasRoles) {
					next()
					NProgress.done()
				} else {
					const [err, result] = await apiTo(userStore.getUserInfo())
					if (err || !result) {
						userStore.resetUserInfo()
						ElMessage.error(err || '获取用户信息失败')
						next({
							path: '/login',
							query: {
								...to.query,
								redirect: to.path
							}
						})
					} else {
						const { roles, routes } = result
						// 前端过滤权限路由
						// const accessedRoutes = permissionStore.generateRoutesByFront(roles)
						// 后端过滤权限路由
						const accessedRoutes = permissionStore.generateRoutesByBackend(routes)
						accessedRoutes.forEach(route => {
							if (!isExternal(route.path)) {
								router.addRoute(route)
							}
						})
						next({
							...to,
							replace: true
						})
					}
				}
			}
		} else {
			if (whiteList.includes(to.path)) {
				next()
				NProgress.done()
			} else {
				next({
					path: '/login',
					query: {
						redirect: to.path,
						...to.query
					}
				})
				NProgress.done()
			}
		}
	})
	router.afterEach(() => {})
}
