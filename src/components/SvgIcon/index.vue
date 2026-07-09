<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
	color: {
		default: '',
		type: String
	},
	iconClass: {
		default: '',
		required: false,
		type: String
	},
	prefix: {
		default: 'icon',
		type: String
	},
	size: {
		default: '14px',
		type: String
	}
})

const symbolId = computed(() => `#${props.prefix}-${props.iconClass}`)
</script>

<template>
	<svg
		aria-hidden="true"
		class="svg-icon"
		:style="'width:' + size + ';height:' + size"
	>
		<use
			:fill="color"
			:xlink:href="symbolId"
		/>
	</svg>
</template>

<style scoped>
.svg-icon {
	display: inline-block;
	width: 1em;
	height: 1em;
	overflow: hidden;
	vertical-align: -0.15em; /* 因icon大小被设置为和字体大小一致，而span等标签的下边缘会和字体的基线对齐，故需设置一个往下的偏移比例，来纠正视觉上的未对齐效果 */
	outline: none;
	fill: currentcolor; /* 定义元素的颜色，currentColor是一个变量，这个变量的值就表示当前元素的color值，如果当前元素未设置color值，则从父元素继承 */
}
</style>
