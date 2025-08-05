<script setup lang="ts" name="Job">
import type { FormConfig } from '@/components/FormGenerator/types'
import { checkPermission } from '@/utils/permission'
import FormGenerator from '@/components/FormGenerator/index.vue'
import { getDicts } from '@/api/system/dict'
import { changeJobStatus, delJob, getListJob, jobExport, runJob } from '@/api/monitor/job'
import { ElMessage } from 'element-plus'
import { downloadBlobFile } from '@/utils'
import PreviewDialog from './components/PreviewDialog.vue'
import EditDialog from './components/EditDialog.vue'

const router = useRouter()

const jobGroupOptions = ref<API.IGetDictsRes>([])
const statusOptions = ref<API.IGetDictsRes>([])

interface IListRow {
	jobId: string
}
const selectionList = ref<IListRow[]>([])
function selectionChange(val) {
	selectionList.value = val
}
const multiple = computed(() => {
	return !(selectionList.value.length >= 1)
}) as unknown as boolean
const single = computed(() => {
	return !(selectionList.value.length === 1)
}) as unknown as boolean

const formData = ref({})
const formGeneratorRef = ref<InstanceType<typeof FormGenerator> | null>(null)
const formConfig = ref<FormConfig>({
	labelWidth: '80px',
	span: 6,
	fields: [
		{
			type: 'input',
			label: '任务名称',
			prop: 'jobName',
			placeholder: '请输入任务名称'
		},
		{
			type: 'select',
			label: '任务组名',
			prop: 'jobGroup',
			placeholder: '请选择任务组名',
			options: jobGroupOptions as any
		},
		{
			type: 'select',
			label: '任务状态',
			prop: 'status',
			placeholder: '请选择任务状态',
			options: statusOptions as any
		}
	],
	leftButtons: [
		{
			label: '新增',
			type: 'primary',
			event: 'handleAdd',
			plain: true,
			icon: 'Plus',
			show: checkPermission(['monitor:job:add'])
		},
		{
			label: '修改',
			type: 'success',
			event: 'handleUpdate',
			plain: true,
			icon: 'Edit',
			show: checkPermission(['monitor:job:edit']),
			disabled: single
		},
		{
			label: '删除',
			type: 'danger',
			event: 'handleDelete',
			plain: true,
			icon: 'Delete',
			show: checkPermission(['monitor:job:remove']),
			disabled: multiple
		},
		{
			label: '导出',
			type: 'warning',
			event: 'handleExport',
			plain: true,
			icon: 'Download',
			show: checkPermission(['monitor:job:export'])
		},
		{
			label: '日志',
			type: 'info',
			event: 'handleJobLog',
			plain: true,
			icon: 'Operation',
			show: checkPermission(['monitor:job:query'])
		}
	],

	tableShow: true,
	api: getListJob,
	tableShowSelection: true,
	tableHeader: [
		{
			label: '任务编号',
			prop: 'jobId',
			showOverflowTooltip: true,
			width: '100px'
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
			label: 'cron执行表达式',
			prop: 'cronExpression',
			showOverflowTooltip: true
		},
		{
			label: '状态',
			prop: 'status',
			slotName: 'slotStatus'
		},
		{
			custom: true,
			prop: '',
			label: '操作',
			tableEditBtn: [
				{
					link: true,
					type: 'primary',
					icon: 'Edit',
					tip: '修改',
					event: 'handleUpdate',
					show: checkPermission(['monitor:job:edit'])
				},

				{
					link: true,
					type: 'primary',
					icon: 'Delete',
					tip: '删除',
					event: 'handleDelete',
					show: checkPermission(['monitor:job:remove'])
				},
				{
					link: true,
					type: 'primary',
					icon: 'CaretRight',
					tip: '执行一次',
					event: 'handleRun',
					show: checkPermission(['monitor:job:changeStatus'])
				},
				{
					link: true,
					type: 'primary',
					icon: 'View',
					tip: '任务详细',
					event: 'handleView',
					show: checkPermission(['monitor:job:query'])
				},
				{
					link: true,
					type: 'primary',
					icon: 'Operation',
					tip: '调度日志',
					event: 'handleJobLog',
					show: checkPermission(['monitor:job:query'])
				}
			]
		}
	]
})

// 预览弹窗
const previewDialogShow = ref(false)
const previewDialogId = ref('')

// 新增修改弹窗
const editDialogVisible = ref(false)
const editId = ref('')

function handleTableEditClick(row, btn) {
	const { event } = btn
	if (event === 'handleUpdate') {
		// 修改
		handleUpdate({ ...row })
	} else if (event === 'handleDelete') {
		// 删除
		handleDelete(row.jobId)
	} else if (event === 'handleRun') {
		// 执行一次
		ElMessageBox({
			type: 'warning',
			title: '提示',
			message: '确认要立即执行一次"' + row.jobName + '"任务吗?',
			showCancelButton: true,
			cancelButtonText: '取消',
			confirmButtonText: '确定'
		}).then(() => {
			runJob(row.jobId, row.jobGroup).then(() => {
				ElMessage.success('执行成功')
			})
		})
	} else if (event === 'handleView') {
		// 任务详细
		previewDialogId.value = row.jobId + ''
		previewDialogShow.value = true
	} else if (event === 'handleJobLog') {
		// 调度日志
		handleJobLog(row.jobId)
	}
}

function handleButtonClick(event: string) {
	if (event === 'handleAdd') {
		// 新增
		editId.value = ''
		editDialogVisible.value = true
	} else if (event === 'handleUpdate') {
		// 修改
		if (selectionList.value.length) {
			handleUpdate({ ...selectionList.value[0] })
		}
	} else if (event === 'handleDelete') {
		// 删除
		if (selectionList.value.length) {
			const ids = selectionList.value.map(v => v.jobId).join(',')
			handleDelete(ids)
		}
	} else if (event === 'handleExport') {
		// 导出
		const page = formGeneratorRef.value?.getPageParams() || {}
		const params = {
			...formData.value,
			...page
		}
		jobExport(params).then(data => {
			downloadBlobFile(data.data, data.filename || new Date().getTime() + '.xlsx')
		})
	} else if (event === 'handleJobLog') {
		// 日志
		handleJobLog('0')
	}
}

const editDialogRef = ref<null | InstanceType<typeof EditDialog>>(null)
// 修改
function handleUpdate(val) {
	console.log('修改', val)
	editId.value = val.jobId + ''
	editDialogVisible.value = true
}
// 删除
function handleDelete(ids: string) {
	console.log('删除', ids)
	ElMessageBox({
		type: 'warning',
		title: '提示',
		message: '是否确认删除定时任务编号为"' + ids + '"的数据项?',
		showCancelButton: true,
		cancelButtonText: '取消',
		confirmButtonText: '确定'
	}).then(() => {
		delJob(ids).then(() => {
			ElMessage.success('删除成功')
			formGeneratorRef.value?.queryTableData()
		})
	})
}
// 日志
function handleJobLog(id: string) {
	console.log('日志', id)
	router.push('/monitor/job-log/index/' + id)
}

// 状态修改
function handleStatusChange(row) {
	let text = row.status === '0' ? '启用' : '停用'
	ElMessageBox({
		type: 'warning',
		title: '提示',
		message: '确认要"' + text + '""' + row.jobName + '"任务吗?',
		showCancelButton: true,
		cancelButtonText: '取消',
		confirmButtonText: '确定'
	})
		.then(() => {
			return changeJobStatus(row.jobId, row.status).then(() => {
				ElMessage.success(text + '成功')
			})
		})
		.catch(() => {
			row.status = row.status === '0' ? '1' : '0'
		})
}

// 查询
function queryList() {
	formGeneratorRef.value?.queryTableData()
}

async function init() {
	getDicts('sys_job_group').then(data => {
		jobGroupOptions.value = data
	})
	getDicts('sys_job_status').then(data => {
		statusOptions.value = data
	})
}

init()
</script>

<template>
	<div class="p-3">
		<FormGenerator
			ref="formGeneratorRef"
			v-model="formData"
			:config="formConfig"
			@tableEditClick="handleTableEditClick"
			@buttonClick="handleButtonClick"
			@selectionChange="selectionChange"
		>
			<!-- table-任务组名 -->
			<template #slotJobGroup="{ value }">
				<DictTag
					:value="value"
					:options="jobGroupOptions"
				/>
			</template>
			<!-- table-状态 -->
			<template #slotStatus="{ row }">
				<el-switch
					v-model="row.status"
					active-value="0"
					inactive-value="1"
					@click="handleStatusChange(row)"
				/>
			</template>
		</FormGenerator>

		<PreviewDialog
			v-model:previewDialogShow="previewDialogShow"
			:preview-dialog-id="previewDialogId"
		/>

		<EditDialog
			ref="editDialogRef"
			v-model:visible="editDialogVisible"
			:edit-id="editId"
			@refresh="queryList"
		/>
	</div>
</template>

<style scoped></style>
