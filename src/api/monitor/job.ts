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
