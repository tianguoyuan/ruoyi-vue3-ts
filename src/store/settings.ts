import { defineStore } from 'pinia'
import { ref } from 'vue'

import defaultSettings from '@/settings'
import variables from '@/styles/element-variables.module.scss'

import { store } from '.'

const { fixedHeader, showSettings, sidebarLogo, tagsView, watermarkContent, watermarkEnabled } = defaultSettings

interface ISettings {
	theme: string
	showSettings: boolean
	tagsView: boolean
	fixedHeader: boolean
	sidebarLogo: boolean

	watermarkEnabled: boolean
	watermarkContent: string
}
type ISettingsKey = keyof ISettings
export const useSettingsStore = defineStore('settings', () => {
	const settings = ref<ISettings>({
		fixedHeader,
		showSettings,
		sidebarLogo,
		tagsView,
		theme: variables['theme'],
		watermarkContent,
		watermarkEnabled
	})
	function changeSettings<K extends ISettingsKey>({ key, value }: { key: K; value: ISettings[K] }) {
		if (Object.prototype.hasOwnProperty.call(settings.value, key)) {
			settings.value[key] = value
		}
	}
	return {
		changeSettings,
		settings
	}
})

export function useSettingsStoreWithOut() {
	return useSettingsStore(store)
}
