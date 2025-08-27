<script setup lang="ts" name="Config">
import type { FormConfig } from '@/components/FormGenerator/types'
import { checkPermission } from '@/utils/permission'
import FormGenerator from '@/components/FormGenerator/index.vue'
import dayjs from 'dayjs'
import { getDicts } from '@/api/system/dict'
import { downloadBlobFile } from '@/utils'
import { listConfig, configExport, delConfig, refreshCache } from '@/api/system/config'
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
	labelWidth: '80px',
	span: 6,
	fields: [
		{
			type: 'input',
			label: '参数名称',
			prop: 'configName',
			placeholder: '请输入参数名称'
		},

		{
			type: 'input',
			label: '参数键名',
			prop: 'configKey',
			placeholder: '请输入参数键名'
		},

		{
			type: 'select',
			label: '系统内置',
			prop: 'configType',
			placeholder: '请选择系统内置',
			options: sysYesNo as unknown as any[]
		},
		{
			type: 'date-picker',
			dateType: 'daterange',
			label: '创建时间',
			prop: 'daterange',
			placeholder: '请选择创建时间'
		}
	],
	leftButtons: [
		{
			label: '新增',
			type: 'primary',
			event: 'handleAdd',
			plain: true,
			icon: 'Plus',
			show: checkPermission(['system:config:add'])
		},

		{
			label: '修改',
			type: 'success',
			event: 'handleUpdate',
			plain: true,
			icon: 'Edit',
			show: checkPermission(['system:config:edit']),
			disabled: single as unknown as boolean
		},

		{
			label: '删除',
			type: 'danger',
			event: 'handleDelete',
			plain: true,
			icon: 'Delete',
			show: checkPermission(['system:config:remove']),
			disabled: multiple as unknown as boolean
		},

		{
			label: '导出',
			type: 'warning',
			event: 'handleExport',
			plain: true,
			icon: 'Download',
			show: checkPermission(['system:config:export'])
		},
		{
			label: '刷新缓存',
			type: 'danger',
			event: 'handleRefreshCache',
			plain: true,
			icon: 'Refresh',
			show: checkPermission(['system:config:remove'])
		}
	],

	tableShow: true,
	api: listConfig,
	tableShowSelection: true,
	tableHeader: [
		{
			label: '参数主键',
			prop: 'configId',
			width: '80px',
			showOverflowTooltip: true
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
			width: '80px',
			slotName: 'configTypeSlot'
		},
		{
			label: '备注',
			prop: 'remark',
			showOverflowTooltip: true
		},
		{
			label: '创建时间',
			prop: 'createTime',
			width: '170px',
			format: v => dayjs(v).format('YYYY-MM-DD hh:mm:ss')
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
					icon: 'Edit',
					tip: '修改',
					label: '修改',
					event: 'handleUpdate',
					show: checkPermission(['system:config:edit'])
				},

				{
					type: 'primary',
					link: true,
					icon: 'Delete',
					tip: '删除',
					label: '删除',
					event: 'handleDelete',
					show: checkPermission(['system:config:remove'])
				}
			]
		}
	]
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
		title: '提示',
		type: 'warning',
		message: `是否确认删除用户编号为"${ids}"的数据项？`,
		showCancelButton: true,
		cancelButtonText: '取消',
		confirmButtonText: '确定'
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
			@tableEditClick="tableEditClick"
			@selectionChange="selectionChange"
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
			@refresh="queryList"
		/>
	</div>
</template>
