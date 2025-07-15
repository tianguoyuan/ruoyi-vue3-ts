<script setup lang="ts" name="Settings">
import { useSettingsStore } from '@/store/settings'
import { computed } from 'vue'

const settingsStore = useSettingsStore()
const tagsView = computed({
	set(val: boolean) {
		settingsStore.changeSettings({
			key: 'tagsView',
			value: val
		})
	},
	get() {
		return settingsStore.settings.tagsView
	}
})
const fixedHeader = computed({
	set(val: boolean) {
		settingsStore.changeSettings({
			key: 'fixedHeader',
			value: val
		})
	},
	get() {
		return settingsStore.settings.fixedHeader
	}
})
const sidebarLogo = computed({
	set(val: boolean) {
		settingsStore.changeSettings({
			key: 'sidebarLogo',
			value: val
		})
	},
	get() {
		return settingsStore.settings.sidebarLogo
	}
})
const watermarkEnabled = computed({
	set(val: boolean) {
		settingsStore.changeSettings({
			key: 'watermarkEnabled',
			value: val
		})
	},
	get() {
		return settingsStore.settings.watermarkEnabled
	}
})
</script>

<template>
	<div class="drawer-container">
		<div>
			<h3 class="drawer-title">Page style setting</h3>

			<div class="drawer-item">
				<span>Open Tags-View</span>
				<el-switch
					v-model="tagsView"
					class="drawer-switch"
				/>
			</div>

			<div class="drawer-item">
				<span>Fixed Header</span>
				<el-switch
					v-model="fixedHeader"
					class="drawer-switch"
				/>
			</div>

			<div class="drawer-item">
				<span>Sidebar Logo</span>
				<el-switch
					v-model="sidebarLogo"
					class="drawer-switch"
				/>
			</div>

			<div class="drawer-item">
				<span>watermarkEnabled</span>
				<el-switch
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
