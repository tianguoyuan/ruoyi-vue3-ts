<script lang="ts" setup>
import { ElMessage, type FormInstance } from 'element-plus'
import { ref } from 'vue'

import { createTable } from '@/api/tool/gen'

const emit = defineEmits<{
	refresh: []
}>()

const dialogVisible = ref(false)

const formRules = ref({
	content: [
		{
			message: '请输入建表语句',
			required: true
		}
	]
})
const formModel = ref({
	content: ''
})

const formRef = ref<FormInstance | null>(null)

watch(dialogVisible, () => {
	nextTick(() => {
		formRef.value?.clearValidate()
		formModel.value.content = ''
	})
})
async function submit() {
	await formRef.value?.validate()

	const result = await createTable({ sql: formModel.value.content })
	ElMessage.success(result.msg)
	dialogVisible.value = false

	emit('refresh')
}

defineExpose({
	setVisible(v: boolean) {
		dialogVisible.value = v
	}
})
</script>

<template>
	<ElDialog
		v-model="dialogVisible"
		:closeOnClickModal="false"
		title="创建表"
		width="800"
	>
		<ElForm
			ref="formRef"
			labelPosition="top"
			:model="formModel"
			:rules="formRules"
		>
			<ElFormItem
				label="创建表语句(支持多个建表语句)："
				prop="content"
			>
				<ElInput
					v-model="formModel.content"
					placeholder="请输入文本"
					:rows="10"
					type="textarea"
				/>
			</ElFormItem>
		</ElForm>
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
