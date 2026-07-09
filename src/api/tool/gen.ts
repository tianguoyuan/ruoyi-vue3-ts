import { request } from '@/utils/request'

// 列表
export function getGenList(params: API.IGenList): Promise<API.IGenListRes> {
	let apiParams = { ...params }
	if (params.daterange) {
		apiParams['params[beginTime]'] = params.daterange[0]
		apiParams['params[endTime]'] = params.daterange[1]

		delete apiParams.daterange
	}
	return request({
		method: 'get',
		params: apiParams,
		url: '/tool/gen/list'
	})
}

// 生成文件下载
export function genBatchGenCode(params: API.IGenBatchGenCode): Promise<API.IGenBatchGenCodeRes> {
	return request({
		method: 'get',
		params,
		responseType: 'blob',
		url: '/tool/gen/batchGenCode'
	})
}

// 同步数据库
export function synchDb(tableName: string) {
	return request({
		method: 'get',
		url: '/tool/gen/synchDb/' + tableName
	})
}

// 删除表数据
export function delTable(tableId: string) {
	return request({
		method: 'delete',
		url: '/tool/gen/' + tableId
	})
}

// 创建表
export function createTable(data: { sql: string }): Promise<{ msg: string }> {
	return request({
		method: 'post',
		params: data,
		url: '/tool/gen/createTable'
	})
}

// 查询db数据库列表
export function getDbList(query: API.IGetDbList): Promise<API.IGetDbListRes> {
	return request({
		method: 'get',
		params: query,
		url: '/tool/gen/db/list'
	})
}

// 导入表
export function importTable(data: { tables: string }): Promise<{ msg: string }> {
	return request({
		method: 'post',
		params: data,
		url: '/tool/gen/importTable'
	})
}

// 预览生成代码
export function previewTable(tableId: string): Promise<{ data: Record<string, string> }> {
	return request({
		method: 'get',
		url: '/tool/gen/preview/' + tableId
	})
}
