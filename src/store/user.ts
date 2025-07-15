import { defineStore } from 'pinia'
import { store } from '.'
import { ref } from 'vue'
import { login as loginApi, getUserInfo as getUserInfoApi, userLogout } from '@/api'
import Storage from '@/utils/storage'
interface IUserInfo extends API.IUserInfoRes {
	token: string
}

export const useUserStore = defineStore('user', () => {
	const userInfoDefault = {
		token: Storage.get('token') || '',
		avatar: '',
		introduction: '',
		name: '',
		roles: [],
		routes: [] // 存储后端返回的路由
	}
	const userInfo = ref<IUserInfo>({ ...userInfoDefault })

	async function login(data: API.ILogin) {
		const result = await loginApi(data)
		userInfo.value.token = result.token
		Storage.set('token', result.token)
	}

	async function getUserInfo() {
		const result = await getUserInfoApi({ token: userInfo.value.token })
		userInfo.value.avatar = result.avatar
		userInfo.value.introduction = result.introduction
		userInfo.value.name = result.name
		userInfo.value.roles = result.roles
		return result
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
