import axios, { type AxiosRequestConfig, type AxiosInstance, type Canceler, type Method } from 'axios'
import { ResultEnum as REQUEST } from '@/enums/ResultEnum'
import Storage from './storage'
import { ElLoading, ElMessage, ElMessageBox } from 'element-plus'
import router from '@/router'
import { useUserStoreWidthOut } from '@/store/user'

interface RequestState {
	baseUrl: string
}
interface InterceptorsState {
	instance: AxiosInstance
	url: string
	loading: boolean
	cancelToken: boolean
}
class Request {
	public queueUrl: number
	public cancelTokenList: { url?: string; cancel: Canceler }[] = []
	private baseUrl: string
	private loadingInstance: null | ReturnType<typeof ElLoading.service> = null
	constructor(props: RequestState) {
		this.queueUrl = 0
		this.cancelTokenList = []
		this.baseUrl = props.baseUrl
	}

	public cancelRequest(url: string) {
		const item = this.cancelTokenList.find(item => item.url === url)
		if (item) item.cancel()
	}

	public cancelAllRequest() {
		this.cancelTokenList.forEach(item => item.cancel())
	}

	private errorToast(msg: string) {
		console.log('errorToast', msg)
		ElMessage({
			message: msg,
			type: 'warning'
		})
	}
	/** 登录过期, 重新登录 */
	private errorAuthToast(msg: string) {
		console.log('errorAuthToast', msg)
		ElMessageBox.confirm('登录过期, 是否重新登录?', {
			title: '提示',
			type: 'warning'
		})
			.then(() => {
				const userStore = useUserStoreWidthOut()
				userStore.resetUserInfo()
				router.replace('/login')
			})
			.catch(() => {
				// catch error
			})
	}
	private hideLoading() {
		console.log('hideLoading')
		this.loadingInstance?.close()
	}
	private showLoading() {
		console.log('showLoading')
		this.loadingInstance = ElLoading.service({
			lock: true,
			text: '加载中...',
			spinner: 'el-icon-loading',
			background: 'rgba(0, 0, 0, 0.7)'
		})
	}
	private destroy(url: string, loading: boolean) {
		if (loading) {
			this.queueUrl--
		}
		console.log('destroy', this.queueUrl)
		this.cancelTokenList = this.cancelTokenList.filter(cancel => url !== cancel.url)
		if (!this.queueUrl) {
			this.hideLoading()
		}
	}
	private interceptors(options: InterceptorsState) {
		const { instance, url, loading, cancelToken } = options
		console.time(url)
		instance.interceptors.request.use(config => {
			if (cancelToken) {
				config.cancelToken = new axios.CancelToken(cancel => {
					this.cancelTokenList.push({ url: url, cancel })
				})
			}
			if (loading) {
				if (!this.queueUrl) {
					this.showLoading()
				}
				this.queueUrl++
			}
			if (Storage.get('token')) {
				config.headers[REQUEST.REQUEST_HEADER_TOKEN_FIELD] = Storage.get('token')
			}
			return config
		})
		instance.interceptors.response.use(
			response => {
				this.destroy(url, loading)
				const code = response.data[REQUEST.RESPONSE_CODE_FIELD]
				const data = REQUEST.RESPONSE_DATA_FIELD ? response.data[REQUEST.RESPONSE_DATA_FIELD] : response.data
				const msg = response.data[REQUEST.RESPONSE_MSG_FIELD] || '系统错误，请稍候再试'

				console.timeEnd(url)
				console.log('request: success->', url, response.config.data || response.config.params, data)
				if (REQUEST.SUCCESS_CODE_ARR.includes(code)) return data
				if (REQUEST.RESPONSE_CODE_ERROR_AUTH === code) {
					this.errorAuthToast(msg)
				} else {
					this.errorToast(msg)
				}
				return Promise.reject(response)
			},
			error => {
				this.destroy(url, loading)
				console.timeEnd(url)
				console.log('request: error->', url, error)
				const { code, message } = error || {}
				const err: string = error.toString()
				let msg = '系统错误，请稍候再试'
				if (code === 'ECONNABORTED' && message.indexOf('timeout') !== -1) {
					msg = '接口请求超时，请刷新页面重试!'
				} else if (err && err.includes('Network Error')) {
					msg = '网络异常, 请检查您的网络连接是否正常'
				}
				this.errorToast(msg)
				return Promise.reject(error)
			}
		)
	}
	public request = <T>(
		options: AxiosRequestConfig & { method: Uppercase<Method> },
		loading?: boolean,
		cancelToken?: boolean
	): Promise<T> => {
		const instance = axios.create({
			baseURL: this.baseUrl,
			timeout: REQUEST.TIMEOUT,
			// 设置跨域是否携带凭证
			withCredentials: true
		})
		this.interceptors({
			instance: instance,
			url: options.url || '',
			loading: loading || true,
			cancelToken: cancelToken || false
		})
		return instance(options)
	}
}
export const { request } = new Request({
	baseUrl: import.meta.env.VITE_API_URL
})
