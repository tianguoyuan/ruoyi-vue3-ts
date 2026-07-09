<script setup lang="ts" name="Settings">
import { computed } from 'vue'

import { useSettingsStore } from '@/store/settings'

const settingsStore = useSettingsStore()
const tagsView = computed({
	get() {
		return settingsStore.settings.tagsView
	},
	set(val: boolean) {
		settingsStore.changeSettings({
			key: 'tagsView',
			value: val
		})
	}
})
const fixedHeader = computed({
	get() {
		return settingsStore.settings.fixedHeader
	},
	set(val: boolean) {
		settingsStore.changeSettings({
			key: 'fixedHeader',
			value: val
		})
	}
})
const sidebarLogo = computed({
	get() {
		return settingsStore.settings.sidebarLogo
	},
	set(val: boolean) {
		settingsStore.changeSettings({
			key: 'sidebarLogo',
			value: val
		})
	}
})
const watermarkEnabled = computed({
	get() {
		return settingsStore.settings.watermarkEnabled
	},
	set(val: boolean) {
		settingsStore.changeSettings({
			key: 'watermarkEnabled',
			value: val
		})
	}
})
</script>

<template>
	<div class="drawer-container">
		<div>
			<h3 class="drawer-title">Page style setting</h3>

			<div class="drawer-item">
				<span>Open Tags-View</span>
				<ElSwitch
					v-model="tagsView"
					class="drawer-switch"
				/>
			</div>

			<div class="drawer-item">
				<span>Fixed Header</span>
				<ElSwitch
					v-model="fixedHeader"
					class="drawer-switch"
				/>
			</div>

			<div class="drawer-item">
				<span>Sidebar Logo</span>
				<ElSwitch
					v-model="sidebarLogo"
					class="drawer-switch"
				/>
			</div>

			<div class="drawer-item">
				<span>watermarkEnabled</span>
				<ElSwitch
					v-model="watermarkEnabled"
					class="drawer-switch"
				/>
			</div>
		</div>
	</div>
</template>
<style lang="scss" scoped>
.drawer-container {
	padding: 24px;
	font-size: 14px;
	line-height: 1.5;
	word-wrap: break-word;
	.drawer-title {
		margin-bottom: 12px;
		font-size: 14px;
		line-height: 22px;
		color: rgb(0 0 0 / 85%);
	}
	.drawer-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 12px 0;
		font-size: 14px;
		color: rgb(0 0 0 / 65%);
	}
}
</style>
