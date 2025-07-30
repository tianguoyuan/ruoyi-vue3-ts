import { request } from '@/utils/request'
// 获取字典选择框列表
export function optionselect(): Promise<API.IOptionselect> {
	return request({
		url: '/system/dict/type/optionselect',
		method: 'get'
	})
}

// 查询表详细信息
export function getGenTable(tableId: string): Promise<API.IGetGenTableRes> {
	return request({
		url: '/tool/gen/' + tableId,
		method: 'get'
	})
}

// 根据字典类型查询字典数据信息
export function getDicts(dictType: string): Promise<API.IGetDictsRes> {
	return new Promise(resolve => {
		request({
			url: '/system/dict/data/type/' + dictType,
			method: 'get'
		}).then((res: any) => {
			const data = res?.data || []
			resolve(
				data.map((v: any) => ({
					label: v.dictLabel,
					value: v.dictValue,
					elTagType: v.listClass,
					elTagClass: v.cssClass
				}))
			)
		})
	})
}
