<script setup lang="ts">
import { ElScrollbar } from 'element-plus'
import type { ComponentInternalInstance } from 'vue'

const { proxy } = getCurrentInstance() as ComponentInternalInstance
const tagAndTagSpacing = 4

const scrollbarLeft = ref(0)
const scrollbarRef = ref<InstanceType<typeof ElScrollbar>>()

const emits = defineEmits<{
	(e: 'scroll'): void
}>()
function emitScroll({ scrollLeft }: { scrollLeft: number }) {
	emits('scroll')
	scrollbarLeft.value = scrollLeft
}
function handleScroll(e) {
	const eventDelta = e.wheelDelta
	scrollbarRef.value!.setScrollLeft(scrollbarLeft.value + eventDelta / 4)
}
function moveToTarget(currentTag) {
	const $container = scrollbarRef.value?.$el
	const $containerWidth = $container.offsetWidth
	const $scrollWrapper = scrollbarRef.value?.$refs.warp as unknown as HTMLElement
	const tagList = proxy?.$parent?.$refs.tag as unknown as any[]
	if (!$container || !$scrollWrapper || !tagList) return

	let firstTag: string = ''
	let lastTag: string = ''

	// find first tag and last tag
	if (tagList.length > 0) {
		firstTag = tagList[0]
		lastTag = tagList[tagList.length - 1]
	}

	if (firstTag === currentTag) {
		$scrollWrapper.scrollLeft = 0
	} else if (lastTag === currentTag) {
		$scrollWrapper.scrollLeft = $scrollWrapper.scrollWidth - $containerWidth
	} else {
		// find preTag and nextTag
		const currentIndex = tagList.findIndex(item => item === currentTag)
		const prevTag = tagList[currentIndex - 1]
		const nextTag = tagList[currentIndex + 1]

		// the tag's offsetLeft after of nextTag
		const afterNextTagOffsetLeft = nextTag.$el.offsetLeft + nextTag.$el.offsetWidth + tagAndTagSpacing

		// the tag's offsetLeft before of prevTag
		const beforePrevTagOffsetLeft = prevTag.$el.offsetLeft - tagAndTagSpacing

		if (afterNextTagOffsetLeft > $scrollWrapper.scrollLeft + $containerWidth) {
			$scrollWrapper.scrollLeft = afterNextTagOffsetLeft - $containerWidth
		} else if (beforePrevTagOffsetLeft < $scrollWrapper.scrollLeft) {
			$scrollWrapper.scrollLeft = beforePrevTagOffsetLeft
		}
	}
}

defineExpose({
	moveToTarget
})
</script>

<template>
	<ElScrollbar
		ref="scrollbarRef"
		class="scroll-container"
		@scroll="emitScroll"
		@wheel.prevent.passive="handleScroll"
	>
		<slot />
	</ElScrollbar>
</template>

<style lang="scss" scoped>
.scroll-container {
	position: relative;
	width: 100%;
	overflow: hidden;
	white-space: nowrap;
	transition: all 300ms;
	::v-deep(.el-scrollbar__bar) {
		bottom: 0;
	}
	::v-deep(.el-scrollbar__wrap) {
		height: 49px;
	}
}
</style>
