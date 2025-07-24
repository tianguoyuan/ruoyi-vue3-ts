import { request } from '@/utils/request'

export function demoList(data: API.IDemoList): Promise<API.IDemoListRes> {
	return request({
		url: '/demo/list',
		method: 'post',
		data
	})
}
