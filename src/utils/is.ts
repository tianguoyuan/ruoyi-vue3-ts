/**
 * @description: 判断值是否未某个类型
 */
export function is(val: unknown, type: string) {
	return Object.prototype.toString.call(val) === `[object ${type}]`
}

/**
 * @description:  是否为函数
 */
export function isFunction<T = Function>(val: unknown): val is T {
	return is(val, 'Function')
}

/**
 * @description: 是否已定义
 */
export function isDef<T = unknown>(val?: T): val is T {
	return typeof val !== 'undefined'
}

/**
 * @description: 是否未定义
 */
export function isUnDef<T = unknown>(val?: T): val is T {
	return !isDef(val)
}

/**
 * @description: 是否为对象
 */
export function isObject(val: any): val is Record<any, any> {
	return val !== null && is(val, 'Object')
}

/**
 * @description:  是否为时间
 */
export function isDate(val: unknown): val is Date {
	return is(val, 'Date')
}

/**
 * @description:  是否为数值
 */
export function isNumber(val: unknown): val is number {
	return is(val, 'Number')
}

/**
 * @description:  是否为AsyncFunction
 */
export function isAsyncFunction<T = any>(val: unknown): val is Promise<T> {
	return is(val, 'AsyncFunction')
}

/**
 * @description:  是否为promise
 */
export function isPromise<T = any>(val: unknown): val is Promise<T> {
	return is(val, 'Promise') && isObject(val) && isFunction(val.then) && isFunction(val.catch)
}

/**
 * @description:  是否为字符串
 */
export function isString(val: unknown): val is string {
	return is(val, 'String')
}

/**
 * @description:  是否为boolean类型
 */
export function isBoolean(val: unknown): val is boolean {
	return is(val, 'Boolean')
}

/**
 * @description:  是否为数组
 */
export function isArray(val: any): val is Array<any> {
	return val && Array.isArray(val)
}

/**
 * @description: 是否客户端
 */
export function isClient() {
	return typeof window !== 'undefined'
}

/**
 * @description: 是否为浏览器
 */
export function isWindow(val: any): val is Window {
	return typeof window !== 'undefined' && is(val, 'Window')
}

/**
 * @description: 是否为 element 元素
 */
export function isElement(val: unknown): val is Element {
	return isObject(val) && !!val.tagName
}

/**
 * @description: 是否为 null
 */
export function isNull(val: unknown): val is null {
	return val === null
}

/**
 * @description: 是否为 null || undefined
 */
export function isNullOrUnDef(val: unknown): val is null | undefined {
	return isUnDef(val) || isNull(val)
}

/**
 * @description: 是否为 16 进制颜色
 */
export function isHexColor(str: string) {
	return /^#?([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(str)
}

/**
 * @description 是否为 email
 */
export function validEmail(email: string) {
	const reg =
		// eslint-disable-next-line no-useless-escape
		/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
	return reg.test(email)
}

/**是否为链接 */
export function isExternal(path: string) {
	return /^(https?:|mailto:|tel:)/.test(path)
}
