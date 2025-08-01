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
		userInfo.value.routes = routesResult.data || []

		/* 初始密码提示 */
		if (userResult.isDefaultModifyPwd) {
			ElMessageBox.confirm('您的密码还是初始密码，请修改密码！', '安全提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				router.push({
					path: '/system/user/profile',
					query: { activeTab: 'resetPwd' }
				})
			})
		}
		/* 过期密码提示 */
		if (!userResult.isDefaultModifyPwd && userResult.isPasswordExpired) {
			ElMessageBox.confirm('您的密码已过期，请尽快修改密码！', '安全提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				router.push({
					path: '/system/user/profile',
					query: { activeTab: 'resetPwd' }
				})
			})
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
