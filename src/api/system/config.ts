import { request } from '@/utils/request'

// 查询参数列表
export function listConfig(params) {
	let apiParams = { ...params }
	if (params.daterange) {
		apiParams['params[beginTime]'] = params.daterange[0]
		apiParams['params[endTime]'] = params.daterange[1]

		delete apiParams.daterange
	}
	return request({
		method: 'get',
		params: apiParams,
		url: '/system/config/list'
	})
}

// 查询参数详细
export function getConfig(configId) {
	return request({
		method: 'get',
		url: '/system/config/' + configId
	})
}

// 根据参数键名查询参数值
export function getConfigKey(configKey: string) {
	return request({
		method: 'get',
		url: '/system/config/configKey/' + configKey
	})
}

// 新增参数配置
export function addConfig(data) {
	return request({
		data: data,
		method: 'post',
		url: '/system/config'
	})
}

// 修改参数配置
export function updateConfig(data) {
	return request({
		data: data,
		method: 'put',
		url: '/system/config'
	})
}

// 删除参数配置
export function delConfig(configId) {
	return request({
		method: 'delete',
		url: '/system/config/' + configId
	})
}

// 刷新参数缓存
export function refreshCache() {
	return request({
		method: 'delete',
		url: '/system/config/refreshCache'
	})
}

// 导出
export function configExport(data) {
	return request({
		data,
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		method: 'post',
		responseType: 'blob',
		url: '/system/config/export'
	})
}
