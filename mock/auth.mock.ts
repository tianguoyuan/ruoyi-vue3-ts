import { defineMock } from './base'

export default defineMock([
	{
		body: {
			code: '200',
			data: {
				token: 'admin-token'
			},
			msg: 'ok'
		},
		method: ['POST'],
		url: 'auth/login'
	},
	{
		body: {
			code: '200',
			data: {
				token: 'admin-token'
			},
			msg: 'ok'
		},
		method: ['POST'],
		url: 'auth/logout'
	},
	{
		body: {
			code: '200',
			data: {
				avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
				introduction: 'I am a super administrator',
				name: 'Super Admin',
				// ['edit', ...] - router.meta.roles
				roles: ['admin'],
				routes: [
					{
						children: [
							{
								component: 'home/index',
								meta: {
									affix: true,
									icon: 'dashboard',
									title: '首页'
								},
								name: 'Home',
								path: 'home'
							}
						],
						component: 'Layout',
						meta: {
							breadcrumb: false,
							title: '首页'
						},
						path: '/',
						redirect: '/home'
					},
					{
						children: [
							{
								component: 'guide/index',
								meta: {
									icon: 'guide',
									title: '指南'
								},
								name: 'Guide',
								path: 'index'
							}
						],
						component: 'Layout',
						meta: {
							alwaysShow: true,
							icon: 'guide',
							roles: ['admin'],
							title: '指南'
						},
						path: '/guide',
						redirect: '/guide/index'
					}
				]
			},
			msg: 'ok'
		},
		method: ['POST'],
		url: 'auth/userInfo'
	},
	{
		body: {
			code: '200',
			data: {
				rows: [
					{
						address: 'No. 189, Grove St, Los Angeles',
						date: '2016-05-03',
						name: 'Tom'
					},
					{
						address: 'No. 189, Grove St, Los Angeles',
						date: '2016-05-02',
						name: 'Tom'
					},
					{
						address: 'No. 189, Grove St, Los Angeles',
						date: '2016-05-04',
						name: 'Tom'
					},
					{
						address: 'No. 189, Grove St, Los Angeles',
						date: '2016-05-01',
						name: 'Tom'
					},
					{
						address: 'No. 189, Grove St, Los Angeles',
						date: '2016-05-03',
						name: 'Tom'
					},
					{
						address: 'No. 189, Grove St, Los Angeles',
						date: '2016-05-02',
						name: 'Tom'
					},
					{
						address: 'No. 189, Grove St, Los Angeles',
						date: '2016-05-04',
						name: 'Tom'
					},
					{
						address: 'No. 189, Grove St, Los Angeles',
						date: '2016-05-01',
						name: 'Tom'
					}
				],
				total: 201
			},
			msg: 'ok'
		},
		method: ['POST'],
		url: 'demo/list'
	}
])
