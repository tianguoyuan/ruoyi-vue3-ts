<script setup lang="ts" name="JobLog">
import type { FormConfig } from '@/components/FormGenerator/types'
import FormGenerator from '@/components/FormGenerator/index.vue'
import { getJobById, listJobLog, delJobLog, cleanJobLog, jobLogExport, getJob } from '@/api/monitor/job'
import dayjs from 'dayjs'
import { checkPermission } from '@/utils/permission'
import { getDicts } from '@/api/system/dict'
import { downloadBlobFile } from '@/utils'
import { ElMessage } from 'element-plus'
import { useTagsViewStore } from '@/store/tagsView'

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
	jobName: '',
	jobGroup: '',
	status: undefined
})

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
			label: '执行状态',
			prop: 'status',
			placeholder: '请选择执行状态',
			options: statusOptions as any
		},
		{
			type: 'date-picker',
			dateType: 'daterange',
			label: '执行时间',
			prop: 'daterange',
			placeholder: '请选择执行时间'
		}
	],

	leftButtons: [
		{
			label: '删除',
			icon: 'Delete',
			plain: true,
			type: 'danger',
			event: 'handleDelete',
			disabled: multiple as any,
			show: checkPermission(['monitor:job:remove'])
		},
		{
			label: '清空',
			icon: 'Delete',
			plain: true,
			type: 'danger',
			event: 'handleClean',
			show: checkPermission(['monitor:job:remove'])
		},
		{
			label: '导出',
			icon: 'Delete',
			plain: true,
			type: 'warning',
			event: 'handleExport',
			show: checkPermission(['monitor:job:export'])
		},
		{
			label: '关闭页面',
			icon: 'Close',
			plain: true,
			type: 'warning',
			event: 'handleClose'
		}
	],

	tableShow: true,
	api: listJobLog,
	tableShowSelection: true,
	tableInitQueryRefuse: true,
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
			label: '执行时间',
			prop: 'createTime',
			format: v => dayjs(v).format('YYYY-MM-DD hh:mm:ss')
		},
		{
			custom: true,
			prop: '',
			label: '操作',
			tableEditBtn: [
				{
					link: true,
					type: 'primary',
					icon: 'View',
					label: '详细',
					tip: '详细',
					event: 'handlePreview',
					show: checkPermission(['monitor:job:query'])
				}
			]
		}
	]
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
			title: '提示',
			type: 'warning',
			message: `是否确认删除调度日志编号为"${ids}"的数据项?`,
			showCancelButton: true,
			cancelButtonText: '取消',
			confirmButtonText: '确定'
		})
		delJobLog(ids)
	} else if (event === 'handleClean') {
		// 清空
		await ElMessageBox({
			title: '提示',
			type: 'warning',
			message: `是否确认清空所有调度日志数据项?`,
			showCancelButton: true,
			cancelButtonText: '取消',
			confirmButtonText: '确定'
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
			path: route.path,
			name: route.name as string
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
			@tableEditClick="handleTableEditClick"
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
				<DictTag
					:value="row.status"
					:options="statusOptions"
				/>
			</template>
		</FormGenerator>

		<!-- 调度日志详细 -->
		<el-dialog
			v-model="open"
			title="调度日志详细"
			width="700px"
			append-to-body
		>
			<el-form
				:model="form"
				label-width="100px"
			>
				<el-row>
					<el-col :span="12">
						<el-form-item label="日志序号：">{{ form.jobLogId }}</el-form-item>
						<el-form-item label="任务名称：">{{ form.jobName }}</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="任务分组：">{{ form.jobGroup }}</el-form-item>
						<el-form-item label="执行时间：">{{ form.createTime }}</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="调用方法：">{{ form.invokeTarget }}</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="日志信息：">{{ form.jobMessage }}</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="执行状态：">
							<div v-if="form.status == 0">正常</div>
							<div v-else-if="form.status == 1">失败</div>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item
							v-if="form.status == 1"
							label="异常信息："
						>
							{{ form.exceptionInfo }}
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<template #footer>
				<div class="dialog-footer">
					<el-button @click="open = false">关 闭</el-button>
				</div>
			</template>
		</el-dialog>
	</div>
</template>

<style scoped></style>
