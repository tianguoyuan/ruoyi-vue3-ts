import { defineStore } from 'pinia'
import { store } from '.'
import { ref } from 'vue'
import { login as loginApi, getUserInfo as getUserInfoApi, userLogout } from '@/api/user'
import Storage from '@/utils/storage'
import to from 'await-to-js'
import { getRouters } from '@/api/menu'
interface IUserInfo extends API.IUserInfoRes {
	token: string
}

export const useUserStore = defineStore('user', () => {
	const userInfoDefault = {
		token: Storage.get('token') || '',
		avatar: '',
		introduction: '',
		name: '',
		roles: [] as string[],
		permissions: [] as string[],
		routes: [], // 存储后端返回的路由
		isDefaultModifyPwd: false,
		isPasswordExpired: false
	}
	const userInfo = ref({ ...userInfoDefault })

	async function login(data: API.ILogin) {
		const result = await loginApi(data)
		userInfo.value.token = result.token
		Storage.set('token', result.token)
	}

	async function getUserInfo() {
		const [userResult, routesResult] = await Promise.all([getUserInfoApi(), getRouters()])
		userInfo.value.isDefaultModifyPwd = userResult.isDefaultModifyPwd
		userInfo.value.isPasswordExpired = userResult.isDefaultModifyPwd
		userInfo.value.roles = userResult.roles
		userInfo.value.permissions = userResult.permissions
		userInfo.value.avatar = userResult.user.avatar || 'https://foruda.gitee.com/images/1723603502796844527/03cdca2a_716974.gif'
		userInfo.value.name = userResult.user.nickName

		userInfo.value.routes = routesResult.data || []

		// userInfo.value.avatar = result.user.avatar
		// userInfo.value.introduction = ''
		// userInfo.value.name = result.user.nickName
		// userInfo.value.roles = result.roles
		// return result

		return {
			...userInfo.value
		}
	}
	function resetUserInfo() {
		Storage.remove('token')
		userInfo.value = { ...userInfoDefault, token: '' }
	}
	async function logout() {
		await userLogout()
		resetUserInfo()
	}

	return { userInfo, login, getUserInfo, resetUserInfo, logout }
})

export function useUserStoreWidthOut() {
	return useUserStore(store)
}
