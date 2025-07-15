import type { StorageFiled } from '../types/storage'
import defaultSettings from '@/settings'

// 默认缓存期限为7天
const DEFAULT_CACHE_TIME = 60 * 60 * 24 * 7
// 定义 CachedItem 接口
interface CachedItem<T> {
	value: T
	expire: number | null
}
/** 本地缓存类 */
class Storage {
	#storage
	#prefixKey

	constructor(prefixKey = '', storage: typeof localStorage) {
		this.#storage = storage
		this.#prefixKey = prefixKey
	}

	private getKey(key: keyof StorageFiled) {
		return `${this.#prefixKey}${key}`.toUpperCase()
	}

	/** 设置缓存 */
	set<K extends keyof StorageFiled>(key: K, value: StorageFiled[K], expire: number | null = DEFAULT_CACHE_TIME) {
		const stringData = JSON.stringify({
			value,
			expire: expire !== null ? new Date().getTime() + expire * 1000 : null
		})
		this.#storage.setItem(this.getKey(key), stringData)
	}

	/** 读取缓存 */
	get<K extends keyof StorageFiled>(key: K): StorageFiled[K] | null {
		const item = this.#storage.getItem(this.getKey(key))
		if (item) {
			try {
				const cachedItem = JSON.parse(item) as CachedItem<StorageFiled[K]>
				// 在有效期内直接返回
				if (cachedItem.expire === null || cachedItem.expire >= Date.now()) {
					return cachedItem.value
				}
				this.remove(key)
			} catch (e) {
				return null
			}
		}
		return null
	}

	/** 从缓存删除某项 */
	remove(key: keyof StorageFiled) {
		this.#storage.removeItem(this.getKey(key))
	}

	/** 清空所有缓存 */
	clear() {
		this.#storage.clear()
	}
}
export default new Storage(defaultSettings.title, localStorage)
