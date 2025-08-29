<script setup lang="ts" name="TagsView">
import { getCurrentInstance, type ComponentInternalInstance } from 'vue'
import path from 'path-browserify'
import ScrollPane from './ScrollPane.vue'
import { useTagsViewStore } from '@/store/tagsView'
import { usePermissionStore } from '@/store/permission'
import type { _RouterLinkI, RouteLocationNormalizedLoaded, RouteLocationRaw, RouteRecordRaw, RouterLinkProps } from 'vue-router'
import { Close } from '@element-plus/icons-vue'

const visible = ref(false)
const top = ref(0)
const left = ref(0)
const selectedTag = ref<RouteLocationNormalizedLoaded | undefined>(undefined)
const affixTags = ref<RouteLocationNormalizedLoaded[]>([])

const tagsStore = useTagsViewStore()
const permissionStore = usePermissionStore()
const visitedViews = computed(() => tagsStore.visitedViews)
const routes = computed(() => permissionStore.routes)

const route = useRoute()
const router = useRouter()
const { proxy } = getCurrentInstance() as ComponentInternalInstance

watch(
	() => route.path,
	() => {
		addTags()
		moveToCurrentTag()
	}
)
watch(visible, () => {
	if (visible.value) {
		document.body.addEventListener('click', closeMenu)
	} else {
		document.body.removeEventListener('click', closeMenu)
	}
})
onMounted(() => {
	initTags()
	addTags()
})
function isActive(activeRoute: RouteLocationNormalizedLoaded) {
	return activeRoute.path === route.path
}
function isAffix(tag?: RouteLocationNormalizedLoaded) {
	if (!tag) return
	return tag.meta && tag.meta.affix
}
function filterAffixTags(routes: any[], basePath = '/') {
	let tags: any[] = []
	routes.forEach(route => {
		const tagPath = path.resolve(basePath, route!.path)
		if (route.meta && route.meta.affix) {
			tags.push({
				path: tagPath,
				name: route.name,
				meta: { ...route.meta }
			})
		}

		if (route.children) {
			const tempTags = filterAffixTags(route.children, tagPath)
			if (tempTags.length > 0) {
				tags = [...tags, ...tempTags]
			}
		}
	})
	return tags
}
function initTags() {
	affixTags.value = filterAffixTags(routes.value)
	for (const tag of affixTags.value) {
		if (tag.name) {
			tagsStore.addVisitedView(tag)
		}
	}
}
function addTags() {
	const { name } = route
	if (!name) return
	tagsStore.addView(route)
}

const tagRef = ref<Record<string, any>[] | null>(null)
const scrollPaneRef = ref<InstanceType<typeof ScrollPane> | null>(null)
function moveToCurrentTag() {
	nextTick(() => {
		if (!tagRef.value) return
		for (const tag of tagRef.value) {
			if (tag.to?.path === route.path) {
				scrollPaneRef.value?.moveToTarget(tag)
				if (tag.to?.fullPath !== route.fullPath) {
					tagsStore.updateVisitedView(route)
				}
			}
		}
	})
}
function refreshSelectedTag(view?: RouteLocationNormalizedLoaded) {
	if (!view) return
	tagsStore.delCachedView({ name: view.name as string })
	nextTick(() => {
		router.replace({ path: '/redirect' + (view.fullPath || view.path) })
	})
}
function closeSelectedTag(view?: RouteLocationNormalizedLoaded) {
	if (!view) return
	const { visitedViews } = tagsStore.delView({
		path: view.path,
		name: view.name as string
	})
	if (isActive(view)) {
		toLastView(visitedViews, view)
	}
}
function closeOthersTags() {
	if (!selectedTag.value) return
	router.push(selectedTag.value)
	tagsStore.delOthersViews({
		path: selectedTag.value.path,
		name: selectedTag.value.name as string
	})
	moveToCurrentTag()
}
function closeAllTags(view?: RouteLocationNormalizedLoaded) {
	if (!view) return
	const { visitedViews } = tagsStore.delAllViews()
	const currentRoutePath = route.path === view.path ? view.path : route.path
	if (affixTags.value.some(tag => tag.path === currentRoutePath)) {
		return
	}
	toLastView(visitedViews, view)
}
function toLastView(visitedViews: RouteLocationNormalizedLoaded[], view: RouteLocationNormalizedLoaded) {
	const latestView = visitedViews.slice(-1)[0]
	console.log('latestView', latestView)

	if (latestView) {
		router.push(latestView.path)
	} else {
		if (view.name === 'Dashboard') {
			router.replace({ path: '/redirect' + view.path })
		} else {
			router.push('/')
		}
	}
}
function openMenu(tag: RouteLocationNormalizedLoaded, e: MouseEvent) {
	if (!proxy) return
	const $el = proxy.$el
	const menuMinWidth = 105
	const offsetLeft = $el.getBoundingClientRect().left
	const offsetWidth = $el.offsetWidth
	const maxLeft = offsetWidth - menuMinWidth
	const leftNum = e.clientX - offsetLeft + 15

	if (leftNum > maxLeft) {
		left.value = maxLeft
	} else {
		left.value = leftNum
	}

	top.value = e.clientY
	visible.value = true
	selectedTag.value = tag
}

function closeMenu() {
	visible.value = false
}
function handleScroll() {
	closeMenu()
}
</script>

<template>
	<div
		id="tags-view-container"
		class="tags-view-container"
	>
		<ScrollPane
			ref="scrollPaneRef"
			class="tags-view-wrapper"
			@scroll="handleScroll"
		>
			<router-link
				v-for="tag in visitedViews"
				ref="tag"
				:key="tag.path"
				:class="isActive(tag) ? 'active' : ''"
				:to="{ path: tag.path, query: tag.query }"
				class="tags-view-item"
				@click.middle="!isAffix(tag) ? closeSelectedTag(tag) : ''"
				@contextmenu.prevent="openMenu(tag, $event)"
			>
				{{ tag.meta.title }}
				<ElIcon
					v-if="!isAffix(tag)"
					class="el-icon-close"
					@click.prevent.stop="closeSelectedTag(tag)"
				>
					<Close />
				</ElIcon>
			</router-link>
		</ScrollPane>
		<ul
			v-show="visible"
			:style="{ left: left + 'px', top: top + 'px' }"
			class="contextmenu"
		>
			<li @click="refreshSelectedTag(selectedTag)">刷新</li>
			<li
				v-if="!isAffix(selectedTag)"
				@click="closeSelectedTag(selectedTag)"
			>
				关闭
			</li>
			<li @click="closeOthersTags">关闭其它</li>
			<li @click="closeAllTags(selectedTag)">关闭所有</li>
		</ul>
	</div>
</template>

<style lang="scss" scoped>
.tags-view-container {
	width: 100%;
	height: 34px;
	background: #ffffff;
	border-bottom: 1px solid #d8dce5;
	box-shadow:
		0 1px 3px 0 rgb(0 0 0 / 12%),
		0 0 3px 0 rgb(0 0 0 / 4%);
	.tags-view-wrapper {
		.tags-view-item {
			position: relative;
			display: inline-block;
			height: 26px;
			padding: 0 8px;
			margin-top: 4px;
			margin-left: 5px;
			font-size: 12px;
			line-height: 26px;
			color: #495060;
			cursor: pointer;
			background: #ffffff;
			border: 1px solid #d8dce5;
			&:first-of-type {
				margin-left: 15px;
			}
			&:last-of-type {
				margin-right: 15px;
			}
			&.active {
				color: #ffffff;
				background-color: #42b983;
				border-color: #42b983;
				&::before {
					position: relative;
					display: inline-block;
					width: 8px;
					height: 8px;
					margin-right: 6px;
					content: '';
					background: #ffffff;
					border-radius: 50%;
				}
			}
		}
	}
	.contextmenu {
		position: absolute;
		z-index: 3000;
		padding: 5px 0;
		margin: 0;
		font-size: 12px;
		font-weight: 400;
		color: #333333;
		list-style-type: none;
		background: #ffffff;
		border-radius: 4px;
		box-shadow: 2px 2px 3px 0 rgb(0 0 0 / 30%);
		li {
			padding: 7px 16px;
			margin: 0;
			cursor: pointer;
			&:hover {
				background: #eeeeee;
			}
		}
	}
}
</style>

<style lang="scss">
// reset element css of el-icon-close
.tags-view-wrapper {
	.tags-view-item {
		.el-icon-close {
			width: 16px;
			height: 16px;
			text-align: center;
			vertical-align: -0.15em;
			border-radius: 50%;
			transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
			transform-origin: 100% 50%;
			&::before {
				display: inline-block;
				vertical-align: -3px;
				transform: scale(0.6);
			}
			&:hover {
				color: #ffffff;
				background-color: #b4bccc;
			}
		}
	}
}
</style>
