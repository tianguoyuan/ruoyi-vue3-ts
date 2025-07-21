import { request } from '@/utils/request'

export const demoList = (data: API.IDemoList): Promise<API.IDemoListRes> => {
	return request({ url: '/demo/list', method: 'POST', data })
}
