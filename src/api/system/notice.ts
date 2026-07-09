import { request } from '@/utils/request'

// 查询公告列表
export function listNotice(query) {
	return request({
		method: 'get',
		params: query,
		url: '/system/notice/list'
	})
}

// 查询公告详细
export function getNotice(noticeId) {
	return request({
		method: 'get',
		url: '/system/notice/' + noticeId
	})
}

// 新增公告
export function addNotice(data) {
	return request({
		data: data,
		method: 'post',
		url: '/system/notice'
	})
}

// 修改公告
export function updateNotice(data) {
	return request({
		data: data,
		method: 'put',
		url: '/system/notice'
	})
}

// 删除公告
export function delNotice(noticeId) {
	return request({
		method: 'delete',
		url: '/system/notice/' + noticeId
	})
}
