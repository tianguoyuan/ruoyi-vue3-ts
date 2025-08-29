<script setup lang="ts" name="RightPanel">
import { useSettingsStore } from '@/store/settings'
import { addClass, removeClass } from '@/utils'
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { Close, Setting } from '@element-plus/icons-vue'
const props = defineProps({
	clickNotClose: Boolean,
	buttonTop: {
		type: Number,
		default: 250
	}
})

const settingsStore = useSettingsStore()
const show = ref(false)
const rightPanelRef = ref<null | HTMLElement>(null)

const theme = computed(() => settingsStore.settings.theme)
watch(show, () => {
	if (show.value && !props.clickNotClose) {
		addEventClick()
	}
	if (show.value) {
		addClass(document.body, 'showRightPanel')
	} else {
		removeClass(document.body, 'showRightPanel')
	}
})

onMounted(() => {
	insertToBody()
})
onUnmounted(() => {
	rightPanelRef.value?.remove()
})

function addEventClick() {
	window.addEventListener('click', closeSideBar)
}
function closeSideBar(e: Event) {
	const parent = (e.target as Element)?.closest('.rightPanel')
	// 如果父组件 .className找不到
	if (!parent) {
		show.value = false
		window.removeEventListener('click', closeSideBar)
	}
}
function insertToBody() {
	rightPanelRef.value && document.body.insertBefore(rightPanelRef.value, document.body.firstChild)
}
</script>

<template>
	<div
		ref="rightPanelRef"
		:class="{ show: show }"
		class="rightPanel-container"
	>
		<div class="rightPanel-background" />
		<div class="rightPanel">
			<div
				class="handle-button"
				:style="{ top: props.buttonTop + 'px', 'background-color': theme }"
				@click.stop="show = !show"
			>
				<el-icon v-if="show"><Close /></el-icon>
				<el-icon v-else><Setting /></el-icon>
			</div>
			<div class="rightPanel-items">
				<slot />
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.rightPanel-background {
	position: fixed;
	top: 0;
	left: 0;
	z-index: -1;
	background: rgb(0 0 0 / 20%);
	opacity: 0;
	transition: opacity 0.3s cubic-bezier(0.7, 0.3, 0.1, 1);
}
.rightPanel {
	position: fixed;
	top: 0;
	right: 0;
	z-index: 40000;
	width: 100%;
	max-width: 260px;
	height: 100vh;
	background: #ffffff;
	box-shadow: 0 0 15px 0 rgb(0 0 0 / 5%);
	transition: all 0.25s cubic-bezier(0.7, 0.3, 0.1, 1);
	transform: translate(100%);
}
.show {
	transition: all 0.3s cubic-bezier(0.7, 0.3, 0.1, 1);
	.rightPanel-background {
		z-index: 20000;
		width: 100%;
		height: 100%;
		opacity: 1;
	}
	.rightPanel {
		transform: translate(0);
	}
}
.handle-button {
	position: absolute;
	left: -48px;
	z-index: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 48px;
	height: 48px;
	color: #ffffff;
	text-align: center;
	pointer-events: auto;
	cursor: pointer;
	border-radius: 6px 0 0 6px !important;
	i {
		font-size: 24px;
	}
}
</style>
