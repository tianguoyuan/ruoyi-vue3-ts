<script setup lang="ts">
import Logo from './Logo.vue'
import SidebarItem from './SidebarItem.vue'
import { usePermissionStore } from '@/store/permission'
import { useAppStore } from '@/store/app'
import { useSettingsStore } from '@/store/settings'
import variables from '@/style/variables.scss'

const route = useRoute()
const appStore = useAppStore()
const permissionStore = usePermissionStore()
const settingsStore = useSettingsStore()

const showLogo = computed(() => settingsStore.settings.sidebarLogo)
const isCollapse = computed(() => !appStore.sidebarOpened)
const permissionRoutes = computed(() => permissionStore.routes)
const activeMenu = computed(() => {
	const { meta, path } = route
	return meta.activeMenu ? meta.activeMenu : path
})
</script>

<template>
	<div :class="{ 'has-logo': showLogo }">
		<Logo
			v-if="showLogo"
			:collapse="isCollapse"
		/>
		<ElScrollbar wrap-class="scrollbar-wrapper">
			<ElMenu
				:default-active="activeMenu"
				:collapse="isCollapse"
				:unique-opened="false"
				:collapse-transition="false"
				mode="vertical"
				background-color="#304156"
				text-color="#bfcbd9"
				active-text-color="#409EFF"
			>
				<SidebarItem
					v-for="item in permissionRoutes"
					:key="item.path"
					:item="item"
					:base-path="item.path"
				/>
			</ElMenu>
		</ElScrollbar>
	</div>
</template>
