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
		url: '/tool/gen/list',
		method: 'get',
		params: apiParams
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

// 同步数据库
export function synchDb(tableName: string) {
	return request({
		url: '/tool/gen/synchDb/' + tableName,
		method: 'get'
	})
}

// 删除表数据
export function delTable(tableId: string) {
	return request({
		url: '/tool/gen/' + tableId,
		method: 'delete'
	})
}

// 创建表
export function createTable(data: { sql: string }): Promise<{ msg: string }> {
	return request({
		url: '/tool/gen/createTable',
		method: 'post',
		params: data
	})
}

// 查询db数据库列表
export function getDbList(query: API.IGetDbList): Promise<API.IGetDbListRes> {
	return request({
		url: '/tool/gen/db/list',
		method: 'get',
		params: query
	})
}

// 导入表
export function importTable(data: { tables: string }): Promise<{ msg: string }> {
	return request({
		url: '/tool/gen/importTable',
		method: 'post',
		params: data
	})
}

// 预览生成代码
export function previewTable(tableId: string): Promise<{ data: Record<string, string> }> {
	return request({
		url: '/tool/gen/preview/' + tableId,
		method: 'get'
	})
}
