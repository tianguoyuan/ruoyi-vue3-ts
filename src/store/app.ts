import { useStorage } from '@vueuse/core'
import en from 'element-plus/es/locale/lang/en'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import type { ISizeEnumType } from '@/enums/SizeEnum'
import defaultSettings from '@/settings'

import { store } from '.'

export const useAppStore = defineStore('app', () => {
	/** 语言 */
	const language = useStorage('language', defaultSettings.language)
	/** 根据语言标识读取对应的语言包 */
	const locale = computed(() => {
		if (language.value === 'en') {
			return en
		} else {
			return zhCn
		}
	})

	/** 大小 */
	const size = useStorage('size', defaultSettings.size)
	function setSize(type: ISizeEnumType) {
		size.value = type
	}

	const sidebarOpened = useStorage('sidebarOpened', true)
	const sidebarWithoutAnimation = ref(false)
	function toggleSideBar() {
		sidebarOpened.value = !sidebarOpened.value
		sidebarWithoutAnimation.value = false
	}
	function closeSideBar(withoutAnimation: boolean) {
		sidebarOpened.value = false
		sidebarWithoutAnimation.value = withoutAnimation
	}

	type IDeviceType = 'desktop' | 'mobile'
	const device = ref<IDeviceType>('desktop')
	function toggleDevice(type: IDeviceType) {
		device.value = type
	}

	return {
		closeSideBar,
		device,
		language,
		locale,
		setSize,
		sidebarOpened,
		sidebarWithoutAnimation,
		size,
		toggleDevice,
		toggleSideBar
	}
})

export function useAppStoreWithOut() {
	return useAppStore(store)
}
