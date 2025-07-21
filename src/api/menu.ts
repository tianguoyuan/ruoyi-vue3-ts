import { request } from '@/utils/request'

// 获取路由
export const getRouters = (): Promise<API.IGetRoutersRes> => {
	return request({ url: '/getRouters', method: 'GET' })
}
