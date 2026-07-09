import { request } from '@/utils/request'

// 查询用户信息
export function systemUserProfile(): Promise<any> {
	return request({
		method: 'get',
		url: '/system/user/profile'
	})
}
// 修改用户个人信息
export function updateUserProfile(data: API.IUpdateUserProfile): Promise<void> {
	return request({
		data: data,
		method: 'put',
		url: '/system/user/profile'
	})
}
// 用户密码重置
export function updateUserPwd(oldPassword, newPassword) {
	const data = {
		newPassword,
		oldPassword
	}
	return request({
		data: data,
		method: 'put',
		url: '/system/user/profile/updatePwd'
	})
}

// 用户头像上传
export function uploadAvatar(data: API.IUploadAvatar): Promise<{ imgUrl: string }> {
	return request({
		data: data,
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		method: 'post',
		url: '/system/user/profile/avatar'
	})
}

// 用户状态修改
export function changeUserStatus(userId, status) {
	const data = {
		status,
		userId
	}
	return request({
		data: data,
		method: 'put',
		url: '/system/user/changeStatus'
	})
}

// 查询用户个人信息
export function getUserProfile() {
	return request({
		method: 'get',
		url: '/system/user/profile'
	})
}

// 查询授权角色
export function getAuthRole(userId) {
	return request({
		method: 'get',
		url: '/system/user/authRole/' + userId
	})
}

// 保存授权角色
export function updateAuthRole(data) {
	return request({
		method: 'put',
		params: data,
		url: '/system/user/authRole'
	})
}

// 查询部门下拉树结构
export function deptTreeSelect() {
	return request({
		method: 'get',
		url: '/system/user/deptTree'
	})
}

// 查询用户列表
export function listUser(params) {
	// daterange
	let apiParams = { ...params }
	if (params.daterange) {
		apiParams['params[beginTime]'] = params.daterange[0]
		apiParams['params[endTime]'] = params.daterange[1]

		delete apiParams.daterange
	}
	return request({
		method: 'get',
		params: apiParams,
		url: '/system/user/list'
	})
}

// 查询用户详细
export function getUser(userId: string = '') {
	return request({
		method: 'get',
		url: '/system/user/' + userId
	})
}

// 新增用户
export function addUser(data) {
	return request({
		data: data,
		method: 'post',
		url: '/system/user'
	})
}

// 修改用户
export function updateUser(data) {
	return request({
		data: data,
		method: 'put',
		url: '/system/user'
	})
}

// 删除用户
export function delUser(userId) {
	return request({
		method: 'delete',
		url: '/system/user/' + userId
	})
}

// 用户密码重置
export function resetUserPwd(userId, password) {
	const data = {
		password,
		userId
	}
	return request({
		data: data,
		method: 'put',
		url: '/system/user/resetPwd'
	})
}

// 用户管理导出
export function userExport(data) {
	return request({
		data,
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		method: 'post',
		responseType: 'blob',
		url: '/system/user/export'
	})
}

// 用户管理导入地址
export const USER_UPLOAD_URL = import.meta.env.VITE_API_URL + '/system/user/importData'
// 下载地址
export function userImportTemplate() {
	return request({
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		method: 'post',
		responseType: 'blob',
		url: '/system/user/importTemplate'
	})
}
