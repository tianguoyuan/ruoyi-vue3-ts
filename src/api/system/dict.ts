import { request } from '@/utils/request'
// 获取字典选择框列表
export function optionselect(): Promise<API.IOptionselect> {
	return request({
		method: 'get',
		url: '/system/dict/type/optionselect'
	})
}

// 查询表详细信息
export function getGenTable(tableId: string): Promise<API.IGetGenTableRes> {
	return request({
		method: 'get',
		url: '/tool/gen/' + tableId
	})
}

// 根据字典类型查询字典数据信息
export function getDicts(dictType: string): Promise<API.IGetDictsRes> {
	return new Promise(resolve => {
		request({
			method: 'get',
			url: '/system/dict/data/type/' + dictType
		}).then((res: any) => {
			const data = res?.data || []
			resolve(
				data.map((v: any) => ({
					elTagClass: v.cssClass,
					elTagType: v.listClass,
					label: v.dictLabel,
					value: v.dictValue
				}))
			)
		})
	})
}
