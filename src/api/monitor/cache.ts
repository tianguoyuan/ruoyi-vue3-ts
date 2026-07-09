import { request } from '@/utils/request'

// 查询缓存详细
export function getCache() {
	return request({
		method: 'get',
		url: '/monitor/cache'
	})
}

// 查询缓存名称列表
export function listCacheName() {
	return request({
		method: 'get',
		url: '/monitor/cache/getNames'
	})
}

// 查询缓存键名列表
export function listCacheKey(cacheName) {
	return request({
		method: 'get',
		url: '/monitor/cache/getKeys/' + cacheName
	})
}

// 查询缓存内容
export function getCacheValue(cacheName, cacheKey) {
	return request({
		method: 'get',
		url: '/monitor/cache/getValue/' + cacheName + '/' + cacheKey
	})
}

// 清理指定名称缓存
export function clearCacheName(cacheName) {
	return request({
		method: 'delete',
		url: '/monitor/cache/clearCacheName/' + cacheName
	})
}

// 清理指定键名缓存
export function clearCacheKey(cacheKey) {
	return request({
		method: 'delete',
		url: '/monitor/cache/clearCacheKey/' + cacheKey
	})
}

// 清理全部缓存
export function clearCacheAll() {
	return request({
		method: 'delete',
		url: '/monitor/cache/clearCacheAll'
	})
}
