<script setup lang="ts" name="Operlog">
import dayjs from 'dayjs'

import { getDicts } from '@/api/system/dict'
import { cleanOperlog, delOperlog, list, operlogExport } from '@/api/system/operlog'
import FormGenerator from '@/components/FormGenerator/index.vue'
import type { FormConfig } from '@/components/FormGenerator/types'
import { downloadBlobFile } from '@/utils'
import { checkPermission } from '@/utils/permission'
import type { Sort } from 'element-plus'

const router = useRouter()
const formGeneratorRef = ref<InstanceType<typeof FormGenerator> | null>(null)
const formData = ref({
	deptId: '',
	isAsc: 'descending',
	orderByColumn: 'operTime'
})
const defaultSort = {
	order: 'descending',
	prop: 'operTime'
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
	api: list,
	fields: [
		{
			label: '操作地址',
			placeholder: '请输入操作地址',
			prop: 'operIp',
			type: 'input'
		},

		{
			label: '系统模块',
			placeholder: '请输入系统模块',
			prop: 'title',
			type: 'input'
		},

		{
			label: '操作人员',
			placeholder: '请输入操作人员',
			prop: 'operName',
			type: 'input'
		},
		{
			label: '操作类型',
			options: sysOperType as unknown as any[],
			placeholder: '请选择操作类型',
			prop: 'businessType',
			type: 'select'
		},
		{
			label: '操作状态',
			options: sysCommonStatus as unknown as any[],
			placeholder: '请选择操作状态',
			prop: 'businessType',
			type: 'select'
		},
		{
			dateType: 'daterange',
			defaultTime: [new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 1, 1, 23, 59, 59)],
			label: '操作时间',
			prop: 'daterange',
			type: 'date-picker',
			valueFormat: 'YYYY-MM-DD HH:mm:ss'
		}
	],
	labelWidth: '80px',
	leftButtons: [
		{
			disabled: multiple as unknown as boolean,
			event: 'handleDelete',
			icon: 'Delete',
			label: '删除',
			plain: true,
			show: checkPermission(['monitor:operlog:remove']),
			type: 'danger'
		},
		{
			event: 'handleClean',
			icon: 'Delete',
			label: '清空',
			plain: true,
			show: checkPermission(['monitor:operlog:remove']),
			type: 'danger'
		},
		{
			event: 'handleExport',
			icon: 'Download',
			label: '导出',
			plain: true,
			show: checkPermission(['monitor:operlog:export']),
			type: 'warning'
		}
	],
	span: 7,
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
			format: v => dayjs(v).format('YYYY-MM-DD hh:mm:ss'),
			label: '操作日期',
			prop: 'operTime',
			sortable: 'custom',
			width: '160px'
		},
		{
			format: v => v + '毫秒',
			label: '消耗时间',
			prop: 'costTime',
			sortable: 'custom'
		},
		{
			custom: true,
			label: '操作',
			prop: '',
			tableEditBtn: [
				{
					event: 'handleView',
					icon: 'View',
					label: '详细',
					link: true,
					show: checkPermission(['monitor:operlog:query']),
					tip: '详细',
					type: 'primary'
				}
			],
			width: '140px'
		}
	],
	tableShow: true,
	tableShowSelection: true
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
			cancelButtonText: '取消',
			confirmButtonText: '确定',
			message: `是否确认清空所有操作日志数据项？`,
			showCancelButton: true,
			title: '提示',
			type: 'warning'
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
			downloadBlobFile(data.data, data.filename ? data.filename : `operlog_${new Date().getTime()}.xlsx`)
		})
	}
}

const dialogForm = ref<Record<string, any>>({})
const dialogVisible = ref(false)
// 表格按钮
async function tableEditClick(row, btn) {
	const { event } = btn
	if (event === 'handleView') {
		// 详细
		dialogVisible.value = true
		dialogForm.value = { ...row }
	}
}

async function handleDelete(ids: string) {
	await ElMessageBox({
		cancelButtonText: '取消',
		confirmButtonText: '确定',
		message: `是否确认删除用户编号为"${ids}"的数据项？`,
		showCancelButton: true,
		title: '提示',
		type: 'warning'
	})
	await delOperlog(ids)
	ElMessage.success('删除成功')
	formGeneratorRef.value?.queryTableData()
}

function queryList() {
	formGeneratorRef.value?.queryTableData()
}

function businessTypeFindLabel(val: string) {
	return sysOperType.value.find(item => item.label === val)?.label
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
	<div
		id="operlog"
		class="p-3"
	>
		<FormGenerator
			ref="formGeneratorRef"
			v-model="formData"
			:config="formConfig"
			:defaultSort="defaultSort"
			@buttonClick="handleButtonClick"
			@selectionChange="selectionChange"
			@tableEditClick="tableEditClick"
		>
			<template #businessTypeSlot="{ row }">
				<DictTag
					:options="sysOperType"
					:value="row.businessType"
				/>
			</template>
			<template #statusSlot="{ row }">
				<DictTag
					:options="sysCommonStatus"
					:value="row.status"
				/>
			</template>
		</FormGenerator>

		<!-- 操作日志详细 -->
		<ElDialog
			v-model="dialogVisible"
			appendToBody
			class="dialogContainer"
			:closeOnClickModal="false"
			title="操作日志详细"
			width="800px"
		>
			<ElForm
				labelWidth="100px"
				:model="dialogForm"
			>
				<ElRow>
					<ElCol :span="12">
						<ElFormItem label="操作模块：">
							{{ dialogForm.title }} / {{ businessTypeFindLabel(dialogForm.businessType) }}
						</ElFormItem>
						<ElFormItem label="登录信息：">
							{{ dialogForm.operName }} / {{ dialogForm.operIp }} / {{ dialogForm.operLocation }}
						</ElFormItem>
					</ElCol>
					<ElCol :span="12">
						<ElFormItem label="请求地址：">{{ dialogForm.operUrl }}</ElFormItem>
						<ElFormItem label="请求方式：">{{ dialogForm.requestMethod }}</ElFormItem>
					</ElCol>
					<ElCol :span="24">
						<ElFormItem label="操作方法：">{{ dialogForm.method }}</ElFormItem>
					</ElCol>
					<ElCol :span="24">
						<ElFormItem label="请求参数：">
							<div class="overflow-auto">{{ dialogForm.operParam }}</div>
						</ElFormItem>
					</ElCol>
					<ElCol :span="24">
						<ElFormItem label="返回参数：">{{ dialogForm.jsonResult }}</ElFormItem>
					</ElCol>
					<ElCol :span="8">
						<ElFormItem label="操作状态：">
							<div v-if="dialogForm.status === 0">正常</div>
							<div v-else-if="dialogForm.status === 1">失败</div>
						</ElFormItem>
					</ElCol>
					<ElCol :span="8">
						<ElFormItem label="消耗时间：">{{ dialogForm.costTime }}毫秒</ElFormItem>
					</ElCol>
					<ElCol :span="8">
						<ElFormItem label="操作时间：">{{ dayjs(dialogForm.operTime).format('YYYY-MM-DD hh:mm:ss') }}</ElFormItem>
					</ElCol>
					<ElCol :span="24">
						<ElFormItem
							v-if="dialogForm.status === 1"
							label="异常信息："
						>
							{{ dialogForm.errorMsg }}
						</ElFormItem>
					</ElCol>
				</ElRow>
			</ElForm>
			<template #footer>
				<div class="dialog-footer">
					<ElButton @click="dialogVisible = false">关 闭</ElButton>
				</div>
			</template>
		</ElDialog>
	</div>
</template>
<style lang="scss" scoped>
::v-deep(.el-form-item__label) {
	font-weight: 700;
}
</style>
