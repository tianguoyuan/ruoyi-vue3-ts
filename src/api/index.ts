import { http } from '@/utils/request'

const { request } = http
export const login = (data: API.ILogin): Promise<API.ILoginRes> => {
	return request({ url: '/auth/login', method: 'POST', data })
}

export const getUserInfo = (data: API.IUserInfo): Promise<API.IUserInfoRes> => {
	return request({ url: '/auth/userInfo', method: 'POST', data })
}

export const userLogout = (): Promise<void> => {
	return request({ url: '/auth/logout', method: 'POST' })
}

export const demoList = (data: API.IDemoList): Promise<API.IDemoListRes> => {
	return request({ url: '/demo/list', method: 'POST', data })
}
