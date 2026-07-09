<script setup lang="ts">
import dayjs from 'dayjs'

import { getJob } from '@/api/monitor/job'

const props = defineProps<{
	previewDialogId?: string
	previewDialogShow: boolean
}>()
const emit = defineEmits<{
	'update:previewDialogShow': [v: boolean]
}>()

const form = ref<Record<string, any>>({})

watch(
	() => props.previewDialogShow,
	v => {
		if (!v) return
		if (!props.previewDialogId) return
		getJob(props.previewDialogId).then(({ data }) => {
			form.value = data
		})
	}
)

function jobGroupFormat(value: string) {
	return value
}
</script>

<template>
	<!-- 任务日志详细 -->
	<ElDialog
		:model-value="props.previewDialogShow"
		title="任务详细"
		width="700px"
		append-to-body
		@update:modelValue="v => emit('update:previewDialogShow', v)"
	>
		<ElForm
			:model="form"
			label-width="120px"
		>
			<ElRow>
				<ElCol :span="12">
					<ElFormItem label="任务编号：">{{ form.jobId }}</ElFormItem>
					<ElFormItem label="任务名称：">{{ form.jobName }}</ElFormItem>
				</ElCol>
				<ElCol :span="12">
					<ElFormItem label="任务分组：">{{ jobGroupFormat(form.jobGroup) }}</ElFormItem>
					<ElFormItem label="创建时间：">{{ form.createTime }}</ElFormItem>
				</ElCol>
				<ElCol :span="12">
					<ElFormItem label="cron表达式：">{{ form.cronExpression }}</ElFormItem>
				</ElCol>
				<ElCol :span="12">
					<ElFormItem label="下次执行时间：">{{ dayjs(form.nextValidTime).format('YYYY-MM-DD hh:mm:ss') }}</ElFormItem>
				</ElCol>
				<ElCol :span="24">
					<ElFormItem label="调用目标方法：">{{ form.invokeTarget }}</ElFormItem>
				</ElCol>
				<ElCol :span="12">
					<ElFormItem label="任务状态：">
						<div v-if="form.status == 0">正常</div>
						<div v-else-if="form.status == 1">暂停</div>
					</ElFormItem>
				</ElCol>
				<ElCol :span="12">
					<ElFormItem label="是否并发：">
						<div v-if="form.concurrent == 0">允许</div>
						<div v-else-if="form.concurrent == 1">禁止</div>
					</ElFormItem>
				</ElCol>
				<ElCol :span="12">
					<ElFormItem label="执行策略：">
						<div v-if="form.misfirePolicy == 0">默认策略</div>
						<div v-else-if="form.misfirePolicy == 1">立即执行</div>
						<div v-else-if="form.misfirePolicy == 2">执行一次</div>
						<div v-else-if="form.misfirePolicy == 3">放弃执行</div>
					</ElFormItem>
				</ElCol>
			</ElRow>
		</ElForm>
		<template #footer>
			<div class="dialog-footer">
				<ElButton @click="emit('update:previewDialogShow', false)">关 闭</ElButton>
			</div>
		</template>
	</ElDialog>
</template>

<style scoped></style>
