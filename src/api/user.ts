import { request } from '@/utils/request'

export function captchaImage(): Promise<API.ICaptchaImageRes> {
	return request({
		url: '/captchaImage',
		method: 'get'
	})
}

export function login(data: API.ILogin): Promise<API.ILoginRes> {
	return request({
		url: '/login',
		method: 'post',
		data
	})
}

export function getUserInfo(): Promise<API.IUserInfoRes> {
	return request({
		url: '/getInfo',
		method: 'get'
	})
}

export function userLogout(): Promise<null> {
	return request({
		url: '/logout',
		method: 'get'
	})
}
