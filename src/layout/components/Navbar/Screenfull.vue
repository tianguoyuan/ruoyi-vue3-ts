<script setup lang="ts">
import screenfull from 'screenfull'
import { ElMessage } from 'element-plus'
const isFullscreen = ref(false)
onMounted(() => {
	init()
})
onUnmounted(() => {
	destroy()
})

function init() {
	if (screenfull.isEnabled) {
		screenfull.on('change', change)
	}
}

function click() {
	if (!screenfull.isEnabled) {
		ElMessage.warning('you browser can not work')
		return
	}
	screenfull.toggle()
}
function destroy() {
	if (screenfull.isEnabled) {
		screenfull.off('change', change)
	}
}
function change() {
	isFullscreen.value = screenfull.isFullscreen
}
</script>

<template>
	<div>
		<SvgIcon
			:icon-class="isFullscreen ? 'fullscreen-exit' : 'fullscreen'"
			size="18px"
			@click="click"
		/>
	</div>
</template>

<style scoped></style>
