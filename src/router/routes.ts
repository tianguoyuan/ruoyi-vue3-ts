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
	// name: 'NotFound',
	meta: {
		title: '404',
		hidden: true
	},
	component: () => import('@/views/errorPage/404.vue')
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
				name: 'Demo',
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
	},
	...errorPageRoute,
	notFoundRoute
]

// 动态路由，基于用户权限动态去加载
export const asyncRoutes: RouteRecordRaw[] = [
	{
		path: '/tool/gen-edit',
		component: Layout,
		meta: {
			hidden: true,
			permissions: ['tool:gen:edit']
		},
		children: [
			{
				path: 'index/:tableId(\\d+)',
				component: () => import('@/views/tool/gen/editTable.vue'),
				name: 'GenEditIndex',
				meta: {
					title: '修改生成配置',
					activeMenu: '/tool/gen'
				}
			}
		]
	},
	{
		path: '/monitor/job-log',
		component: Layout,
		meta: {
			hidden: true,
			permissions: ['monitor:job:list']
		},
		children: [
			{
				path: 'index/:jobId(\\d+)',
				component: () => import('@/views/monitor/job/log.vue'),
				name: 'JobLog',
				meta: {
					title: '调度日志',
					activeMenu: '/monitor/job'
				}
			}
		]
	},

	// 用户管理-分配角色
	{
		path: '/system/user-auth',
		component: Layout,
		meta: {
			hidden: true,
			permissions: ['system:user:edit']
		},
		children: [
			{
				path: 'role/:userId(\\d+)',
				component: () => import('@/views/system/user/authRole.vue'),
				name: 'AuthRole',
				meta: {
					title: '分配角色',
					activeMenu: '/system/user'
				}
			}
		]
	},

	// 角色管理-分配角色
	{
		path: '/system/role-auth',
		component: Layout,
		meta: {
			hidden: true,
			permissions: ['system:role:edit']
		},
		children: [
			{
				path: 'user/:roleId(\\d+)',
				component: () => import('@/views/system/role/authUser.vue'),
				name: 'AuthUser',
				meta: {
					title: '分配用户',
					activeMenu: '/system/role'
				}
			}
		]
	}
]
