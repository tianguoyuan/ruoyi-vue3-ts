<script setup lang="ts" name="Dept">
import type { FormConfig } from '@/components/FormGenerator/types'
import FormGenerator from '@/components/FormGenerator/index.vue'
import { checkPermission } from '@/utils/permission'
import { getDicts } from '@/api/system/dict'
import dayjs from 'dayjs'
import { delDept, getDept, listDept } from '@/api/system/dep'
import EditDialog from './components/EditDialog.vue'

const formGeneratorRef = ref<InstanceType<typeof FormGenerator> | null>(null)
const formData = ref({
	deptId: ''
})
const sysNormalDisable = ref<API.IGetDictsRes>([])

const formConfig = ref<FormConfig>({
	labelWidth: '80px',
	span: 6,
	fields: [
		{
			type: 'input',
			label: '部门名称',
			prop: 'deptName',
			placeholder: '请输入部门名称'
		},

		{
			type: 'select',
			label: '部门状态',
			prop: 'roleName',
			placeholder: '请选择部门状态',
			options: sysNormalDisable as unknown as any[]
		}
	],
	leftButtons: [
		{
			label: '新增',
			type: 'primary',
			event: 'handleAdd',
			plain: true,
			icon: 'Plus',
			show: checkPermission(['system:dept:add'])
		},

		{
			label: '展开/折叠',
			type: 'info',
			event: 'toggleExpandAll',
			plain: true,
			icon: 'Sort'
		}
	],

	tableShow: true,
	api: listDept,
	tableExpandAll: true,
	tableTreeRowKey: 'deptId',
	removePageParams: true,
	tableTreeProps: {
		children: 'children',
		hasChildren: 'hasChildren'
	},
	tableHeader: [
		{
			label: '部门名称',
			prop: 'deptName',
			showOverflowTooltip: true,
			align: 'left'
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
			label: '创建时间',
			prop: 'createTime',
			showOverflowTooltip: true,
			format: v => dayjs(v).format('YYYY-MM-DD hh:mm:ss')
		},
		{
			label: '操作',
			custom: true,
			prop: '',
			tableEditBtn: [
				{
					type: 'primary',
					link: true,
					icon: 'Edit',
					tip: '修改',
					label: '修改',
					event: 'handleUpdate',
					show: checkPermission(['system:dept:edit'])
				},
				{
					type: 'primary',
					link: true,
					icon: 'Plus',
					tip: '新增',
					label: '新增',
					event: 'handleAdd',
					show: checkPermission(['system:dept:add'])
				},

				{
					type: 'primary',
					link: true,
					icon: 'Delete',
					tip: '删除',
					label: '删除',
					event: 'handleDelete',
					show: row => checkPermission(['system:dept:remove']) && row.parentId !== 0
				}
			]
		}
	]
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
			title: '提示',
			message: `是否确认删除名称为"${row.deptName}"的数据项?`,
			type: 'warning',
			showCancelButton: true,
			cancelButtonText: '取消',
			confirmButtonText: '确定'
		})

		await delDept(row.deptId)
		ElMessage.success('删除成功')
		formGeneratorRef.value?.queryTableData()
	}
}

// 新增编辑弹窗
const editDialogVisible = ref(false)
const editDialogOptions = ref<API.IGetDictsRes>([])
const editDIalogParentId = ref('')
const editDIalogFlag = ref<'add' | 'edit'>('add')
const editDIalogDeptId = ref('')
async function handleUpdate(id: string, flag: 'add' | 'edit', deptId?: string) {
	editDialogOptions.value = formGeneratorRef.value?.getTableData() || []
	editDIalogParentId.value = id + ''
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
					:value="row.status"
					:options="sysNormalDisable"
				/>
			</template>
		</FormGenerator>

		<EditDialog
			v-model:visible="editDialogVisible"
			:options="editDialogOptions"
			:parent-id="editDIalogParentId"
			:flag="editDIalogFlag"
			:dept-id="editDIalogDeptId"
			@refresh="queryList"
		/>
	</div>
</template>

<style scoped></style>
