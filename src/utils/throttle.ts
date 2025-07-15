import { throttle, debounce } from 'throttle-debounce'

const funcDelay = 2000

interface IThrottleFunc {
	delay?: number
	/**true 不在初始执行 -  */
	noLeading?: boolean
	/**true 不在结束未到时间执行 */
	noTrailing?: boolean
}
/**
 * - 节流 - 只有当上一次函数执行后过了规定的时间间隔，才能进行下一次该函数的调用
 * - 应用场景：比如窗口调整、页面滚动、抢购和疯狂点击等会用到节流。
 */
export const throttleFunc = (callback: () => void, options?: IThrottleFunc) => {
	const { delay = funcDelay, noLeading, noTrailing } = options || {}
	return throttle(delay, callback, { noLeading, noTrailing })
}

interface IDebounceFunc {
	delay?: number
	/**true初始执行 */
	atBegin?: boolean
}
/**
 * - 防抖 - 在事件被触发n秒后再执行回调，如果在这n秒内又被触发，则重新计时
 * - 应用场景：输入框
 */
export const debounceFunc = (callback: () => void, options?: IDebounceFunc) => {
	const { delay = funcDelay, atBegin } = options || {}
	return debounce(delay, callback, { atBegin })
}
