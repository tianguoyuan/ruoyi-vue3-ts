import { request } from '@/utils/request'

// 查询在线用户列表
export function getOnlineList(query: API.IGetOnlineList) {
	return request({
		method: 'get',
		params: query,
		url: '/monitor/online/list'
	})
}

// 强退用户
export function forceLogout(tokenId: string): Promise<API.BaseRes> {
	return request({
		method: 'delete',
		url: '/monitor/online/' + tokenId
	})
}
