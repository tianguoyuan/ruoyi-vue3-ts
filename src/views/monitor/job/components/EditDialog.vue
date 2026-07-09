<script setup lang="ts">
import dayjs from 'dayjs'
import { ElMessage } from 'element-plus'

import { addJob, getJob, updateJob } from '@/api/monitor/job'
import { getDicts } from '@/api/system/dict'
import FormGenerator from '@/components/FormGenerator/index.vue'
import type { FormConfig } from '@/components/FormGenerator/types'

import Crontab from './Crontab/index.vue'

const props = defineProps<{
	editId?: string
	visible: boolean
}>()
const emit = defineEmits<{
	'update:visible': [v: boolean]
	refresh: []
}>()

const jopGroupOptions = ref<API.IGetDictsRes>([])
const formConfig = ref<FormConfig>({
	buttons: [
		{
			event: 'cancel',
			label: '取消'
		},
		{
			event: 'submit',
			label: '确定',
			type: 'primary'
		}
	],
	fields: [
		{
			label: '任务名称',
			prop: 'jobName',
			span: 12,
			type: 'input'
		},
		{
			label: '任务分组',
			options: jopGroupOptions as any,
			prop: 'jobGroup',
			span: 12,
			type: 'select'
		},

		{
			label: '调用方法',
			labelTip: `Bean调用示例：ryTask.ryParams('ry') 
    Class类调用示例：com.ruoyi.quartz.task.RyTask.ryParams('ry')
    参数说明：支持字符串，布尔类型，长整型，浮点型，整型`,
			placeholder: '请输入调用目标字符串',
			prop: 'invokeTarget',
			span: 24,
			type: 'input'
		},
		{
			label: 'cron表达式',
			prop: 'cronExpression',
			slotName: 'cronExpressionSlot',
			span: 24,
			type: 'slot'
		},

		{
			label: '执行策略',
			options: [
				{
					label: '立即执行',
					value: '1'
				},
				{
					label: '执行一次',
					value: '2'
				},
				{
					label: '放弃执行',
					value: '3'
				}
			],
			prop: 'misfirePolicy',
			span: 12,
			type: 'radio-button'
		},
		{
			label: '是否并发',
			options: [
				{
					label: '允许',
					value: '0'
				},
				{
					label: '禁止',
					value: '1'
				}
			],
			prop: 'concurrent',
			span: 12,
			type: 'radio-button'
		}
	],
	formRules: {
		cronExpression: [
			{
				message: '请输入cron表达式',
				required: true,
				trigger: 'blur'
			}
		],
		invokeTarget: [
			{
				message: '请输入调用方法',
				required: true,
				trigger: 'blur'
			}
		],
		jobName: [
			{
				message: '请输入任务名称',
				required: true,
				trigger: 'blur'
			}
		]
	},
	labelWidth: '100px',
	tableInitQueryRefuse: true
})

const initForm = {
	concurrent: '',
	cronExpression: '',
	invokeTarget: '',
	jobGroup: '',
	jobName: '',
	misfirePolicy: ''
}
const form = ref<Record<string, any>>({ ...initForm })
const formGeneratorRef = ref<InstanceType<typeof FormGenerator>>()

watch(
	() => props.visible,
	v => {
		if (!v) return
		nextTick(formGeneratorRef.value?.clearValidate)
		if (!props.editId) {
			form.value = { ...initForm }
		} else {
			getJob(props.editId).then(({ data }) => {
				form.value = data
			})
		}
	}
)

const cronDialogVisible = ref(false)
const expression = ref('')
function handleShowCron() {
	expression.value = form.value.cronExpression
	cronDialogVisible.value = true
}
/** 确定后回传值 */
function crontabFill(value) {
	form.value.cronExpression = value
}

async function handleButtonClick(event: string) {
	if (event === 'cancel') {
		// 取消
		emit('update:visible', false)
	} else if (event === 'submit') {
		// 提交
		await formGeneratorRef.value?.validate()
		if (form.value.jobId !== undefined) {
			updateJob(form.value).then(() => {
				ElMessage.success('修改成功')
				emit('update:visible', false)
				emit('refresh')
			})
		} else {
			addJob(form.value).then(() => {
				ElMessage.success('新增成功')
				emit('update:visible', false)
				emit('refresh')
			})
		}
	}
}

function init() {
	getDicts('sys_job_group').then(data => {
		jopGroupOptions.value = data
	})
}
init()
</script>

<template>
	<!-- 任务日志详细 -->
	<ElDialog
		appendToBody
		:closeOnClickModal="false"
		:modelValue="props.visible"
		:title="props.editId ? '修改任务' : '添加任务'"
		width="800px"
		@update:modelValue="v => emit('update:visible', v)"
	>
		<FormGenerator
			ref="formGeneratorRef"
			v-model="form"
			:config="formConfig"
			@buttonClick="handleButtonClick"
		>
			<template #cronExpressionSlot>
				<ElFormItem
					label="cron表达式"
					prop="cronExpression"
				>
					<ElInput
						v-model="form.cronExpression"
						clearable
						placeholder="请输入cron执行表达式"
					>
						<template #append>
							<ElButton
								type="primary"
								@click="handleShowCron"
							>
								生成表达式
								<i class="el-icon-time el-icon--right" />
							</ElButton>
						</template>
					</ElInput>
				</ElFormItem>
			</template>
		</FormGenerator>
	</ElDialog>

	<ElDialog
		v-model="cronDialogVisible"
		width="700px"
	>
		<Crontab
			ref="crontabRef"
			:expression="expression"
			@fill="crontabFill"
			@hide="cronDialogVisible = false"
		/>
	</ElDialog>
</template>

<style scoped></style>
