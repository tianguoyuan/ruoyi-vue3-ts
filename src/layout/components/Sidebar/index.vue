<script setup lang="ts">
import { useAppStore } from '@/store/app'
import { usePermissionStore } from '@/store/permission'
import { useSettingsStore } from '@/store/settings'
import variables from '@/style/variables.scss'

import Logo from './Logo.vue'
import SidebarItem from './SidebarItem.vue'

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
		<ElScrollbar wrapClass="scrollbar-wrapper">
			<ElMenu
				activeTextColor="#409EFF"
				backgroundColor="#304156"
				:collapse="isCollapse"
				:collapseTransition="false"
				:defaultActive="activeMenu"
				mode="vertical"
				textColor="#bfcbd9"
				:uniqueOpened="true"
			>
				<SidebarItem
					v-for="item in permissionRoutes"
					:key="item.path"
					:basePath="item.path"
					:item="item"
				/>
			</ElMenu>
		</ElScrollbar>
	</div>
</template>
