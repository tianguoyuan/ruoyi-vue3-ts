import { defineStore } from 'pinia'
import { store } from '.'
import defaultSettings from '@/settings'
import variables from '@/styles/element-variables.module.scss'
import { ref } from 'vue'
const { showSettings, tagsView, fixedHeader, sidebarLogo, watermarkEnabled, watermarkContent } = defaultSettings

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
		theme: variables['theme'],
		showSettings,
		tagsView,
		fixedHeader,
		sidebarLogo,
		watermarkEnabled,
		watermarkContent
	})
	const changeSettings = <K extends ISettingsKey>({ key, value }: { key: K; value: ISettings[K] }) => {
		if (Object.prototype.hasOwnProperty.call(settings.value, key)) {
			settings.value[key] = value
		}
	}
	return {
		settings,
		changeSettings
	}
})

export const useSettingsStoreWithOut = () => {
	return useSettingsStore(store)
}
