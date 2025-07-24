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
			phonenumber: string
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

	// 修改用户信息
	interface IUpdateUserProfile {
		nickName: string
		phonenumber: string
		email: string
		sex: string
	}
	// 修改头像
	// interface IUploadAvatar {
	// 	avatarfile: FormData<'avatarfile'>
	// }
	type IUploadAvatar = FormData

	// 代码生成
	interface IGenList {
		pageNum: number
		pageSize: number
		orderByColumn?: 'createTime'
		isAsc?: 'ascending' | 'descending'
	}
	interface IGenListRes {
		total: number
		rows: {
			tableName: string
			tableComment: string
			className: string
			createTime: string
			updateTime: string
		}[]
	}
	// 代码生成下载文件
	interface IGenBatchGenCode {
		tables: string
	}
	interface IGenBatchGenCodeRes {
		filename: string
		data: Blob
	}
}
