import { buildTree } from '@/utils'
import { request } from '@/utils/request'

// 查询菜单列表
export function listMenu(query?: any) {
	// return request({
	// 	url: '/system/menu/list',
	// 	method: 'get',
	// 	params: query
	// })
	return new Promise(resolve => {
		request({
			method: 'get',
			params: query,
			url: '/system/menu/list'
		}).then(data => {
			const list = buildTree(data.data, 0, 'menuId', 'parentId', 'children')
			resolve({ rows: list })
		})
	}) as Promise<{ rows: any[] }>
}

// 查询菜单详细
export function getMenu(menuId) {
	return request({
		method: 'get',
		url: '/system/menu/' + menuId
	})
}

// 查询菜单下拉树结构
export function treeselect() {
	return request({
		method: 'get',
		url: '/system/menu/treeselect'
	})
}

// 根据角色ID查询菜单下拉树结构
export function roleMenuTreeselect(roleId) {
	return request({
		method: 'get',
		url: '/system/menu/roleMenuTreeselect/' + roleId
	})
}

// 新增菜单
export function addMenu(data) {
	return request({
		data: data,
		method: 'post',
		url: '/system/menu'
	})
}

// 修改菜单
export function updateMenu(data) {
	return request({
		data: data,
		method: 'put',
		url: '/system/menu'
	})
}

// 删除菜单
export function delMenu(menuId) {
	return request({
		method: 'delete',
		url: '/system/menu/' + menuId
	})
}
