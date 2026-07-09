<script setup lang="ts">
import { ElMessage } from 'element-plus'

import { getDbList, importTable } from '@/api/tool/gen'
import FormGenerator from '@/components/FormGenerator/index.vue'
import type { FormConfig } from '@/components/FormGenerator/types'

const formGeneratorRef = ref<InstanceType<typeof FormGenerator> | null>(null)
const emit = defineEmits<{
	refresh: []
}>()
const dialogVisible = ref(false)

const formData = ref<Record<string, string>>({})
const formConfig = ref<FormConfig>({
	labelWidth: '80px',
	span: 6,
	fields: [
		{
			type: 'input',
			label: '表名称',
			prop: 'tableName',
			placeholder: '请输入表名称',
			span: 10
		},
		{
			type: 'input',
			label: '表描述',
			prop: 'tableComment',
			placeholder: '请输入表描述',
			span: 10
		}
	],
	tableShow: true,
	api: getDbList,
	tableShowSelection: true,
	tableShowIndex: true,
	tableHeader: [
		{
			label: '表名称',
			prop: 'tableName',
			showOverflowTooltip: true
		},
		{
			label: '表描述',
			prop: 'tableComment'
		},
		{
			label: '创建时间',
			prop: 'createTime'
		},
		{
			label: '更新时间',
			prop: 'updateTime'
		}
	]
})
const selection = ref<string[]>([])

function selectionChange(v) {
	selection.value = v.map(item => item.tableName)
}

async function submit() {
	if (!selection.value.length) return ElMessage.error('请选择要导入的表')
	const result = await importTable({ tables: selection.value.join(',') })
	ElMessage.success(result.msg)
	dialogVisible.value = false
	emit('refresh')
	formGeneratorRef.value?.queryTableData()
}

function handleButtonClick() {}
defineExpose({
	setVisible(v: boolean) {
		dialogVisible.value = v
	}
})
</script>

<template>
	<ElDialog
		v-model="dialogVisible"
		title="导入表"
		width="800"
		:close-on-click-modal="false"
	>
		<FormGenerator
			ref="formGeneratorRef"
			v-model="formData"
			:config="formConfig"
			@buttonClick="handleButtonClick"
			@selectionChange="selectionChange"
		/>
		<template #footer>
			<div class="dialog-footer">
				<ElButton
					type="primary"
					@click="submit"
				>
					确定
				</ElButton>
				<ElButton @click="dialogVisible = false"> 取消 </ElButton>
			</div>
		</template>
	</ElDialog>
</template>

<style scoped></style>
