export const ResultEnum = {
	/** 请求超时时间 */
	TIMEOUT: 30 * 1000,
	/** 开发者返回的 code 字段 */
	RESPONSE_CODE_FIELD: 'code',
	/** 开发者返回的 msg 字段 */
	RESPONSE_MSG_FIELD: 'msg',
	/** 开发者返回的 data 字段 */
	RESPONSE_DATA_FIELD: '', //'data',

	/** 开发者返回的 成功code */
	SUCCESS_CODE_ARR: [200],
	/** 登录过期 code */
	RESPONSE_CODE_ERROR_AUTH: 401,

	/** 请求头携带 token 字段 */
	REQUEST_HEADER_TOKEN_FIELD: 'Authorization'
}
