import { request } from '@/utils/request'

// 查询字典类型列表
export function listType(params) {
	let apiParams = { ...params }
	if (params.daterange) {
		apiParams['params[beginTime]'] = params.daterange[0]
		apiParams['params[endTime]'] = params.daterange[1]

		delete apiParams.daterange
	}
	return request({
		method: 'get',
		params: apiParams,
		url: '/system/dict/type/list'
	})
}

// 查询字典类型详细
export function getType(dictId) {
	return request({
		method: 'get',
		url: '/system/dict/type/' + dictId
	})
}

// 新增字典类型
export function addType(data) {
	return request({
		data: data,
		method: 'post',
		url: '/system/dict/type'
	})
}

// 修改字典类型
export function updateType(data) {
	return request({
		data: data,
		method: 'put',
		url: '/system/dict/type'
	})
}

// 删除字典类型
export function delType(dictId) {
	return request({
		method: 'delete',
		url: '/system/dict/type/' + dictId
	})
}

// 刷新字典缓存
export function refreshCache() {
	return request({
		method: 'delete',
		url: '/system/dict/type/refreshCache'
	})
}

// 获取字典选择框列表
export function optionselect() {
	return request({
		method: 'get',
		url: '/system/dict/type/optionselect'
	})
}

// 导出
export function typeExport(data) {
	return request({
		data,
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		method: 'post',
		responseType: 'blob',
		url: '/system/dict/type/export'
	})
}
