import { request } from '@/utils/request'

// 列表
export function getGenList(params: API.IGenList): Promise<API.IGenListRes> {
	return request({
		url: '/tool/gen/list',
		method: 'get',
		params
	})
}

// 生成文件下载
export function genBatchGenCode(params: API.IGenBatchGenCode): Promise<API.IGenBatchGenCodeRes> {
	return request({
		url: '/tool/gen/batchGenCode',
		method: 'get',
		params,
		responseType: 'blob'
	})
}
