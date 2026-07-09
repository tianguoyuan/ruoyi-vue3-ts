import Layout from '@/layout/index.vue'
import type { RouteRecordRaw } from 'vue-router'

export const errorPageRoute: RouteRecordRaw[] = [
	{
		component: () => import('@/views/errorPage/404.vue'),
		meta: {
			hidden: true
		},
		name: 'Page404',
		path: '/404'
	},
	{
		component: () => import('@/views/errorPage/401.vue'),
		meta: {
			hidden: true
		},
		name: 'Page401',
		path: '/401'
	}
]

export const notFoundRoute: RouteRecordRaw = {
	component: () => import('@/views/errorPage/404.vue'),
	// name: 'NotFound',
	meta: {
		hidden: true,
		title: '404'
	},
	path: '/:pathMatch(.*)*'
}

export const constantRoutes: RouteRecordRaw[] = [
	{
		children: [
			{
				component: () => import('@/views/index.vue'),
				meta: {
					affix: true,
					icon: 'dashboard',
					title: '首页'
				},
				name: 'Index',
				path: '/index'
			}
		],
		component: Layout,
		path: '',
		redirect: '/index'
	},
	{
		children: [
			{
				component: () => import('@/views/redirect/index.vue'),
				path: '/redirect/:path(.*)'
			}
		],
		component: Layout,
		meta: { hidden: true },
		path: '/redirect'
	},
	{
		component: () => import('@/views/login/index.vue'),
		meta: {
			hidden: true,
			title: '登录'
		},
		name: 'Login',
		path: '/login'
	},
	{
		children: [
			{
				component: () => import('@/views/demo/index.vue'),
				meta: {
					icon: 'log',
					title: '生成表单'
				},
				name: 'Demo',
				path: 'index'
			}
		],
		component: Layout,
		meta: {
			alwaysShow: true,
			icon: 'download',
			title: 'demo'
		},
		path: '/demo',
		redirect: '/demo/index'
	},
	{
		children: [
			{
				component: () => import('@/views/system/user/profile/index.vue'),
				meta: {
					icon: 'user',
					title: '个人中心'
				},
				name: 'Profile',
				path: 'user/profile'
			}
		],
		component: Layout,
		meta: {
			hidden: true
		},
		path: '/system',
		redirect: 'noRedirect'
	},
	...errorPageRoute,
	notFoundRoute
]

// 动态路由，基于用户权限动态去加载
export const asyncRoutes: RouteRecordRaw[] = [
	{
		children: [
			{
				component: () => import('@/views/tool/gen/editTable.vue'),
				meta: {
					activeMenu: '/tool/gen',
					title: '修改生成配置'
				},
				name: 'GenEditIndex',
				path: 'index/:tableId(\\d+)'
			}
		],
		component: Layout,
		meta: {
			hidden: true,
			permissions: ['tool:gen:edit']
		},
		path: '/tool/gen-edit'
	},
	{
		children: [
			{
				component: () => import('@/views/monitor/job/log.vue'),
				meta: {
					activeMenu: '/monitor/job',
					title: '调度日志'
				},
				name: 'JobLog',
				path: 'index/:jobId(\\d+)'
			}
		],
		component: Layout,
		meta: {
			hidden: true,
			permissions: ['monitor:job:list']
		},
		path: '/monitor/job-log'
	},

	// 用户管理-分配角色
	{
		children: [
			{
				component: () => import('@/views/system/user/authRole.vue'),
				meta: {
					activeMenu: '/system/user',
					title: '分配角色'
				},
				name: 'AuthRole',
				path: 'role/:userId(\\d+)'
			}
		],
		component: Layout,
		meta: {
			hidden: true,
			permissions: ['system:user:edit']
		},
		path: '/system/user-auth'
	},

	// 角色管理-分配角色
	{
		children: [
			{
				component: () => import('@/views/system/role/authUser.vue'),
				meta: {
					activeMenu: '/system/role',
					title: '分配用户'
				},
				name: 'AuthUser',
				path: 'user/:roleId(\\d+)'
			}
		],
		component: Layout,
		meta: {
			hidden: true,
			permissions: ['system:role:edit']
		},
		path: '/system/role-auth'
	},
	// 字典管理-字典数据
	{
		children: [
			{
				component: () => import('@/views/system/dict/data.vue'),
				meta: {
					activeMenu: '/system/dict',
					title: '字典数据'
				},
				name: 'DictData',
				path: 'index/:dictId(\\d+)'
			}
		],
		component: Layout,
		meta: {
			hidden: true,
			permissions: ['system:dict:list']
		},
		path: '/system/dict-data'
	}
]
