import { request } from '@/utils/request'

// 查询用户信息
export const systemUserProfile = (): Promise<any> => {
	return request({ url: '/system/user/profile', method: 'GET' })
}
// 修改用户个人信息
export function updateUserProfile(data: API.IUpdateUserProfile): Promise<void> {
	return request({
		url: '/system/user/profile',
		method: 'PUT',
		data: data
	})
}
// 用户密码重置
export function updateUserPwd(oldPassword, newPassword) {
	const data = {
		oldPassword,
		newPassword
	}
	return request({
		url: '/system/user/profile/updatePwd',
		method: 'PUT',
		data: data
	})
}

// 用户头像上传
export function uploadAvatar(data: API.IUploadAvatar): Promise<{ imgUrl: string }> {
	return request({
		url: '/system/user/profile/avatar',
		method: 'POST',
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		data: data
	})
}
