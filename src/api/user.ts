import { request } from '@/utils/request'

export function captchaImage(): Promise<API.ICaptchaImageRes> {
	return request({
		method: 'get',
		url: '/captchaImage'
	})
}

export function login(data: API.ILogin): Promise<API.ILoginRes> {
	return request({
		data,
		method: 'post',
		url: '/login'
	})
}

export function getUserInfo(): Promise<API.IUserInfoRes> {
	return request({
		method: 'get',
		url: '/getInfo'
	})
}

export function userLogout(): Promise<null> {
	return request({
		method: 'get',
		url: '/logout'
	})
}
