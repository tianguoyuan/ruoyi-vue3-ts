import { request } from '@/utils/request'

// 查询操作日志列表
export function list(params) {
	let apiParams = { ...params }
	if (params.daterange) {
		apiParams['params[beginTime]'] = params.daterange[0]
		apiParams['params[endTime]'] = params.daterange[1]

		delete apiParams.daterange
	}
	return request({
		method: 'get',
		params: apiParams,
		url: '/monitor/operlog/list'
	})
}

// 删除操作日志
export function delOperlog(operId) {
	return request({
		method: 'delete',
		url: '/monitor/operlog/' + operId
	})
}

// 清空操作日志
export function cleanOperlog() {
	return request({
		method: 'delete',
		url: '/monitor/operlog/clean'
	})
}

// 导出
export function operlogExport(params) {
	let apiParams = { ...params }
	if (params.daterange) {
		apiParams['params[beginTime]'] = params.daterange[0]
		apiParams['params[endTime]'] = params.daterange[1]

		delete apiParams.daterange
	}
	return request({
		data: apiParams,
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		method: 'post',
		responseType: 'blob',
		url: '/monitor/operlog/export'
	})
}
