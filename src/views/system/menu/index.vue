<script setup lang="ts" name="Menu">
import type { FormConfig } from '@/components/FormGenerator/types'
import FormGenerator from '@/components/FormGenerator/index.vue'
import { checkPermission } from '@/utils/permission'
import { getDicts } from '@/api/system/dict'
import dayjs from 'dayjs'
import { delMenu, getMenu, listMenu } from '@/api/system/menu'
import EditDialog from './components/EditDialog.vue'

const formGeneratorRef = ref<InstanceType<typeof FormGenerator> | null>(null)
const formData = ref({
	menuId: ''
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
	api: listMenu,
	tableExpandAll: false,
	tableTreeRowKey: 'menuId',
	removePageParams: true,
	tableTreeProps: {
		children: 'children',
		hasChildren: 'hasChildren'
	},
	tableHeader: [
		{
			label: '菜单名称',
			prop: 'menuName',
			showOverflowTooltip: true,
			align: 'left'
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
			width: '60px',
			showOverflowTooltip: true
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
			label: '创建时间',
			prop: 'createTime',
			showOverflowTooltip: true,
			format: v => dayjs(v).format('YYYY-MM-DD hh:mm:ss')
		},
		{
			label: '操作',
			custom: true,
			prop: '',
			width: '200px',
			tableEditBtn: [
				{
					type: 'primary',
					link: true,
					icon: 'Edit',
					tip: '修改',
					label: '修改',
					event: 'handleUpdate',
					show: checkPermission(['system:menu:edit'])
				},
				{
					type: 'primary',
					link: true,
					icon: 'Plus',
					tip: '新增',
					label: '新增',
					event: 'handleAdd',
					show: checkPermission(['system:menu:add'])
				},

				{
					type: 'primary',
					link: true,
					icon: 'Delete',
					tip: '删除',
					label: '删除',
					event: 'handleDelete',
					show: row => checkPermission(['system:menu:remove'])
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
		handleUpdate(row.parentId, 'edit', row.menuId)
	} else if (event === 'handleAdd') {
		// 新增
		handleUpdate(row.parentId, 'add')
	} else if (event === 'handleDelete') {
		// 删除
		await ElMessageBox({
			title: '提示',
			message: `是否确认删除名称为"${row.menuName}"的数据项?`,
			type: 'warning',
			showCancelButton: true,
			cancelButtonText: '取消',
			confirmButtonText: '确定'
		})

		await delMenu(row.menuId)
		ElMessage.success('删除成功')
		formGeneratorRef.value?.queryTableData()
	}
}

// 新增编辑弹窗
const dialogVisible = ref(false)
const dialogParentId = ref('')
async function handleUpdate(id: string, flag: 'add' | 'edit', menuId?: string) {
	dialogVisible.value = true
	dialogParentId.value = id + ''
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
				<SvgIcon :icon-class="row.icon" />
			</template>
			<!-- table-状态 -->
			<template #statusSlot="{ row }">
				<DictTag
					:value="row.status"
					:options="sysNormalDisable"
				/>
			</template>
		</FormGenerator>

		<EditDialog
			:id="dialogParentId"
			v-model:visible="dialogVisible"
			@refresh="queryList"
		/>
	</div>
</template>

<style scoped></style>
