import { request } from '@/utils/request'

// 查询登录日志列表
export function list(query) {
	return request({
		url: '/monitor/logininfor/list',
		method: 'get',
		params: query
	})
}

// 删除登录日志
export function delLogininfor(infoId) {
	return request({
		url: '/monitor/logininfor/' + infoId,
		method: 'delete'
	})
}

// 解锁用户登录状态
export function unlockLogininfor(userName) {
	return request({
		url: '/monitor/logininfor/unlock/' + userName,
		method: 'get'
	})
}

// 清空登录日志
export function cleanLogininfor() {
	return request({
		url: '/monitor/logininfor/clean',
		method: 'delete'
	})
}

// 导出
export function operLogininfor(params) {
	let apiParams = { ...params }
	if (params.daterange) {
		apiParams['params[beginTime]'] = params.daterange[0]
		apiParams['params[endTime]'] = params.daterange[1]

		delete apiParams.daterange
	}
	return request({
		url: '/monitor/logininfor/export',
		method: 'post',
		data: apiParams,
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		responseType: 'blob'
	})
}
