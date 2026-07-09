import { buildTree } from '@/utils'
import { request } from '@/utils/request'

// 查询部门列表
export function listDept(query) {
	return new Promise(resolve => {
		request({
			method: 'get',
			params: query,
			url: '/system/dept/list'
		}).then(data => {
			const list = buildTree(data.data, 0, 'deptId', 'parentId', 'children')
			resolve({ rows: list })
		})
	})
}

// 查询部门列表（排除节点）
export function listDeptExcludeChild(deptId) {
	return request({
		method: 'get',
		url: '/system/dept/list/exclude/' + deptId
	})
}

// 查询部门详细
export function getDept(deptId) {
	return request({
		method: 'get',
		url: '/system/dept/' + deptId
	})
}

// 新增部门
export function addDept(data) {
	return request({
		data: data,
		method: 'post',
		url: '/system/dept'
	})
}

// 修改部门
export function updateDept(data) {
	return request({
		data: data,
		method: 'put',
		url: '/system/dept'
	})
}

// 删除部门
export function delDept(deptId) {
	return request({
		method: 'delete',
		url: '/system/dept/' + deptId
	})
}
