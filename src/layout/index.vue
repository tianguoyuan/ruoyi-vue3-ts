<script setup lang="ts" name="Layout">
import { computed } from 'vue'

import BackToTop from '@/components/BackToTop/index.vue'
import RightPanel from '@/components/RightPanel/index.vue'
import { useAppStore } from '@/store/app'
import { useSettingsStore } from '@/store/settings'

import { AppMain, Navbar, Settings, Sidebar, TagsView } from './components'

const appStore = useAppStore()
const settingsStore = useSettingsStore()
const sidebarOpened = computed(() => appStore.sidebarOpened)
const device = computed(() => appStore.device)
const showSettings = computed(() => settingsStore.settings.showSettings)
const fixedHeader = computed(() => settingsStore.settings.fixedHeader)
const needTagsView = computed(() => settingsStore.settings.tagsView)

const classObj = computed(() => {
	return {
		hideSidebar: !sidebarOpened.value,
		mobile: device.value === 'mobile',
		openSidebar: sidebarOpened.value,
		withoutAnimation: false
	}
})
function handleSidebarOpen() {
	appStore.toggleSideBar()
}
</script>

<template>
	<div
		class="app-wrapper"
		:class="classObj"
	>
		<!-- 遮罩层999 menu1001 -->
		<div
			v-if="device === 'mobile' && sidebarOpened"
			class="drawer-bg"
			@click="handleSidebarOpen"
		/>
		<Sidebar class="sidebar-container" />
		<div
			class="main-container"
			:class="{ hasTagsView: needTagsView }"
		>
			<div :class="{ 'fixed-header': fixedHeader }">
				<Navbar />
				<TagsView v-if="needTagsView" />
			</div>
			<AppMain />
			<RightPanel v-if="showSettings">
				<Settings />
			</RightPanel>
		</div>
		<BackToTop />
	</div>
</template>

<style lang="scss" scoped>
@import '@/styles/variables.scss';
.app-wrapper {
	position: relative;
	width: 100%;
	height: 100%;
	&.mobile.openSidebar {
		position: fixed;
		top: 0;
	}
}
.drawer-bg {
	position: absolute;
	top: 0;
	z-index: 999;
	width: 100%;
	height: 100%;
	background: #000000;
	opacity: 0.3;
}
.fixed-header {
	position: fixed;
	top: 0;
	right: 0;
	z-index: 9;
	width: calc(100% - #{$sideBarWidth});
	transition: width 0.28s;
}
.hideSidebar .fixed-header {
	width: calc(100% - 54px);
}
.mobile .fixed-header {
	width: 100%;
}
</style>
