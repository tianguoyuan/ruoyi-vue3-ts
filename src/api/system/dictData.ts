import { request } from '@/utils/request'

// 查询字典数据列表
export function listData(query) {
	return request({
		method: 'get',
		params: query,
		url: '/system/dict/data/list'
	})
}

// 查询字典数据详细
export function getData(dictCode) {
	return request({
		method: 'get',
		url: '/system/dict/data/' + dictCode
	})
}

// 根据字典类型查询字典数据信息
export function getDicts(dictType) {
	return request({
		method: 'get',
		url: '/system/dict/data/type/' + dictType
	})
}

// 新增字典数据
export function addData(data) {
	return request({
		data: data,
		method: 'post',
		url: '/system/dict/data'
	})
}

// 修改字典数据
export function updateData(data) {
	return request({
		data: data,
		method: 'put',
		url: '/system/dict/data'
	})
}

// 删除字典数据
export function delData(dictCode) {
	return request({
		method: 'delete',
		url: '/system/dict/data/' + dictCode
	})
}

// 导出
export function dataExport(data) {
	return request({
		data,
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		method: 'post',
		responseType: 'blob',
		url: '/system/dict/data/export'
	})
}
