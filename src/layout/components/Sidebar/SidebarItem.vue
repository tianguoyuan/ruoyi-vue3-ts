<script setup lang="ts" name="SidebarItem">
import path from 'path-browserify'

import { isExternal } from '@/utils/is'
import type { RouteRecordRaw } from 'vue-router'

import AppLink from './Link.vue'
import MenuItem from './MenuItem'
// import SidebarItem from './SidebarItem.vue'

const props = withDefaults(
	defineProps<{
		item: RouteRecordRaw
		isNest?: boolean
		basePath?: string
	}>(),
	{
		basePath: '',
		isNest: false
	}
)

type IOnlyOneChild = RouteRecordRaw & { noShowingChildren?: boolean }
const onlyOneChild = ref<IOnlyOneChild | null>(null)

function hasOneShowingChild(children: RouteRecordRaw[] = [], parent: RouteRecordRaw) {
	const showingChildren = children.filter(item => {
		if (item.meta?.hidden) {
			return false
		} else {
			onlyOneChild.value = item
			return true
		}
	})

	if (showingChildren.length === 1) {
		return true
	}

	if (showingChildren.length === 0) {
		onlyOneChild.value = {
			...parent,
			noShowingChildren: true,
			path: ''
		}
		return true
	}

	return false
}

function resolvePath(routePath: string) {
	if (isExternal(routePath)) {
		return routePath
	}

	if (isExternal(props.basePath)) {
		return props.basePath
	}

	return path.resolve(props.basePath, routePath)
}
</script>

<template>
	<div v-if="!props.item.meta?.hidden">
		<template
			v-if="
				hasOneShowingChild(item.children, item) &&
				(!onlyOneChild?.children || onlyOneChild?.noShowingChildren) &&
				!item.meta?.alwaysShow
			"
		>
			<AppLink
				v-if="onlyOneChild?.meta"
				:to="resolvePath(onlyOneChild.path)"
			>
				<ElMenuItem
					:class="{ 'submenu-title-noDropdown': !isNest }"
					:index="resolvePath(onlyOneChild.path)"
				>
					<MenuItem
						:icon="onlyOneChild.meta.icon || (item.meta && item.meta.icon)"
						:title="onlyOneChild.meta.title"
					/>
				</ElMenuItem>
			</AppLink>
		</template>

		<ElSubMenu
			v-else
			ref="subMenu"
			:index="resolvePath(props.item.path)"
			popperAppendToBody
		>
			<template #title>
				<MenuItem
					v-if="props.item.meta"
					:icon="props.item.meta.icon"
					:title="props.item.meta.title"
				/>
			</template>
			<SidebarItem
				v-for="child in props.item.children"
				:key="child.path"
				:basePath="resolvePath(child.path)"
				class="nest-menu"
				:isNest="true"
				:item="child"
			/>
		</ElSubMenu>
	</div>
</template>
