import { request } from '@/utils/request'

// 查询用户信息
export function systemUserProfile(): Promise<any> {
	return request({
		url: '/system/user/profile',
		method: 'get'
	})
}
// 修改用户个人信息
export function updateUserProfile(data: API.IUpdateUserProfile): Promise<void> {
	return request({
		url: '/system/user/profile',
		method: 'put',
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
		method: 'put',
		data: data
	})
}

// 用户头像上传
export function uploadAvatar(data: API.IUploadAvatar): Promise<{ imgUrl: string }> {
	return request({
		url: '/system/user/profile/avatar',
		method: 'post',
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		data: data
	})
}
