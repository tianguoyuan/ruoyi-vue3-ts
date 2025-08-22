<script setup lang="ts" name="Operlog">
import type { FormConfig } from '@/components/FormGenerator/types'
import { checkPermission } from '@/utils/permission'
import FormGenerator from '@/components/FormGenerator/index.vue'
import dayjs from 'dayjs'
import { getDicts } from '@/api/system/dict'
import { downloadBlobFile } from '@/utils'
import { cleanOperlog, delOperlog, list, operlogExport } from '@/api/system/operlog'
import type { Sort } from 'element-plus'

const router = useRouter()
const formGeneratorRef = ref<InstanceType<typeof FormGenerator> | null>(null)
const formData = ref({
	deptId: '',
	orderByColumn: 'operTime',
	isAsc: 'descending'
})
const defaultSort = {
	prop: 'operTime',
	order: 'descending'
} as Sort

const selectionList = ref<string[]>([])
const multiple = computed(() => !(selectionList.value.length >= 1))
const single = computed(() => !(selectionList.value.length === 1))

function selectionChange(v) {
	selectionList.value = v.map(item => item.operId)
}

const sysOperType = ref<API.IGetDictsRes>([])
const sysCommonStatus = ref<API.IGetDictsRes>([])

const formConfig = ref<FormConfig>({
	labelWidth: '80px',
	span: 7,
	fields: [
		{
			type: 'input',
			label: '操作地址',
			prop: 'operIp',
			placeholder: '请输入操作地址'
		},

		{
			type: 'input',
			label: '系统模块',
			prop: 'title',
			placeholder: '请输入系统模块'
		},

		{
			type: 'input',
			label: '操作人员',
			prop: 'operName',
			placeholder: '请输入操作人员'
		},
		{
			type: 'select',
			label: '操作类型',
			prop: 'businessType',
			placeholder: '请选择操作类型',
			options: sysOperType as unknown as any[]
		},
		{
			type: 'select',
			label: '操作状态',
			prop: 'businessType',
			placeholder: '请选择操作状态',
			options: sysCommonStatus as unknown as any[]
		},
		{
			type: 'date-picker',
			dateType: 'daterange',
			prop: 'daterange',
			label: '操作时间',
			valueFormat: 'YYYY-MM-DD HH:mm:ss',
			defaultTime: [new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 1, 1, 23, 59, 59)]
		}
	],
	leftButtons: [
		{
			label: '删除',
			type: 'danger',
			event: 'handleDelete',
			plain: true,
			icon: 'Delete',
			show: checkPermission(['monitor:operlog:remove']),
			disabled: multiple as unknown as boolean
		},
		{
			label: '清空',
			type: 'danger',
			event: 'handleClean',
			plain: true,
			icon: 'Delete',
			show: checkPermission(['monitor:operlog:remove'])
		},
		{
			label: '导出',
			type: 'warning',
			event: 'handleExport',
			plain: true,
			icon: 'Download',
			show: checkPermission(['monitor:operlog:export'])
		}
	],
	tableShow: true,
	api: list,
	tableShowSelection: true,
	tableHeader: [
		{
			label: '日志编号',
			prop: 'operId',
			showOverflowTooltip: true
		},
		{
			label: '系统模块',
			prop: 'title',
			showOverflowTooltip: true
		},
		{
			label: '操作类型',
			prop: 'businessType',
			slotName: 'businessTypeSlot'
		},
		{
			label: '操作人员',
			prop: 'operName',
			showOverflowTooltip: true,
			sortable: 'custom'
		},
		{
			label: '操作地址',
			prop: 'operIp',
			showOverflowTooltip: true
		},
		{
			label: '操作状态',
			prop: 'status',
			slotName: 'statusSlot'
		},
		{
			label: '操作日期',
			prop: 'operTime',
			sortable: 'custom',
			format: v => dayjs(v).format('YYYY-MM-DD')
		},
		{
			label: '消耗时间',
			prop: 'costTime',
			sortable: 'custom',
			format: v => v + '毫秒'
		},
		{
			label: '操作',
			custom: true,
			prop: '',
			width: '140px',
			tableEditBtn: [
				{
					type: 'primary',
					link: true,
					icon: 'View',
					tip: '详细',
					label: '详细',
					event: 'handleView',
					show: checkPermission(['monitor:operlog:query'])
				}
			]
		}
	]
})

// 表单按钮
async function handleButtonClick(event: string) {
	if (event === 'handleDelete') {
		// 删除
		const ids = selectionList.value.join(',')
		handleDelete(ids)
	} else if (event === 'handleClean') {
		// 清空
		await ElMessageBox({
			title: '提示',
			type: 'warning',
			message: `是否确认清空所有操作日志数据项？`,
			showCancelButton: true,
			cancelButtonText: '取消',
			confirmButtonText: '确定'
		})
		await cleanOperlog()
		ElMessage.success('清空成功')
		queryList()
	} else if (event === 'handleExport') {
		// 导出
		const pageParams = formGeneratorRef.value?.getPageParams()
		operlogExport({
			...pageParams,
			...formData.value
		}).then(data => {
			downloadBlobFile(data.data, data.filename ? data.filename : `config_${new Date().getTime()}.xlsx`)
		})
	}
}
// 表格按钮
async function tableEditClick(row, btn) {
	const { event } = btn
	if (event === 'handleView') {
		// 详细
	}
}

async function handleDelete(ids: string) {
	await ElMessageBox({
		title: '提示',
		type: 'warning',
		message: `是否确认删除用户编号为"${ids}"的数据项？`,
		showCancelButton: true,
		cancelButtonText: '取消',
		confirmButtonText: '确定'
	})
	await delOperlog(ids)
	ElMessage.success('删除成功')
	formGeneratorRef.value?.queryTableData()
}

function queryList() {
	formGeneratorRef.value?.queryTableData()
}

function init() {
	getDicts('sys_oper_type').then(data => {
		sysOperType.value = data
	})
	getDicts('sys_common_status').then(data => {
		sysCommonStatus.value = data
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
			:default-sort="defaultSort"
			@buttonClick="handleButtonClick"
			@tableEditClick="tableEditClick"
			@selectionChange="selectionChange"
		>
			<template #businessTypeSlot="{ row }">
				<DictTag
					:options="sysOperType"
					:value="row.status"
				/>
			</template>
			<template #statusSlot="{ row }">
				<DictTag
					:options="sysCommonStatus"
					:value="row.status"
				/>
			</template>
		</FormGenerator>
	</div>
</template>
