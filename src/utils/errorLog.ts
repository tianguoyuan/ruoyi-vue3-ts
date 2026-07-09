import Vue from 'vue'

import settings from '@/settings'
import { useErrorStoreWithOut } from '@/store/error'

import { isString, isArray } from './is'

const { needErrorLog } = settings

function checkNeed() {
	const NODE_ENV = import.meta.env.VITE_USER_NODE_ENV
	return needErrorLog.includes(NODE_ENV)
}

if (checkNeed()) {
	Vue.onErrorCaptured((err, vm, info) => {
		Vue.nextTick(() => {
			const errorStore = useErrorStoreWithOut()
			errorStore.addErrorLog({
				err,
				info,
				url: window.location.href,
				vm
			})
		})
	})
}
