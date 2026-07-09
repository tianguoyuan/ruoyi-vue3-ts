import { request } from '@/utils/request'

// 查询角色列表
export function listRole(params) {
	let apiParams = { ...params }
	if (params.daterange) {
		apiParams['params[beginTime]'] = params.daterange[0]
		apiParams['params[endTime]'] = params.daterange[1]

		delete apiParams.daterange
	}
	return request({
		method: 'get',
		params: apiParams,
		url: '/system/role/list'
	})
}

// 查询角色详细
export function getRole(roleId) {
	return request({
		method: 'get',
		url: '/system/role/' + roleId
	})
}

// 新增角色
export function addRole(data) {
	return request({
		data: data,
		method: 'post',
		url: '/system/role'
	})
}

// 修改角色
export function updateRole(data) {
	return request({
		data: data,
		method: 'put',
		url: '/system/role'
	})
}

// 角色数据权限
export function dataScope(data) {
	return request({
		data: data,
		method: 'put',
		url: '/system/role/dataScope'
	})
}

// 角色状态修改
export function changeRoleStatus(roleId, status) {
	const data = {
		roleId,
		status
	}
	return request({
		data: data,
		method: 'put',
		url: '/system/role/changeStatus'
	})
}

// 删除角色
export function delRole(roleId) {
	return request({
		method: 'delete',
		url: '/system/role/' + roleId
	})
}

// 查询角色已授权用户列表
export function allocatedUserList(query) {
	return request({
		method: 'get',
		params: query,
		url: '/system/role/authUser/allocatedList'
	})
}

// 查询角色未授权用户列表
export function unallocatedUserList(query) {
	return request({
		method: 'get',
		params: query,
		url: '/system/role/authUser/unallocatedList'
	})
}

// 取消用户授权角色
export function authUserCancel(data) {
	return request({
		data: data,
		method: 'put',
		url: '/system/role/authUser/cancel'
	})
}

// 批量取消用户授权角色
export function authUserCancelAll(data) {
	return request({
		method: 'put',
		params: data,
		url: '/system/role/authUser/cancelAll'
	})
}

// 授权用户选择
export function authUserSelectAll(data) {
	return request({
		method: 'put',
		params: data,
		url: '/system/role/authUser/selectAll'
	})
}

// 根据角色ID查询部门树结构
export function deptTreeSelect(roleId) {
	return request({
		method: 'get',
		url: '/system/role/deptTree/' + roleId
	})
}

// 导出
export function roleExport(data) {
	return request({
		data,
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		method: 'post',
		responseType: 'blob',
		url: '/system/role/export'
	})
}
