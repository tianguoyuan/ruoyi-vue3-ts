<script setup lang="ts">
import { addJob, getJob, updateJob } from '@/api/monitor/job'
import type { FormConfig } from '@/components/FormGenerator/types'
import FormGenerator from '@/components/FormGenerator/index.vue'
import dayjs from 'dayjs'
import { getDicts } from '@/api/system/dict'
import Crontab from './Crontab/index.vue'
import { ElMessage } from 'element-plus'

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
	labelWidth: '100px',
	fields: [
		{
			label: '任务名称',
			prop: 'jobName',
			span: 12,
			type: 'input'
		},
		{
			label: '任务分组',
			prop: 'jobGroup',
			type: 'select',
			span: 12,
			options: jopGroupOptions as any
		},

		{
			label: '调用方法',
			prop: 'invokeTarget',
			type: 'input',
			placeholder: '请输入调用目标字符串',
			labelTip: `Bean调用示例：ryTask.ryParams('ry') 
    Class类调用示例：com.ruoyi.quartz.task.RyTask.ryParams('ry')
    参数说明：支持字符串，布尔类型，长整型，浮点型，整型`,
			span: 24
		},
		{
			label: 'cron表达式',
			prop: 'cronExpression',
			type: 'slot',
			slotName: 'cronExpressionSlot',
			span: 24
		},

		{
			label: '执行策略',
			prop: 'misfirePolicy',
			type: 'radio-button',
			span: 12,
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
			]
		},
		{
			label: '是否并发',
			prop: 'concurrent',
			type: 'radio-button',
			span: 12,
			options: [
				{
					label: '允许',
					value: '0'
				},
				{
					label: '禁止',
					value: '1'
				}
			]
		}
	],
	formRules: {
		jobName: [
			{
				required: true,
				message: '请输入任务名称',
				trigger: 'blur'
			}
		],
		invokeTarget: [
			{
				required: true,
				message: '请输入调用方法',
				trigger: 'blur'
			}
		],
		cronExpression: [
			{
				required: true,
				message: '请输入cron表达式',
				trigger: 'blur'
			}
		]
	},
	buttons: [
		{
			label: '取消',
			event: 'cancel'
		},
		{
			label: '确定',
			event: 'submit',
			type: 'primary'
		}
	],
	tableInitQueryRefuse: true
})

const initForm = {
	jobName: '',
	jobGroup: '',
	invokeTarget: '',
	cronExpression: '',
	misfirePolicy: '',
	concurrent: ''
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
		const isPass = await formGeneratorRef.value?.validate()
		if (!isPass) return
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
	<el-dialog
		:model-value="props.visible"
		:title="props.editId ? '修改任务' : '添加任务'"
		width="800px"
		append-to-body
		:close-on-click-modal="false"
		@update:modelValue="v => emit('update:visible', v)"
	>
		<FormGenerator
			ref="formGeneratorRef"
			v-model="form"
			:config="formConfig"
			@buttonClick="handleButtonClick"
		>
			<template #cronExpressionSlot>
				<el-form-item
					label="cron表达式"
					prop="cronExpression"
				>
					<el-input
						v-model="form.cronExpression"
						placeholder="请输入cron执行表达式"
						clearable
					>
						<template #append>
							<el-button
								type="primary"
								@click="handleShowCron"
							>
								生成表达式
								<i class="el-icon-time el-icon--right" />
							</el-button>
						</template>
					</el-input>
				</el-form-item>
			</template>
		</FormGenerator>
	</el-dialog>

	<el-dialog
		v-model="cronDialogVisible"
		width="700px"
	>
		<Crontab
			ref="crontabRef"
			:expression="expression"
			@hide="cronDialogVisible = false"
			@fill="crontabFill"
		/>
	</el-dialog>
</template>

<style scoped></style>
