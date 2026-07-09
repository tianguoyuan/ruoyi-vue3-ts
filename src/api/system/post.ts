import { request } from '@/utils/request'

// 查询岗位列表
export function listPost(query) {
	return request({
		method: 'get',
		params: query,
		url: '/system/post/list'
	})
}

// 查询岗位详细
export function getPost(postId) {
	return request({
		method: 'get',
		url: '/system/post/' + postId
	})
}

// 新增岗位
export function addPost(data) {
	return request({
		data: data,
		method: 'post',
		url: '/system/post'
	})
}

// 修改岗位
export function updatePost(data) {
	return request({
		data: data,
		method: 'put',
		url: '/system/post'
	})
}

// 删除岗位
export function delPost(postId) {
	return request({
		method: 'delete',
		url: '/system/post/' + postId
	})
}

// 导出
export function postExport(data) {
	return request({
		data,
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		method: 'post',
		responseType: 'blob',
		url: '/system/post/export'
	})
}
