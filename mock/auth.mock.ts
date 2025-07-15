import { defineMock } from './base'

export default defineMock([
	{
		url: 'auth/login',
		method: ['POST'],
		body: {
			code: '200',
			msg: 'ok',
			data: {
				token: 'admin-token'
			}
		}
	},
	{
		url: 'auth/logout',
		method: ['POST'],
		body: {
			code: '200',
			msg: 'ok',
			data: {
				token: 'admin-token'
			}
		}
	},
	{
		url: 'auth/userInfo',
		method: ['POST'],
		body: {
			code: '200',
			msg: 'ok',
			data: {
				// ['edit', ...] - router.meta.roles
				roles: ['admin'],
				introduction: 'I am a super administrator',
				avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
				name: 'Super Admin',
				routes: [
					{
						path: '/',
						component: 'Layout',
						redirect: '/home',
						meta: {
							title: '首页',
							breadcrumb: false
						},
						children: [
							{
								path: 'home',
								name: 'Home',
								component: 'home/index',
								meta: {
									title: '首页',
									affix: true,
									icon: 'dashboard'
								}
							}
						]
					},
					{
						path: '/guide',
						redirect: '/guide/index',
						component: 'Layout',
						meta: {
							title: '指南',
							icon: 'guide',
							roles: ['admin'],
							alwaysShow: true
						},
						children: [
							{
								path: 'index',
								name: 'Guide',
								component: 'guide/index',
								meta: { title: '指南', icon: 'guide' }
							}
						]
					}
				]
			}
		}
	},
	{
		url: 'demo/list',
		method: ['POST'],
		body: {
			code: '200',
			msg: 'ok',
			data: {
				total: 201,
				rows: [
					{
						date: '2016-05-03',
						name: 'Tom',
						address: 'No. 189, Grove St, Los Angeles'
					},
					{
						date: '2016-05-02',
						name: 'Tom',
						address: 'No. 189, Grove St, Los Angeles'
					},
					{
						date: '2016-05-04',
						name: 'Tom',
						address: 'No. 189, Grove St, Los Angeles'
					},
					{
						date: '2016-05-01',
						name: 'Tom',
						address: 'No. 189, Grove St, Los Angeles'
					},
					{
						date: '2016-05-03',
						name: 'Tom',
						address: 'No. 189, Grove St, Los Angeles'
					},
					{
						date: '2016-05-02',
						name: 'Tom',
						address: 'No. 189, Grove St, Los Angeles'
					},
					{
						date: '2016-05-04',
						name: 'Tom',
						address: 'No. 189, Grove St, Los Angeles'
					},
					{
						date: '2016-05-01',
						name: 'Tom',
						address: 'No. 189, Grove St, Los Angeles'
					}
				]
			}
		}
	}
])
