<script setup lang="ts" name="Dept">
import dayjs from 'dayjs'

import { delDept, getDept, listDept } from '@/api/system/dept'
import { getDicts } from '@/api/system/dict'
import FormGenerator from '@/components/FormGenerator/index.vue'
import type { FormConfig } from '@/components/FormGenerator/types'
import { checkPermission } from '@/utils/permission'

import EditDialog from './components/EditDialog.vue'

const formGeneratorRef = ref<InstanceType<typeof FormGenerator> | null>(null)
const formData = ref({
	deptId: ''
})
const sysNormalDisable = ref<API.IGetDictsRes>([])

const formConfig = ref<FormConfig>({
	api: listDept,
	fields: [
		{
			label: '部门名称',
			placeholder: '请输入部门名称',
			prop: 'deptName',
			type: 'input'
		},

		{
			label: '部门状态',
			options: sysNormalDisable as unknown as any[],
			placeholder: '请选择部门状态',
			prop: 'roleName',
			type: 'select'
		}
	],
	labelWidth: '80px',
	leftButtons: [
		{
			event: 'handleAdd',
			icon: 'Plus',
			label: '新增',
			plain: true,
			show: checkPermission(['system:dept:add']),
			type: 'primary'
		},

		{
			event: 'toggleExpandAll',
			icon: 'Sort',
			label: '展开/折叠',
			plain: true,
			type: 'info'
		}
	],

	removePageParams: true,
	span: 6,
	tableExpandAll: true,
	tableHeader: [
		{
			align: 'left',
			label: '部门名称',
			prop: 'deptName',
			showOverflowTooltip: true
		},
		{
			label: '排序',
			prop: 'orderNum',
			showOverflowTooltip: true
		},
		{
			label: '状态',
			prop: 'status',
			slotName: 'statusSlot'
		},
		{
			format: v => dayjs(v).format('YYYY-MM-DD hh:mm:ss'),
			label: '创建时间',
			prop: 'createTime',
			showOverflowTooltip: true
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
					show: checkPermission(['system:dept:edit']),
					tip: '修改',
					type: 'primary'
				},
				{
					event: 'handleAdd',
					icon: 'Plus',
					label: '新增',
					link: true,
					show: checkPermission(['system:dept:add']),
					tip: '新增',
					type: 'primary'
				},

				{
					event: 'handleDelete',
					icon: 'Delete',
					label: '删除',
					link: true,
					show: row => checkPermission(['system:dept:remove']) && row.parentId !== 0,
					tip: '删除',
					type: 'primary'
				}
			]
		}
	],
	tableShow: true,
	tableTreeProps: {
		children: 'children',
		hasChildren: 'hasChildren'
	},
	tableTreeRowKey: 'deptId'
})

function handleButtonClick(event: string) {
	if (event === 'handleAdd') {
		// 新增
		handleUpdate('', 'add')
	} else if (event === 'toggleExpandAll') {
		// 展开/折叠
		formConfig.value.tableExpandAll = !formConfig.value.tableExpandAll
	}
}

async function tableEditClick(row, btn) {
	const { event } = btn
	if (event === 'handleUpdate') {
		// 修改
		handleUpdate(row.parentId, 'edit', row.deptId)
	} else if (event === 'handleAdd') {
		// 新增
		handleUpdate(row.parentId, 'add')
	} else if (event === 'handleDelete') {
		// 删除

		await ElMessageBox({
			cancelButtonText: '取消',
			confirmButtonText: '确定',
			message: `是否确认删除名称为"${row.deptName}"的数据项?`,
			showCancelButton: true,
			title: '提示',
			type: 'warning'
		})

		await delDept(row.deptId)
		ElMessage.success('删除成功')
		formGeneratorRef.value?.queryTableData()
	}
}

// 新增编辑弹窗
const editDialogVisible = ref(false)
const editDialogOptions = ref<API.IGetDictsRes>([])
const editDialogParentId = ref('')
const editDIalogFlag = ref<'add' | 'edit'>('add')
const editDIalogDeptId = ref('')
async function handleUpdate(id: string, flag: 'add' | 'edit', deptId?: string) {
	editDialogOptions.value = formGeneratorRef.value?.getTableData() || []
	editDialogParentId.value = id + ''
	editDIalogFlag.value = flag
	editDialogVisible.value = true

	editDIalogDeptId.value = deptId ? deptId + '' : ''
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
			@tableEditClick="tableEditClick"
		>
			<!-- table-状态 -->
			<template #statusSlot="{ row }">
				<DictTag
					:options="sysNormalDisable"
					:value="row.status"
				/>
			</template>
		</FormGenerator>

		<EditDialog
			v-model:visible="editDialogVisible"
			:deptId="editDIalogDeptId"
			:flag="editDIalogFlag"
			:options="editDialogOptions"
			:parentId="editDialogParentId"
			@refresh="queryList"
		/>
	</div>
</template>

<style scoped></style>
