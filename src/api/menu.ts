import { request } from '@/utils/request'

// 获取路由
export function getRouters(): Promise<API.IGetRoutersRes> {
	return request({
		url: '/getRouters',
		method: 'get'
	})
}
