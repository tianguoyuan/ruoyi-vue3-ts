import { request } from '@/utils/request'

export function demoList(data: API.IDemoList): Promise<API.IDemoListRes> {
	return request({
		data,
		method: 'post',
		url: '/demo/list'
	})
}
