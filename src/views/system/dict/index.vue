<script setup lang="ts" name="Dict">
import dayjs from 'dayjs'

import { getDicts } from '@/api/system/dict'
import { listType, typeExport, delType, refreshCache } from '@/api/system/dictType'
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
	selectionList.value = v.map(item => item.dictId)
}

const sysNormalDisable = ref<API.IGetDictsRes>([])

const formConfig = ref<FormConfig>({
	api: listType,
	fields: [
		{
			label: '字典名称',
			placeholder: '请输入字典名称',
			prop: 'dictName',
			type: 'input'
		},

		{
			label: '字典类型',
			placeholder: '请输入字典类型',
			prop: 'dictType',
			type: 'input'
		},

		{
			label: '字典状态',
			options: sysNormalDisable as unknown as any[],
			placeholder: '请选择字典状态',
			prop: 'status',
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
			show: checkPermission(['system:dict:add']),
			type: 'primary'
		},

		{
			disabled: single as unknown as boolean,
			event: 'handleUpdate',
			icon: 'Edit',
			label: '修改',
			plain: true,
			show: checkPermission(['system:dict:edit']),
			type: 'success'
		},

		{
			disabled: multiple as unknown as boolean,
			event: 'handleDelete',
			icon: 'Delete',
			label: '删除',
			plain: true,
			show: checkPermission(['system:dict:remove']),
			type: 'danger'
		},

		{
			event: 'handleExport',
			icon: 'Download',
			label: '导出',
			plain: true,
			show: checkPermission(['system:dict:export']),
			type: 'warning'
		},
		{
			event: 'handleRefreshCache',
			icon: 'Refresh',
			label: '刷新缓存',
			plain: true,
			show: checkPermission(['system:dict:remove']),
			type: 'danger'
		}
	],

	span: 6,
	tableHeader: [
		{
			label: '字典编号',
			prop: 'dictId',
			showOverflowTooltip: true
		},
		{
			label: '字典名称',
			prop: 'dictName',
			showOverflowTooltip: true
		},
		{
			label: '字典类型',
			prop: 'dictType',
			showOverflowTooltip: true,
			slotName: 'dictTypeSlot'
		},
		{
			label: '状态',
			prop: 'status',
			slotName: 'statusSlot'
		},
		{
			label: '备注',
			prop: 'remark',
			showOverflowTooltip: true
		},
		{
			format: v => dayjs(v).format('YYYY-MM-DD hh:mm:ss'),
			label: '创建时间',
			prop: 'createTime'
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
					show: checkPermission(['system:dict:edit']),
					tip: '修改',
					type: 'primary'
				},

				{
					event: 'handleDelete',
					icon: 'Delete',
					label: '删除',
					link: true,
					show: checkPermission(['system:dict:remove']),
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
		typeExport(pageParams).then(data => {
			downloadBlobFile(data.data, data.filename ? data.filename : `role_${new Date().getTime()}.xlsx`)
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
		handleUpdate(row.dictId)
	} else if (event === 'handleDelete') {
		// 删除
		handleDelete(row.dictId)
	}
}

const dialogVisible = ref(false)
const dialogId = ref('')
function handleUpdate(id: string) {
	dialogVisible.value = true
	dialogId.value = id + ''
	if (id) {
		// 修改
	} else {
		// 新增
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
	await delType(ids)
	ElMessage.success('删除成功')
	formGeneratorRef.value?.queryTableData()
}

function queryList() {
	formGeneratorRef.value?.queryTableData()
}

function init() {
	getDicts('sys_normal_disable').then(data => {
		sysNormalDisable.value = data
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
			<template #dictTypeSlot="{ row }">
				<RouterLink
					class="link-type"
					:to="'/system/dict-data/index/' + row.dictId"
				>
					<span>{{ row.dictType }}</span>
				</RouterLink>
			</template>
			<template #statusSlot="{ row }">
				<DictTag
					:options="sysNormalDisable"
					:value="row.status"
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
