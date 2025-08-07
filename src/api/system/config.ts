import { request } from '@/utils/request'
// 获取字典选择框列表
export function getConfigKey(configKey: string) {
	return request({
		url: '/system/config/configKey/' + configKey,
		method: 'get'
	})
}
