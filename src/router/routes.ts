import type { RouteRecordRaw } from 'vue-router'
import Layout from '@/layout/index.vue'

export const errorPageRoute: RouteRecordRaw[] = [
	{
		path: '/404',
		name: 'Page404',
		component: () => import('@/views/errorPage/404.vue'),
		meta: {
			hidden: true
		}
	},
	{
		path: '/401',
		name: 'Page401',
		component: () => import('@/views/errorPage/401.vue'),
		meta: {
			hidden: true
		}
	}
]

export const notFoundRoute: RouteRecordRaw = {
	path: '/:pathMatch(.*)*',
	name: 'NotFound',
	meta: {
		title: '404',
		hidden: true
	},
	redirect: '/'
}

export const constantRoutes: RouteRecordRaw[] = [
	{
		path: '',
		component: Layout,
		redirect: '/index',
		children: [
			{
				path: '/index',
				component: () => import('@/views/index.vue'),
				name: 'Index',
				meta: {
					title: '首页',
					icon: 'dashboard',
					affix: true
				}
			}
		]
	},
	{
		path: '/redirect',
		component: Layout,
		meta: { hidden: true },
		children: [
			{
				path: '/redirect/:path(.*)',
				component: () => import('@/views/redirect/index.vue')
			}
		]
	},
	{
		path: '/login',
		name: 'Login',
		component: () => import('@/views/login/index.vue'),
		meta: {
			title: '登录',
			hidden: true
		}
	},
	{
		path: '/demo',
		redirect: '/demo/index',
		component: Layout,
		meta: {
			title: 'demo',
			icon: 'project',
			alwaysShow: true
		},
		children: [
			{
				path: 'index',
				name: 'demo',
				component: () => import('@/views/demo/index.vue'),
				meta: {
					title: '生成表单',
					icon: 'project'
				}
			}
		]
	},
	{
		path: '/system',
		redirect: 'noRedirect',
		component: Layout,
		meta: {
			hidden: true
		},
		children: [
			{
				path: 'user/profile',
				component: () => import('@/views/system/user/profile/index.vue'),
				name: 'Profile',
				meta: {
					title: '个人中心',
					icon: 'user'
				}
			}
		]
	}
]

export const asyncRoutes: RouteRecordRaw[] = [
	// {
	// 	path: '/',
	// 	component: Layout,
	// 	redirect: '/home',
	// 	meta: {
	// 		title: '首页',
	// 		breadcrumb: false
	// 	},
	// 	children: [
	// 		{
	// 			path: 'home',
	// 			name: 'Home',
	// 			component: () => import('@/views/home/index.vue'),
	// 			meta: {
	// 				title: '首页',
	// 				affix: true,
	// 				icon: 'dashboard'
	// 			}
	// 		}
	// 	]
	// },
	// {
	// 	path: '/guide',
	// 	redirect: '/guide/index',
	// 	component: Layout,
	// 	meta: {
	// 		title: '指南',
	// 		icon: 'guide',
	// 		roles: ['admin'],
	// 		alwaysShow: true
	// 	},
	// 	children: [
	// 		{
	// 			path: 'index',
	// 			name: 'Guide',
	// 			component: () => import('@/views/guide/index.vue'),
	// 			meta: { title: '指南', icon: 'guide' }
	// 		}
	// 	]
	// },
	// ...errorPage,
	// notFoundRoute
]
