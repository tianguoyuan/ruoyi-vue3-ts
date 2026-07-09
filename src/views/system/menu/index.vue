<script setup lang="ts" name="Menu">
import dayjs from 'dayjs'

import { getDicts } from '@/api/system/dict'
import { delMenu, listMenu } from '@/api/system/menu'
import FormGenerator from '@/components/FormGenerator/index.vue'
import type { FormConfig } from '@/components/FormGenerator/types'
import { checkPermission } from '@/utils/permission'

import EditDialog from './components/EditDialog.vue'

const formGeneratorRef = ref<InstanceType<typeof FormGenerator> | null>(null)
const formData = ref({
	menuId: ''
})
const sysNormalDisable = ref<API.IGetDictsRes>([])

const formConfig = ref<FormConfig>({
	api: listMenu,
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
	tableExpandAll: false,
	tableHeader: [
		{
			align: 'left',
			label: '菜单名称',
			prop: 'menuName',
			showOverflowTooltip: true
		},
		{
			label: '图标',
			prop: 'icon',
			showOverflowTooltip: true,
			slotName: 'iconSlot'
		},
		{
			label: '排序',
			prop: 'orderNum',
			showOverflowTooltip: true,
			width: '60px'
		},
		{
			label: '权限标识',
			prop: 'perms',
			showOverflowTooltip: true
		},
		{
			label: '组件路径',
			prop: 'component',
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
					show: checkPermission(['system:menu:edit']),
					tip: '修改',
					type: 'primary'
				},
				{
					event: 'handleAdd',
					icon: 'Plus',
					label: '新增',
					link: true,
					show: checkPermission(['system:menu:add']),
					tip: '新增',
					type: 'primary'
				},

				{
					event: 'handleDelete',
					icon: 'Delete',
					label: '删除',
					link: true,
					show: row => checkPermission(['system:menu:remove']),
					tip: '删除',
					type: 'primary'
				}
			],
			width: '200px'
		}
	],
	tableShow: true,
	tableTreeProps: {
		children: 'children',
		hasChildren: 'hasChildren'
	},
	tableTreeRowKey: 'menuId'
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
		handleUpdate(row, 'edit')
	} else if (event === 'handleAdd') {
		// 新增
		handleUpdate(row, 'addChild')
	} else if (event === 'handleDelete') {
		// 删除
		await ElMessageBox({
			cancelButtonText: '取消',
			confirmButtonText: '确定',
			message: `是否确认删除名称为"${row.menuName}"的数据项?`,
			showCancelButton: true,
			title: '提示',
			type: 'warning'
		})

		await delMenu(row.menuId)
		ElMessage.success('删除成功')
		formGeneratorRef.value?.queryTableData()
	}
}

// 新增编辑弹窗
const dialogVisible = ref(false)
const dialogParentId = ref(0)
const dialogId = ref<number | undefined>(undefined)
export type IDialogFlag = 'add' | 'addChild' | 'edit' | ''
const dialogFlag = ref<IDialogFlag>('add')
async function handleUpdate(row, flag: IDialogFlag) {
	if (flag === 'add') {
		// 新增弹窗
		dialogParentId.value = 0
		dialogId.value = undefined
	} else if (row && flag === 'addChild') {
		// 新增子菜单
		dialogParentId.value = row.menuId
		dialogId.value = undefined
	} else if (row && flag === 'edit') {
		// 修改菜单
		dialogParentId.value = row.parentId
		dialogId.value = row.menuId
	}

	dialogFlag.value = ''
	dialogVisible.value = true
	await nextTick()
	dialogFlag.value = flag
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
			<template #iconSlot="{ row }">
				<SvgIcon :iconClass="row.icon" />
			</template>
			<!-- table-状态 -->
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
			:flag="dialogFlag"
			:parentId="dialogParentId"
			@refresh="queryList"
		/>
	</div>
</template>

<style scoped></style>
