import { defineStore } from 'pinia'
import { ref } from 'vue'

import type { RouteLocationNormalizedLoaded } from 'vue-router'

import { store } from '.'

export const useTagsViewStore = defineStore('tagsView', () => {
	const cachedViews = ref<string[]>([])
	const visitedViews = ref<RouteLocationNormalizedLoaded[]>([])
	// const cachedViews = useLocalStorage<string[]>('cachedViews', [])
	// const visitedViews = useLocalStorage<RouteLocationNormalizedLoaded[]>('visitedViews', [])

	function addVisitedView(view: RouteLocationNormalizedLoaded) {
		if (visitedViews.value.some(v => v.path === view.path)) return

		visitedViews.value.push(
			Object.assign({}, view, {
				title: view.meta.title || 'no-name'
			})
		)
	}
	function delVisitedView({ path }: { path: string }) {
		for (const [i, v] of visitedViews.value.entries()) {
			if (v.path === path) {
				visitedViews.value.splice(i, 1)
				break
			}
		}
	}
	function delCachedView({ name }: { name: string }) {
		const index = cachedViews.value.indexOf(name)
		index > -1 && cachedViews.value.splice(index, 1)
	}

	function addCachedView(view: RouteLocationNormalizedLoaded) {
		if (cachedViews.value.includes(view.name as string)) return
		if (view.meta.noCache) return
		cachedViews.value.push(view.name as string)
	}
	function addView(view: RouteLocationNormalizedLoaded) {
		addVisitedView(view)
		addCachedView(view)
	}
	function updateVisitedView(view: RouteLocationNormalizedLoaded) {
		for (let v of visitedViews.value) {
			if (v.path === view.path) {
				v = Object.assign(v, view)
				break
			}
		}
	}
	function delView(view: { path: string; name: string }) {
		delVisitedView({ path: view.path })
		delCachedView({ name: view.name })

		return {
			cachedViews: [...cachedViews.value],
			visitedViews: [...visitedViews.value]
		}
	}

	function delOthersVisitedViews(view: { path: string }) {
		visitedViews.value = visitedViews.value.filter(v => {
			return v.meta.affix || v.path === view.path
		})
	}
	function delOthersCachedViews(view: { name: string }) {
		const index = cachedViews.value.indexOf(view.name)
		if (index > -1) {
			cachedViews.value = cachedViews.value.slice(index, index + 1)
		} else {
			// if index = -1, there is no cached tags
			cachedViews.value = []
		}
	}
	function delOthersViews(view: { path: string; name: string }) {
		delOthersVisitedViews({ path: view.path })
		delOthersCachedViews({ name: view.name })

		return {
			cachedViews: [...cachedViews.value],
			visitedViews: [...visitedViews.value]
		}
	}

	function delAllCachedViews() {
		cachedViews.value = []
	}
	function delAllVisitedViews() {
		const affixTags = visitedViews.value.filter(tag => tag.meta.affix)
		visitedViews.value = affixTags
	}

	function delAllViews() {
		delAllVisitedViews()
		delAllCachedViews()
		return {
			cachedViews: [...cachedViews.value],
			visitedViews: [...visitedViews.value]
		}
	}

	return {
		addView,
		addVisitedView,
		cachedViews,
		delAllViews,
		delCachedView,
		delOthersViews,
		delView,
		delVisitedView,
		updateVisitedView,
		visitedViews
	}
})

export function useTagsViewStoreWithOut() {
	return useTagsViewStore(store)
}
