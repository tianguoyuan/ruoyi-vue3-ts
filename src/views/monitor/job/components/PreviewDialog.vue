<script setup lang="ts">
import { getJob } from '@/api/monitor/job'
import dayjs from 'dayjs'

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
	<el-dialog
		:model-value="props.previewDialogShow"
		title="任务详细"
		width="700px"
		append-to-body
		@update:modelValue="v => emit('update:previewDialogShow', v)"
	>
		<el-form
			:model="form"
			label-width="120px"
		>
			<el-row>
				<el-col :span="12">
					<el-form-item label="任务编号：">{{ form.jobId }}</el-form-item>
					<el-form-item label="任务名称：">{{ form.jobName }}</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="任务分组：">{{ jobGroupFormat(form.jobGroup) }}</el-form-item>
					<el-form-item label="创建时间：">{{ form.createTime }}</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="cron表达式：">{{ form.cronExpression }}</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="下次执行时间：">{{ dayjs(form.nextValidTime).format('YYYY-MM-DD hh:mm:ss') }}</el-form-item>
				</el-col>
				<el-col :span="24">
					<el-form-item label="调用目标方法：">{{ form.invokeTarget }}</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="任务状态：">
						<div v-if="form.status == 0">正常</div>
						<div v-else-if="form.status == 1">暂停</div>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="是否并发：">
						<div v-if="form.concurrent == 0">允许</div>
						<div v-else-if="form.concurrent == 1">禁止</div>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="执行策略：">
						<div v-if="form.misfirePolicy == 0">默认策略</div>
						<div v-else-if="form.misfirePolicy == 1">立即执行</div>
						<div v-else-if="form.misfirePolicy == 2">执行一次</div>
						<div v-else-if="form.misfirePolicy == 3">放弃执行</div>
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>
		<template #footer>
			<div class="dialog-footer">
				<el-button @click="emit('update:previewDialogShow', false)">关 闭</el-button>
			</div>
		</template>
	</el-dialog>
</template>

<style scoped></style>
