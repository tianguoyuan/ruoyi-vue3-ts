<script setup lang="ts">
import { getDicts } from '@/api/system/dict'
import { addMenu, getMenu, updateMenu } from '@/api/system/menu'

const props = defineProps<{
	visible: boolean
	id?: string
}>()
const emits = defineEmits<{
	'update:visible': [v: boolean]
	refresh: []
}>()
const sysNormalDisable = ref<API.IGetDictsRes>([])

function submit() {}

function init() {
	getDicts('sys_normal_disable').then(data => {
		sysNormalDisable.value = data
	})
}
init()
</script>

<template>
	<ElDialog
		:model-value="props.visible"
		:title="id ? '修改菜单' : '新增菜单'"
		:close-on-click-modal="false"
		width="680px"
		@update:modelValue="v => emits('update:visible', v)"
	>
		<template #footer>
			<el-button @click="emits('update:visible', false)">取消</el-button>
			<el-button
				type="primary"
				@click="submit"
			>
				确定
			</el-button>
		</template>
	</ElDialog>
</template>

<style scoped></style>
