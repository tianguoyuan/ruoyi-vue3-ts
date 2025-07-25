import Layout from '@/layout/index.vue'
import { useUserStoreWidthOut } from '@/store/user'
import type { RouteRecordRaw } from 'vue-router'

const modules = import.meta.glob('/src/views/**/*.vue')

/**
 * @desc 路由表过滤后有权限的
 * @param routes - string[] - 接口返回路由表
 */
export function filterAsyncRoutes(routes: RouteRecordRaw[]) {
	const res: any[] = []
	routes.forEach(route => {
		const r = { ...route }
		if (r.meta?.permissions && checkPermission(r.meta?.permissions)) {
			if (r.children) {
				r.children = filterAsyncRoutes(r.children)
			}
			res.push(r)
		} else if (r.meta?.roles && checkRole(r.meta?.roles)) {
			if (r.children) {
				r.children = filterAsyncRoutes(r.children)
			}
			res.push(r)
		} else if (!r.meta?.permissions && !r.meta?.roles) {
			res.push(r)
		}
	})
	return res
}

/**
 * @desc 转换为前端可用路由表
 */
export function formatRoutes(routes: any[]) {
	return routes.map(route => {
		const tmp = { ...route }
		if (route.component === 'Layout') {
			tmp.component = Layout
		} else {
			tmp.component = modules[`/src/views/${route.component}.vue`]
		}
		if (tmp.children && tmp.children.length) {
			tmp.children = formatRoutes(tmp.children)
		}
		return tmp
	})
}

/**
 * @desc 字符权限校验 - v-if="checkPermission(['admin'])"
 * @param value - string[] - 权限['system:user:add','system:user:edit']
 */
export function checkPermission(permissionRoles: string[]): boolean {
	const userStore = useUserStoreWidthOut()

	const allPermission = '*:*:*'
	if (userStore.userInfo.permissions.includes(allPermission)) return true

	if (permissionRoles && permissionRoles instanceof Array && permissionRoles.length > 0) {
		const userRoles = userStore.userInfo.permissions
		return userRoles.some(role => permissionRoles.includes(role))
	} else {
		return false
	}
}

/**
 * @desc 角色权限校验 - v-if="checkRole(['admin'])"
 * @param value - string[] - 权限['admin','edit']
 */
export function checkRole(roles: string[]): boolean {
	const userStore = useUserStoreWidthOut()
	const superAdmin = 'admin'

	if (userStore.userInfo.roles.includes(superAdmin)) return true

	if (roles && roles instanceof Array && roles.length > 0) {
		const userRoles = userStore.userInfo.roles
		return userRoles.some(role => roles.includes(role))
	} else {
		return false
	}
}
