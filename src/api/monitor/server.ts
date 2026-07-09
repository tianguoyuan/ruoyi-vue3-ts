import { request } from '@/utils/request'
// 获取服务信息
export function getServer(): Promise<API.IGetServer> {
	return request({
		method: 'get',
		url: '/monitor/server'
	})
}
