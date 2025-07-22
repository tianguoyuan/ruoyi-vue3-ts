<script setup lang="ts">
import { SizeEnum, type ISizeEnumType } from '@/enums/SizeEnum'
import SvgIcon from '@/components/SvgIcon/index.vue'
import { useAppStore } from '@/store/app'

const appStore = useAppStore()
const sizeOptions = computed(() => {
	return SizeEnum.map(val => ({
		label: val.label,
		value: val.value,
		disabled: appStore.size === val.value
	}))
})

function handleCommand(command: ISizeEnumType) {
	console.log('command', command)
	appStore.setSize(command as ISizeEnumType)
}
</script>

<template>
	<ElDropdown
		trigger="click"
		@command="handleCommand"
	>
		<SvgIcon
			icon-class="size"
			size="18px"
		/>
		<template #dropdown>
			<ElDropdown-menu>
				<ElDropdown-item
					v-for="item in sizeOptions"
					:key="item['label']"
					:command="item['value']"
					:disabled="item['disabled']"
				>
					{{ item['label'] }}
				</ElDropdown-item>
			</ElDropdown-menu>
		</template>
	</ElDropdown>
</template>

<style scoped></style>
