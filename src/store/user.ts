import { defineStore } from 'pinia'
import { store } from '.'
import { ref } from 'vue'
import { login as loginApi, getUserInfo as getUserInfoApi, userLogout } from '@/api/user'
import Storage from '@/utils/storage'
import { getRouters } from '@/api/menu'
import router from '@/router'

export const useUserStore = defineStore('user', () => {
	const userInfoDefault = {
		token: Storage.get('token') || '',
		avatar: '',
		introduction: '',
		name: '',
		roles: [] as string[],
		permissions: [] as string[],
		routes: [] // 存储后端返回的路由
	}
	const userInfo = ref({ ...userInfoDefault })

	async function login(data: API.ILogin) {
		const result = await loginApi(data)
		userInfo.value.token = result.token
		Storage.set('token', result.token)
	}

	async function userInfoSimple() {
		const userResult = await getUserInfoApi()
		userInfo.value.roles = userResult.roles
		userInfo.value.permissions = userResult.permissions
		userInfo.value.avatar = import.meta.env.VITE_API_URL + userResult.user.avatar
		userInfo.value.name = userResult.user.nickName
		return userResult
	}

	async function getUserInfo() {
		const [userResult, routesResult] = await Promise.all([userInfoSimple(), getRouters()])
		const backendRoutes = routesResult.data || []
		userInfo.value.routes = movePropertiesToMeta(backendRoutes)

		/* 初始密码提示 */
		if (userResult.isDefaultModifyPwd) {
			ElMessageBox.confirm('您的密码还是初始密码，请修改密码！', '安全提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			})
				.then(() => {
					router.push({
						path: '/system/user/profile',
						query: { activeTab: 'resetPwd' }
					})
				})
				.catch(() => {})
		}
		/* 过期密码提示 */
		if (!userResult.isDefaultModifyPwd && userResult.isPasswordExpired) {
			ElMessageBox.confirm('您的密码已过期，请尽快修改密码！', '安全提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
				closeOnClickModal: false
			})
				.then(() => {
					router.push({
						path: '/system/user/profile',
						query: { activeTab: 'resetPwd' }
					})
				})
				.catch(() => {})
		}

		return {
			...userInfo.value
		}
	}
	function resetUserInfo() {
		Storage.remove('token')
		userInfo.value = {
			...userInfoDefault,
			token: ''
		}
	}
	async function logout() {
		await userLogout()
		resetUserInfo()
	}

	function setAvatar(val: string) {
		userInfo.value.avatar = val
	}

	return {
		userInfo,
		login,
		getUserInfo,
		userInfoSimple,
		resetUserInfo,
		logout,
		setAvatar
	}
})

export function useUserStoreWidthOut() {
	return useUserStore(store)
}

/**
 * 将路由节点中的 alwaysShow 和 hidden 属性移动到 meta 对象中
 * @param {Array|Object} routes 要处理的路由配置，可以是数组或单个对象
 * @returns {Array|Object} 处理后的路由配置
 */
export function movePropertiesToMeta(routes) {
	// 如果是数组，递归处理每个元素
	if (Array.isArray(routes)) {
		return routes.map(route => movePropertiesToMeta(route))
	}

	// 如果是对象，进行处理
	if (typeof routes === 'object' && routes !== null) {
		// 创建新的对象，避免直接修改原对象
		const newRoute = { ...routes }

		// 确保 meta 对象存在
		if (!newRoute.meta) {
			newRoute.meta = {}
		}

		// 移动 hidden 属性
		if ('hidden' in newRoute) {
			newRoute.meta.hidden = newRoute.hidden
			delete newRoute.hidden
		}

		// 移动 alwaysShow 属性
		if ('alwaysShow' in newRoute) {
			newRoute.meta.alwaysShow = newRoute.alwaysShow
			delete newRoute.alwaysShow
		}

		// 递归处理子路由
		if (newRoute.children && Array.isArray(newRoute.children)) {
			newRoute.children = movePropertiesToMeta(newRoute.children)
		}

		return newRoute
	}

	// 如果不是数组也不是对象，直接返回
	return routes
}
