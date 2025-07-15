/** 本地缓存字段 */
export interface StorageFiled {
	/** 项目token, 接口请求头携带 */
	token: string
	/** 项目显示语言 znCN中文，en英文 */
	lang: 'zh-CN' | 'en'
}
