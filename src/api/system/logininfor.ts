import { request } from '@/utils/request'

// 查询登录日志列表
export function list(query) {
	return request({
		method: 'get',
		params: query,
		url: '/monitor/logininfor/list'
	})
}

// 删除登录日志
export function delLogininfor(infoId) {
	return request({
		method: 'delete',
		url: '/monitor/logininfor/' + infoId
	})
}

// 解锁用户登录状态
export function unlockLogininfor(userName) {
	return request({
		method: 'get',
		url: '/monitor/logininfor/unlock/' + userName
	})
}

// 清空登录日志
export function cleanLogininfor() {
	return request({
		method: 'delete',
		url: '/monitor/logininfor/clean'
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
		data: apiParams,
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		method: 'post',
		responseType: 'blob',
		url: '/monitor/logininfor/export'
	})
}
