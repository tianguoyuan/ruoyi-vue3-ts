import { request } from '@/utils/request'

export const captchaImage = (): Promise<API.ICaptchaImageRes> => {
	return request({ url: '/captchaImage', method: 'GET' })
}

export const login = (data: API.ILogin): Promise<API.ILoginRes> => {
	return request({
		url: '/login',
		method: 'POST',
		data
	})
}

export const getUserInfo = (): Promise<API.IUserInfoRes> => {
	return request({ url: '/getInfo', method: 'GET' })
}

export const userLogout = (): Promise<null> => {
	return request({ url: '/logout', method: 'POST' })
}
