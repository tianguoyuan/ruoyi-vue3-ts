import { defineStore } from 'pinia'
import { store } from '.'
import { useStorage } from '@vueuse/core'
import defaultSettings from '@/settings'
import { computed, ref } from 'vue'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import en from 'element-plus/es/locale/lang/en'
import type { ISizeEnumType } from '@/enums/SizeEnum'

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
		language,
		locale,
		size,
		setSize,
		sidebarOpened,
		sidebarWithoutAnimation,
		toggleSideBar,
		closeSideBar,
		device,
		toggleDevice
	}
})

export function useAppStoreWithOut() {
	return useAppStore(store)
}
