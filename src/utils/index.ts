/** 获取浏览器默认语言 */
export function getBrowserLang() {
	let browserLang = navigator.language ? navigator.language : navigator.browserLanguage
	let defaultBrowserLang = ''
	if (['cn', 'zh', 'zh-cn'].includes(browserLang.toLowerCase())) {
		defaultBrowserLang = 'zh-CN'
	} else {
		defaultBrowserLang = 'en'
	}
	return defaultBrowserLang
}

/** 生成随机字符串 */
export function toAnyString() {
	const str: string = 'xxxxx-xxxxx-4xxxx-yxxxx-xxxxx'.replace(/[xy]/g, (c: string) => {
		const r: number = (Math.random() * 16) | 0
		const v: number = c === 'x' ? r : (r & 0x3) | 0x8
		return v.toString()
	})
	return str
}

/** 把对象转为formData */
export function objToFormData(obj: Recordable) {
	const formData = new FormData()
	Object.keys(obj).forEach(key => {
		formData.append(key, obj[key])
	})
	return formData
}

/**
 * Check if an element has a class
 * @param {HTMLElement} elm
 * @param {string} cls
 * @returns {boolean}
 */
export function hasClass(ele: HTMLElement, cls: string) {
	return !!ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'))
}

/**
 * Add class to element
 * @param {HTMLElement} elm
 * @param {string} cls
 */
export function addClass(ele: HTMLElement, cls: string) {
	if (!hasClass(ele, cls)) ele.classList.add(cls)
}

/**
 * Remove class from element
 * @param {HTMLElement} elm
 * @param {string} cls
 */
export function removeClass(ele: HTMLElement, cls: string) {
	if (hasClass(ele, cls)) ele.classList.remove(cls)
}
