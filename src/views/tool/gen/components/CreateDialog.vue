<script lang="ts" setup>
import { createTable } from '@/api/tool/gen'
import { ElMessage, type FormInstance } from 'element-plus'
import { ref } from 'vue'

const emit = defineEmits<{
	refresh: []
}>()

const dialogVisible = ref(false)

const formRules = ref({
	content: [
		{
			required: true,
			message: '请输入建表语句'
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
	<el-dialog
		v-model="dialogVisible"
		title="创建表"
		width="800"
		:close-on-click-modal="false"
	>
		<el-form
			ref="formRef"
			:model="formModel"
			:rules="formRules"
			label-position="top"
		>
			<el-form-item
				label="创建表语句(支持多个建表语句)："
				prop="content"
			>
				<el-input
					v-model="formModel.content"
					type="textarea"
					:rows="10"
					placeholder="请输入文本"
				/>
			</el-form-item>
		</el-form>
		<template #footer>
			<div class="dialog-footer">
				<el-button
					type="primary"
					@click="submit"
				>
					确定
				</el-button>
				<el-button @click="dialogVisible = false"> 取消 </el-button>
			</div>
		</template>
	</el-dialog>
</template>
