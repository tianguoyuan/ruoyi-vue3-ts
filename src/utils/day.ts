import dayjs from 'dayjs'

/**格式化时间 */
export function formatDate(date: string | Date, showTime = false) {
	return dayjs(date).format(showTime ? 'YYYY-MM-DD hh:mm:ss' : 'YYYY-MM-DD')
}
/**获取当前时间 */
export function currentDate(showTime = false) {
	return dayjs().format(showTime ? 'YYYY-MM-DD hh:mm:ss' : 'YYYY-MM-DD')
}
