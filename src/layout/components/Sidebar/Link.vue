<script setup lang="ts">
import { isExternal } from '@/utils/is'

const props = defineProps<{
	to: string
}>()

const isLink = computed(() => isExternal(props.to))
const type = computed(() => (isLink.value ? 'a' : 'RouterLink'))

function linkProps(to: string) {
	if (isLink.value) {
		return {
			href: to,
			rel: 'noopener',
			target: '_blank'
		}
	}
	return {
		to: to
	}
}
</script>

<template>
	<div>
		<component
			:is="type"
			v-bind="linkProps(props.to)"
		>
			<slot />
		</component>
	</div>
</template>

<style scoped></style>
