import dayjs from 'dayjs'

/**格式化时间 */
export const formatDate = (date: string | Date, showTime = false) =>
	dayjs(date).format(showTime ? 'YYYY-MM-DD hh:mm:ss' : 'YYYY-MM-DD')
/**获取当前时间 */
export const currentDate = (showTime = false) => dayjs().format(showTime ? 'YYYY-MM-DD hh:mm:ss' : 'YYYY-MM-DD')
