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

// 用户状态修改
export function changeUserStatus(userId, status) {
	const data = {
		userId,
		status
	}
	return request({
		url: '/system/user/changeStatus',
		method: 'put',
		data: data
	})
}

// 查询用户个人信息
export function getUserProfile() {
	return request({
		url: '/system/user/profile',
		method: 'get'
	})
}

// 查询授权角色
export function getAuthRole(userId) {
	return request({
		url: '/system/user/authRole/' + userId,
		method: 'get'
	})
}

// 保存授权角色
export function updateAuthRole(data) {
	return request({
		url: '/system/user/authRole',
		method: 'put',
		params: data
	})
}

// 查询部门下拉树结构
export function deptTreeSelect() {
	return request({
		url: '/system/user/deptTree',
		method: 'get'
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
		url: '/system/user/list',
		method: 'get',
		params: apiParams
	})
}

// 查询用户详细
export function getUser(userId) {
	return request({
		url: '/system/user/' + userId,
		method: 'get'
	})
}

// 新增用户
export function addUser(data) {
	return request({
		url: '/system/user',
		method: 'post',
		data: data
	})
}

// 修改用户
export function updateUser(data) {
	return request({
		url: '/system/user',
		method: 'put',
		data: data
	})
}

// 删除用户
export function delUser(userId) {
	return request({
		url: '/system/user/' + userId,
		method: 'delete'
	})
}

// 用户密码重置
export function resetUserPwd(userId, password) {
	const data = {
		userId,
		password
	}
	return request({
		url: '/system/user/resetPwd',
		method: 'put',
		data: data
	})
}

// 用户管理导出
export function userExport(data) {
	return request({
		url: '/system/user/export',
		method: 'post',
		data,
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		responseType: 'blob'
	})
}

// 用户管理导入地址
export const USER_UPLOAD_URL = import.meta.env.VITE_API_URL + '/system/user/importData'
// 下载地址
export function userImportTemplate() {
	return request({
		url: '/system/user/importTemplate',
		method: 'post',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		responseType: 'blob'
	})
}
