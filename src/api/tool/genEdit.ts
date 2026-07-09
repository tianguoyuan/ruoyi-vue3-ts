import { request } from '@/utils/request'

// 查询菜单列表
export function listMenu(): Promise<Record<string, any>> {
	return request({
		method: 'get',
		url: '/system/menu/list'
	})
}

// 修改代码生成信息
export function updateGenTable(data): Promise<API.BaseRes> {
	return request({
		data: data,
		method: 'put',
		url: '/tool/gen'
	})
}
