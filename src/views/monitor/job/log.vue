<script setup lang="ts" name="JobLog">
import dayjs from 'dayjs'
import { ElMessage } from 'element-plus'

import { getJobById, listJobLog, delJobLog, cleanJobLog, jobLogExport, getJob } from '@/api/monitor/job'
import { getDicts } from '@/api/system/dict'
import FormGenerator from '@/components/FormGenerator/index.vue'
import type { FormConfig } from '@/components/FormGenerator/types'
import { useTagsViewStore } from '@/store/tagsView'
import { downloadBlobFile } from '@/utils'
import { checkPermission } from '@/utils/permission'

const tagsViewStore = useTagsViewStore()
const route = useRoute()
const router = useRouter()

const jobGroupOptions = ref<API.IGetDictsRes>([])
const statusOptions = ref<API.IGetDictsRes>([])

const selection = ref([])
function selectionChange(v) {
	selection.value = v.map(item => item.jobLogId)
}

const multiple = computed(() => !(selection.value.length > 0))

const formData = ref({
	jobGroup: '',
	jobName: '',
	status: undefined
})

const formGeneratorRef = ref<InstanceType<typeof FormGenerator> | null>(null)
const formConfig = ref<FormConfig>({
	api: listJobLog,
	fields: [
		{
			label: '任务名称',
			placeholder: '请输入任务名称',
			prop: 'jobName',
			type: 'input'
		},
		{
			label: '任务组名',
			options: jobGroupOptions as any,
			placeholder: '请选择任务组名',
			prop: 'jobGroup',
			type: 'select'
		},
		{
			label: '执行状态',
			options: statusOptions as any,
			placeholder: '请选择执行状态',
			prop: 'status',
			type: 'select'
		},
		{
			dateType: 'daterange',
			label: '执行时间',
			placeholder: '请选择执行时间',
			prop: 'daterange',
			type: 'date-picker'
		}
	],
	labelWidth: '80px',

	leftButtons: [
		{
			disabled: multiple as any,
			event: 'handleDelete',
			icon: 'Delete',
			label: '删除',
			plain: true,
			show: checkPermission(['monitor:job:remove']),
			type: 'danger'
		},
		{
			event: 'handleClean',
			icon: 'Delete',
			label: '清空',
			plain: true,
			show: checkPermission(['monitor:job:remove']),
			type: 'danger'
		},
		{
			event: 'handleExport',
			icon: 'Delete',
			label: '导出',
			plain: true,
			show: checkPermission(['monitor:job:export']),
			type: 'warning'
		},
		{
			event: 'handleClose',
			icon: 'Close',
			label: '关闭页面',
			plain: true,
			type: 'warning'
		}
	],

	span: 6,
	tableHeader: [
		{
			label: '日志编号',
			prop: 'jobLogId',
			showOverflowTooltip: true,
			width: '80px'
		},
		{
			label: '任务名称',
			prop: 'jobName',
			showOverflowTooltip: true
		},
		{
			label: '任务组名',
			prop: 'jobGroup',
			slotName: 'slotJobGroup'
		},
		{
			label: '调用目标字符串',
			prop: 'invokeTarget',
			showOverflowTooltip: true
		},
		{
			label: '日志信息',
			prop: 'jobMessage',
			showOverflowTooltip: true
		},
		{
			label: '执行状态',
			prop: 'status',
			slotName: 'slotStatus'
		},
		{
			format: v => dayjs(v).format('YYYY-MM-DD hh:mm:ss'),
			label: '执行时间',
			prop: 'createTime'
		},
		{
			custom: true,
			label: '操作',
			prop: '',
			tableEditBtn: [
				{
					event: 'handlePreview',
					icon: 'View',
					label: '详细',
					link: true,
					show: checkPermission(['monitor:job:query']),
					tip: '详细',
					type: 'primary'
				}
			]
		}
	],
	tableInitQueryRefuse: true,
	tableShow: true,
	tableShowSelection: true
})

const open = ref(false)
const form = ref<Record<string, string | number>>({})
function handleTableEditClick(row, btn) {
	if (btn.event === 'handlePreview') {
		// 预览
		form.value = { ...row }
		open.value = true
	}
}

async function handleButtonClick(event) {
	if (event === 'handleDelete') {
		// 删除
		const ids = selection.value.join(',')
		await ElMessageBox({
			cancelButtonText: '取消',
			confirmButtonText: '确定',
			message: `是否确认删除调度日志编号为"${ids}"的数据项?`,
			showCancelButton: true,
			title: '提示',
			type: 'warning'
		})
		delJobLog(ids)
		formGeneratorRef.value?.queryTableData()
	} else if (event === 'handleClean') {
		// 清空
		await ElMessageBox({
			cancelButtonText: '取消',
			confirmButtonText: '确定',
			message: `是否确认清空所有调度日志数据项?`,
			showCancelButton: true,
			title: '提示',
			type: 'warning'
		})

		await cleanJobLog()
		ElMessage.success('清空成功')
		formGeneratorRef.value?.queryTableData()
	} else if (event === 'handleExport') {
		// 导出
		jobLogExport(formData.value).then(data => {
			downloadBlobFile(data.data, data.filename ? data.filename : `job_log_${new Date().getTime()}.xlsx`)
		})
	} else if (event === 'handleClose') {
		// 关闭
		tagsViewStore.delView({
			name: route.name as string,
			path: route.path
		})
		router.push('/monitor/job')
	}
}

async function init() {
	getDicts('sys_job_group').then(data => {
		jobGroupOptions.value = data
	})
	getDicts('sys_job_status').then(data => {
		statusOptions.value = data
	})

	if (route.params.jobId && route.params.jobId !== '0') {
		const { data } = await getJobById(route.params.jobId as string)
		formData.value.jobName = data.jobName
		formData.value.jobGroup = data.jobGroup
	}

	await nextTick()
	formGeneratorRef.value?.queryTableData()
}
init()
</script>

<template>
	<div class="p-3">
		<FormGenerator
			ref="formGeneratorRef"
			v-model="formData"
			:config="formConfig"
			@buttonClick="handleButtonClick"
			@selectionChange="selectionChange"
			@tableEditClick="handleTableEditClick"
		>
			<!-- table-任务组名 -->
			<template #slotJobGroup="{ value }">
				<DictTag
					:options="jobGroupOptions"
					:value="value"
				/>
			</template>
			<!-- table-状态 -->
			<template #slotStatus="{ row }">
				<DictTag
					:options="statusOptions"
					:value="row.status"
				/>
			</template>
		</FormGenerator>

		<!-- 调度日志详细 -->
		<ElDialog
			v-model="open"
			appendToBody
			title="调度日志详细"
			width="700px"
		>
			<ElForm
				labelWidth="100px"
				:model="form"
			>
				<ElRow>
					<ElCol :span="12">
						<ElFormItem label="日志序号：">{{ form.jobLogId }}</ElFormItem>
						<ElFormItem label="任务名称：">{{ form.jobName }}</ElFormItem>
					</ElCol>
					<ElCol :span="12">
						<ElFormItem label="任务分组：">{{ form.jobGroup }}</ElFormItem>
						<ElFormItem label="执行时间：">{{ form.createTime }}</ElFormItem>
					</ElCol>
					<ElCol :span="24">
						<ElFormItem label="调用方法：">{{ form.invokeTarget }}</ElFormItem>
					</ElCol>
					<ElCol :span="24">
						<ElFormItem label="日志信息：">{{ form.jobMessage }}</ElFormItem>
					</ElCol>
					<ElCol :span="24">
						<ElFormItem label="执行状态：">
							<div v-if="form.status == 0">正常</div>
							<div v-else-if="form.status == 1">失败</div>
						</ElFormItem>
					</ElCol>
					<ElCol :span="24">
						<ElFormItem
							v-if="form.status == 1"
							label="异常信息："
						>
							{{ form.exceptionInfo }}
						</ElFormItem>
					</ElCol>
				</ElRow>
			</ElForm>
			<template #footer>
				<div class="dialog-footer">
					<ElButton @click="open = false">关 闭</ElButton>
				</div>
			</template>
		</ElDialog>
	</div>
</template>

<style scoped></style>
