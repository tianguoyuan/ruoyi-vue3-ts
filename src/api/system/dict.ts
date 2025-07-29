import { request } from '@/utils/request'
// 获取字典选择框列表
export function optionselect(): Promise<API.IOptionselect> {
	return request({
		url: '/system/dict/type/optionselect',
		method: 'get'
	})
}

// 查询表详细信息
export function getGenTable(tableId: string): Promise<API.IGetGenTableRes> {
	return request({
		url: '/tool/gen/' + tableId,
		method: 'get'
	})
}
