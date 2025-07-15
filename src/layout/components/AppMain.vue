<script setup lang="ts" name="AppMain">
import { useTagsViewStore } from '@/store/tagsView'
import { computed } from 'vue'

const tagsViewStore = useTagsViewStore()
const cachedViews = computed(() => tagsViewStore.cachedViews)
</script>

<template>
	<div class="app-main">
		<RouterView v-slot="{ Component, route }">
			<Transition
				enter-active-class="animate__animated animate__fadeIn"
				mode="out-in"
			>
				<KeepAlive :include="cachedViews">
					<component
						:is="Component"
						:key="route.fullPath"
					/>
				</KeepAlive>
			</Transition>
		</RouterView>
	</div>
</template>

<style lang="scss">
.app-main {
	position: relative;
	width: 100%;

	/* 50= navbar  50  */
	min-height: calc(100vh - 50px);
	overflow: hidden;
}
.fixed-header + .app-main {
	padding-top: 50px;
}
.hasTagsView {
	.app-main {
		/* 84 = navbar + tags-view = 50 + 34 */
		min-height: calc(100vh - 84px);
	}
	.fixed-header + .app-main {
		padding-top: 84px;
	}
}
</style>
