<script setup lang="ts">
import { computed } from 'vue'

import type { ISizeEnumType } from './enums/SizeEnum'
import { useAppStore } from '@/store/app'

import { useSettingsStore } from './store/settings'
const appStore = useAppStore()

const locale = computed(() => appStore.locale)
const size = computed(() => appStore.size as ISizeEnumType)

const settingsStore = useSettingsStore()
</script>

<template>
	<el-config-provider
		:locale="locale"
		:size="size"
	>
		<el-watermark
			:z-index="9999"
			:content="settingsStore.settings.watermarkEnabled ? settingsStore.settings.watermarkContent : ''"
		>
			<RouterView />
		</el-watermark>
	</el-config-provider>
</template>
