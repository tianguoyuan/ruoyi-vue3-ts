<script setup lang="ts">
import { SizeEnum } from '@/enums/SizeEnum'
import SvgIcon from '@/components/SvgIcon/index.vue'
import { useAppStore } from '@/store/app'

const appStore = useAppStore()
const sizeOptions = computed(() => {
	return Object.values(SizeEnum).map(size => ({
		label: size,
		value: size,
		disabled: appStore.size === size
	}))
})

function handleCommand(command: string | number | object) {
	console.log('command', command)
	appStore.setSize(command as SizeEnum)
}
</script>

<template>
	<ElDropdown
		trigger="click"
		@command="handleCommand"
	>
		<SvgIcon icon-class="size" />
		<template #dropdown>
			<ElDropdown-menu>
				<ElDropdown-item
					v-for="item in sizeOptions"
					:key="item['label']"
					:command="item['value']"
					:disabled="item['disabled']"
				>
					{{ item['value'] }}
				</ElDropdown-item>
			</ElDropdown-menu>
		</template>
	</ElDropdown>
</template>

<style scoped></style>
