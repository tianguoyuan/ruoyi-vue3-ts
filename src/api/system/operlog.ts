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
		url: '/monitor/operlog/list',
		method: 'get',
		params: apiParams
	})
}

// 删除操作日志
export function delOperlog(operId) {
	return request({
		url: '/monitor/operlog/' + operId,
		method: 'delete'
	})
}

// 清空操作日志
export function cleanOperlog() {
	return request({
		url: '/monitor/operlog/clean',
		method: 'delete'
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
		url: '/monitor/operlog/export',
		method: 'post',
		data: apiParams,
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		responseType: 'blob'
	})
}
