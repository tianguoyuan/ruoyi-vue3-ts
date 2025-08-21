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
		url: '/system/config/list',
		method: 'get',
		params: apiParams
	})
}

// 查询参数详细
export function getConfig(configId) {
	return request({
		url: '/system/config/' + configId,
		method: 'get'
	})
}

// 根据参数键名查询参数值
export function getConfigKey(configKey: string) {
	return request({
		url: '/system/config/configKey/' + configKey,
		method: 'get'
	})
}

// 新增参数配置
export function addConfig(data) {
	return request({
		url: '/system/config',
		method: 'post',
		data: data
	})
}

// 修改参数配置
export function updateConfig(data) {
	return request({
		url: '/system/config',
		method: 'put',
		data: data
	})
}

// 删除参数配置
export function delConfig(configId) {
	return request({
		url: '/system/config/' + configId,
		method: 'delete'
	})
}

// 刷新参数缓存
export function refreshCache() {
	return request({
		url: '/system/config/refreshCache',
		method: 'delete'
	})
}

// 导出
export function configExport(data) {
	return request({
		url: '/system/config/export',
		method: 'post',
		data,
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		responseType: 'blob'
	})
}
