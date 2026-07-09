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
	<ElConfigProvider
		:locale="locale"
		:size="size"
	>
		<ElWatermark
			:content="settingsStore.settings.watermarkEnabled ? settingsStore.settings.watermarkContent : ''"
			:zIndex="9999"
		>
			<RouterView />
		</ElWatermark>
	</ElConfigProvider>
</template>
