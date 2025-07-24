import { store } from '@/store'
export const useErrorStore = defineStore('error', () => {
	const logs = ref<Record<string, string>[]>([])
	function addErrorLog(log) {
		logs.value.push(log)
	}
	function clearErrorLog() {
		logs.value.splice(0)
	}

	return {
		addErrorLog,
		clearErrorLog,
		logs
	}
})

export function useErrorStoreWithOut() {
	return useErrorStore(store)
}
