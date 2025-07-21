declare namespace API {
	/** 注册 */
	interface IRegister {
		/** 账号 */
		username: string
		/** 密码 */
		password: string
	}

	/** 登录 */
	interface ILogin {
		/** 账号 */
		username: string
		/** 密码 */
		password: string
		uuid: string
		code: string
	}
	interface ILoginRes {
		/** token */
		token: string
	}

	/** 获取用户信息 */
	type role = 'admin' | 'editor' | string
	type permissions = '*:*:*'
	interface IUserInfoRes {
		isDefaultModifyPwd: boolean
		isPasswordExpired: boolean
		permissions: [] | permissions[]
		roles: [] | role[]
		user: {
			avatar: string
			nickName: string
		}
		// introduction: string
		// avatar: string
		// name: string
		// routes: any[]
	}

	interface IDemoList {
		pageNum: number
		pageSize: number
		[key: string]: any
	}
	interface IDemoListRes {
		total: number
		rows: any[]
	}

	interface ICaptchaImageRes {
		captchaEnabled: boolean
		uuid: string
		img: string
	}

	interface IGetRoutersRes {
		[key: string]: any
	}
}
