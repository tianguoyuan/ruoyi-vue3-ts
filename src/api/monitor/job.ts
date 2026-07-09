import { request } from '@/utils/request'

// 查询定时任务调度列表
export function getListJob(query) {
	return request({
		method: 'get',
		params: query,
		url: '/monitor/job/list'
	})
}

// 任务状态修改
export function changeJobStatus(jobId: string, status: string) {
	const data = {
		jobId,
		status
	}
	return request({
		data: data,
		method: 'put',
		url: '/monitor/job/changeStatus'
	})
}

// 导出
export function jobExport(data) {
	return request({
		data,
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		method: 'post',
		responseType: 'blob',
		url: '/monitor/job/export'
	})
}

// 定时任务立即执行一次
export function runJob(jobId: string, jobGroup: string) {
	const data = {
		jobGroup,
		jobId
	}
	return request({
		data: data,
		method: 'put',
		url: '/monitor/job/run'
	})
}

// 删除定时任务调度
export function delJob(jobId: string) {
	return request({
		method: 'delete',
		url: '/monitor/job/' + jobId
	})
}

// 查询定时任务调度详细
export function getJob(jobId: string) {
	return request({
		method: 'get',
		url: '/monitor/job/' + jobId
	})
}

// 新增定时任务调度
export function addJob(data) {
	return request({
		data: data,
		method: 'post',
		url: '/monitor/job'
	})
}

// 修改定时任务调度
export function updateJob(data) {
	return request({
		data: data,
		method: 'put',
		url: '/monitor/job'
	})
}

// 查询调度日志列表
export function listJobLog(params) {
	let apiParams = { ...params }
	if (params.daterange) {
		apiParams['params[beginTime]'] = params.daterange[0]
		apiParams['params[endTime]'] = params.daterange[1]

		delete apiParams.daterange
	}
	return request({
		method: 'get',
		params: apiParams,
		url: '/monitor/jobLog/list'
	})
}

// 删除调度日志
export function delJobLog(jobLogId) {
	return request({
		method: 'delete',
		url: '/monitor/jobLog/' + jobLogId
	})
}

// 清空调度日志
export function cleanJobLog() {
	return request({
		method: 'delete',
		url: '/monitor/jobLog/clean'
	})
}
// 调度日志导出
export function jobLogExport(data) {
	return request({
		data,
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		method: 'post',
		responseType: 'blob',
		url: '/monitor/jobLog/export'
	})
}

// 查询定时任务调度详细
export function getJobById(jobId: string) {
	return request({
		method: 'get',
		url: '/monitor/job/' + jobId
	})
}
