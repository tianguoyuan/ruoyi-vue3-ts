import { request } from '@/utils/request'

// 查询菜单列表
export function listMenu(): Promise<Record<string, any>> {
	return request({
		url: '/system/menu/list',
		method: 'get'
	})
}

// 修改代码生成信息
export function updateGenTable(data): Promise<API.BaseRes> {
	return request({
		url: '/tool/gen',
		method: 'put',
		data: data
	})
}
