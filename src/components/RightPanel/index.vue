<script setup lang="ts" name="RightPanel">
import { useSettingsStore } from '@/store/settings'
import { addClass, removeClass } from '@/utils'
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'

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
	opacity: 0;
	transition: opacity 0.3s cubic-bezier(0.7, 0.3, 0.1, 1);
	background: rgba(0, 0, 0, 0.2);
	z-index: -1;
}

.rightPanel {
	width: 100%;
	max-width: 260px;
	height: 100vh;
	position: fixed;
	top: 0;
	right: 0;
	box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, 0.05);
	transition: all 0.25s cubic-bezier(0.7, 0.3, 0.1, 1);
	transform: translate(100%);
	background: #fff;
	z-index: 40000;
}

.show {
	transition: all 0.3s cubic-bezier(0.7, 0.3, 0.1, 1);

	.rightPanel-background {
		z-index: 20000;
		opacity: 1;
		width: 100%;
		height: 100%;
	}

	.rightPanel {
		transform: translate(0);
	}
}

.handle-button {
	width: 48px;
	height: 48px;
	position: absolute;
	left: -48px;
	text-align: center;
	border-radius: 6px 0 0 6px !important;
	z-index: 0;
	pointer-events: auto;
	cursor: pointer;
	color: #fff;

	display: flex;
	justify-content: center;
	align-items: center;
	i {
		font-size: 24px;
	}
}
</style>
