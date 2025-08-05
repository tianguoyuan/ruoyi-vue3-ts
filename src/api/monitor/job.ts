import { request } from '@/utils/request'

// 查询定时任务调度列表
export function getListJob(query) {
	return request({
		url: '/monitor/job/list',
		method: 'get',
		params: query
	})
}

// 任务状态修改
export function changeJobStatus(jobId: string, status: string) {
	const data = {
		jobId,
		status
	}
	return request({
		url: '/monitor/job/changeStatus',
		method: 'put',
		data: data
	})
}

// 导出
export function jobExport(data) {
	return request({
		url: '/monitor/job/export',
		method: 'post',
		data,
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		responseType: 'blob'
	})
}

// 定时任务立即执行一次
export function runJob(jobId: string, jobGroup: string) {
	const data = {
		jobId,
		jobGroup
	}
	return request({
		url: '/monitor/job/run',
		method: 'put',
		data: data
	})
}

// 删除定时任务调度
export function delJob(jobId: string) {
	return request({
		url: '/monitor/job/' + jobId,
		method: 'delete'
	})
}

// 查询定时任务调度详细
export function getJob(jobId: string) {
	return request({
		url: '/monitor/job/' + jobId,
		method: 'get'
	})
}

// 新增定时任务调度
export function addJob(data) {
	return request({
		url: '/monitor/job',
		method: 'post',
		data: data
	})
}

// 修改定时任务调度
export function updateJob(data) {
	return request({
		url: '/monitor/job',
		method: 'put',
		data: data
	})
}

// 查询调度日志列表
export function listJobLog(query) {
	let params = { ...query }
	if (query.daterange) {
		params['params[beginTime]'] = query.daterange[0]
		params['params[endTime]'] = query.daterange[1]

		delete params.daterange
	}
	return request({
		url: '/monitor/jobLog/list',
		method: 'get',
		params: params
	})
}

// 删除调度日志
export function delJobLog(jobLogId) {
	return request({
		url: '/monitor/jobLog/' + jobLogId,
		method: 'delete'
	})
}

// 清空调度日志
export function cleanJobLog() {
	return request({
		url: '/monitor/jobLog/clean',
		method: 'delete'
	})
}
// 调度日志导出
export function jobLogExport(data) {
	return request({
		url: '/monitor/jobLog/export',
		method: 'post',
		data,
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		responseType: 'blob'
	})
}

// 查询定时任务调度详细
export function getJobById(jobId: string) {
	return request({
		url: '/monitor/job/' + jobId,
		method: 'get'
	})
}
