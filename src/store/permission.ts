import { defineStore } from 'pinia'
import { store } from '.'
import { ref } from 'vue'
import { asyncRoutes, constantRoutes, errorPageRoute, notFoundRoute } from '@/router/routes'
import { filterAsyncRoutes, formatRoutes } from '@/utils/permission'
import type { RouteRecordRaw } from 'vue-router'

export const usePermissionStore = defineStore('permission', () => {
	const addRoutes = ref<RouteRecordRaw[]>([])
	const routes = ref<RouteRecordRaw[]>([])

	// 前端过滤角色权限路由
	function generateRoutesByFront(roles: string[]): [] {
		let accessedRoutes
		if (roles.includes('admin')) {
			accessedRoutes = asyncRoutes
		} else {
			accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
		}
		accessedRoutes = accessedRoutes.concat(errorPageRoute, notFoundRoute)
		addRoutes.value = accessedRoutes
		routes.value = constantRoutes.concat(accessedRoutes)
		return accessedRoutes
	}

	// 后端过滤角色权限路由
	function generateRoutesByBackend(backendRoutes: RouteRecordRaw[]) {
		const accessedRoutes = formatRoutes(backendRoutes).concat(errorPageRoute, notFoundRoute)
		addRoutes.value = accessedRoutes
		routes.value = constantRoutes.concat(accessedRoutes)
		return accessedRoutes
	}
	return { generateRoutesByBackend, generateRoutesByFront, routes, addRoutes }
})

export function usePermissionStoreWidthOut() {
	return usePermissionStore(store)
}
