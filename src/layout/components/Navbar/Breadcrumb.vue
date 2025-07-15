<script setup lang="ts">
import * as pathToRegexp from 'path-to-regexp'
import { useRoute, useRouter, type RouteRecordRaw } from 'vue-router'
import { onMounted, ref, watch } from 'vue'

const route = useRoute()
const router = useRouter()
const levelList = ref<RouteRecordRaw[]>([])
onMounted(() => {
	getBreadcrumb()
})

watch(
	() => route.path,
	() => {
		if (route.path.startsWith('/redirect')) return
		getBreadcrumb()
	}
)
function getBreadcrumb() {
	let matched = route.matched.filter(item => item.meta && item.meta.title)
	const first = matched[0]
	if (!isDashboard(first)) {
		// 面包屑 第一个 等于 回到首页
		// matched = [{ path: '/dashboard', meta: { title: 'dashboard' } }].concat(matched)
	}
	levelList.value = matched.filter(item => item.meta && item.meta.title && item.meta.breadcrumb !== false)
}
function isDashboard(route: RouteRecordRaw) {
	const name = route.name
	if (!name) return false
	return name.toString().trim().toLocaleLowerCase() === 'dashboard'
}
function pathCompile(path: string) {
	// To solve this problem https://github.com/PanJiaChen/vue-element-admin/issues/561
	const { params } = route
	const toPath = pathToRegexp.compile(path)
	return toPath(params)
}
function handleLink(item: RouteRecordRaw) {
	const { redirect, path } = item
	if (redirect) {
		router.push(redirect as string)
		return
	}
	router.push(pathCompile(path))
}
</script>

<template>
	<ElBreadcrumb
		class="app-breadcrumb"
		separator="/"
	>
		<TransitionGroup name="breadcrumb">
			<ElBreadcrumbItem
				v-for="(item, index) in levelList"
				:key="item.path"
			>
				<span
					v-if="item.redirect === 'noRedirect' || index === levelList.length - 1"
					class="no-redirect"
				>
					{{ item.meta?.title }}
				</span>
				<a
					v-else
					@click.prevent="handleLink(item)"
				>
					{{ item.meta?.title }}
				</a>
			</ElBreadcrumbItem>
		</TransitionGroup>
	</ElBreadcrumb>
</template>

<style lang="scss" scoped>
.app-breadcrumb.el-breadcrumb {
	display: inline-block;
	font-size: 14px;
	line-height: 50px;
	margin-left: 8px;

	.no-redirect {
		color: #97a8be;
		cursor: text;
	}
}
</style>
