<script setup lang="ts" name="Config">
import dayjs from 'dayjs'

import { listConfig, configExport, delConfig, refreshCache } from '@/api/system/config'
import { getDicts } from '@/api/system/dict'
import FormGenerator from '@/components/FormGenerator/index.vue'
import type { FormConfig } from '@/components/FormGenerator/types'
import { downloadBlobFile } from '@/utils'
import { checkPermission } from '@/utils/permission'

import EditDialog from './components/EditDialog.vue'

const router = useRouter()
const formGeneratorRef = ref<InstanceType<typeof FormGenerator> | null>(null)
const formData = ref({
	deptId: ''
})
const selectionList = ref<string[]>([])
const multiple = computed(() => !(selectionList.value.length >= 1))
const single = computed(() => !(selectionList.value.length === 1))

function selectionChange(v) {
	selectionList.value = v.map(item => item.configId)
}

const sysYesNo = ref<API.IGetDictsRes>([])

const formConfig = ref<FormConfig>({
	api: listConfig,
	fields: [
		{
			label: '参数名称',
			placeholder: '请输入参数名称',
			prop: 'configName',
			type: 'input'
		},

		{
			label: '参数键名',
			placeholder: '请输入参数键名',
			prop: 'configKey',
			type: 'input'
		},

		{
			label: '系统内置',
			options: sysYesNo as unknown as any[],
			placeholder: '请选择系统内置',
			prop: 'configType',
			type: 'select'
		},
		{
			dateType: 'daterange',
			label: '创建时间',
			placeholder: '请选择创建时间',
			prop: 'daterange',
			type: 'date-picker'
		}
	],
	labelWidth: '80px',
	leftButtons: [
		{
			event: 'handleAdd',
			icon: 'Plus',
			label: '新增',
			plain: true,
			show: checkPermission(['system:config:add']),
			type: 'primary'
		},

		{
			disabled: single as unknown as boolean,
			event: 'handleUpdate',
			icon: 'Edit',
			label: '修改',
			plain: true,
			show: checkPermission(['system:config:edit']),
			type: 'success'
		},

		{
			disabled: multiple as unknown as boolean,
			event: 'handleDelete',
			icon: 'Delete',
			label: '删除',
			plain: true,
			show: checkPermission(['system:config:remove']),
			type: 'danger'
		},

		{
			event: 'handleExport',
			icon: 'Download',
			label: '导出',
			plain: true,
			show: checkPermission(['system:config:export']),
			type: 'warning'
		},
		{
			event: 'handleRefreshCache',
			icon: 'Refresh',
			label: '刷新缓存',
			plain: true,
			show: checkPermission(['system:config:remove']),
			type: 'danger'
		}
	],

	span: 6,
	tableHeader: [
		{
			label: '参数主键',
			prop: 'configId',
			showOverflowTooltip: true,
			width: '80px'
		},
		{
			label: '参数名称',
			prop: 'configName',
			showOverflowTooltip: true
		},
		{
			label: '参数键名',
			prop: 'configKey',
			showOverflowTooltip: true
		},
		{
			label: '参数键值',
			prop: 'configValue',
			showOverflowTooltip: true
		},
		{
			label: '系统内置',
			prop: 'configType',
			slotName: 'configTypeSlot',
			width: '80px'
		},
		{
			label: '备注',
			prop: 'remark',
			showOverflowTooltip: true
		},
		{
			format: v => dayjs(v).format('YYYY-MM-DD hh:mm:ss'),
			label: '创建时间',
			prop: 'createTime',
			width: '170px'
		},
		{
			custom: true,
			label: '操作',
			prop: '',
			tableEditBtn: [
				{
					event: 'handleUpdate',
					icon: 'Edit',
					label: '修改',
					link: true,
					show: checkPermission(['system:config:edit']),
					tip: '修改',
					type: 'primary'
				},

				{
					event: 'handleDelete',
					icon: 'Delete',
					label: '删除',
					link: true,
					show: checkPermission(['system:config:remove']),
					tip: '删除',
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
	if (event === 'handleAdd') {
		// 新增
		handleUpdate('')
	} else if (event === 'handleUpdate') {
		// 修改
		const id = selectionList.value[0]
		handleUpdate(id)
	} else if (event === 'handleDelete') {
		// 删除
		const ids = selectionList.value.join(',')
		handleDelete(ids)
	} else if (event === 'handleExport') {
		// 导出
		const pageParams = formGeneratorRef.value?.getPageParams()
		configExport(pageParams).then(data => {
			downloadBlobFile(data.data, data.filename ? data.filename : `config_${new Date().getTime()}.xlsx`)
		})
	} else if (event === 'handleRefreshCache') {
		await refreshCache()
		ElMessage.success('刷新成功')
	}
}
// 表格按钮
async function tableEditClick(row, btn) {
	const { event } = btn
	if (event === 'handleUpdate') {
		// 修改
		handleUpdate(row.configId)
	} else if (event === 'handleDelete') {
		// 删除
		handleDelete(row.configId)
	}
}

const dialogVisible = ref(false)
const dialogId = ref('')
function handleUpdate(id: string) {
	dialogVisible.value = true
	dialogId.value = id + ''
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
	await delConfig(ids)
	ElMessage.success('删除成功')
	formGeneratorRef.value?.queryTableData()
}

function queryList() {
	formGeneratorRef.value?.queryTableData()
}

function init() {
	getDicts('sys_yes_no').then(data => {
		sysYesNo.value = data
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
			@buttonClick="handleButtonClick"
			@selectionChange="selectionChange"
			@tableEditClick="tableEditClick"
		>
			<template #configTypeSlot="{ row }">
				<DictTag
					:options="sysYesNo"
					:value="row.configType"
				/>
			</template>
		</FormGenerator>

		<EditDialog
			:id="dialogId"
			v-model:visible="dialogVisible"
			:sysYesNo="sysYesNo"
			@refresh="queryList"
		/>
	</div>
</template>
