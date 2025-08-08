<script setup lang="ts" name="Role">
import { listUser } from '@/api/system/user'
import type { FormConfig } from '@/components/FormGenerator/types'
import { checkPermission } from '@/utils/permission'
import FormGenerator from '@/components/FormGenerator/index.vue'
import dayjs from 'dayjs'
import { getDicts } from '@/api/system/dict'
import { listRole } from '@/api/system/role'

const formGeneratorRef = ref<InstanceType<typeof FormGenerator> | null>(null)
const formData = ref({
	deptId: ''
})
const selectionList = ref([])
const multiple = computed(() => !(selectionList.value.length >= 1))
const single = computed(() => !(selectionList.value.length === 1))

function selectionChange(v) {
	selectionList.value = v.map(item => item.userId)
}

const sysNormalDisable = ref<API.IGetDictsRes>([])

const formConfig = ref<FormConfig>({
	labelWidth: '80px',
	span: 6,
	fields: [
		{
			type: 'input',
			label: '角色名称',
			prop: 'roleName',
			placeholder: '请输入角色名称'
		},

		{
			type: 'input',
			label: '权限字符',
			prop: 'roleKey',
			placeholder: '请输入权限字符'
		},

		{
			type: 'select',
			label: '状态',
			prop: 'roleName',
			placeholder: '请选择状态',
			options: sysNormalDisable as unknown as any[]
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
			show: checkPermission(['system:role:add'])
		},

		{
			label: '修改',
			type: 'success',
			event: 'handleUpdate',
			plain: true,
			icon: 'Edit',
			show: checkPermission(['system:role:edit']),
			disabled: single as unknown as boolean
		},

		{
			label: '删除',
			type: 'danger',
			event: 'handleDelete',
			plain: true,
			icon: 'Delete',
			show: checkPermission(['system:role:remove']),
			disabled: multiple as unknown as boolean
		},

		{
			label: '导出',
			type: 'warning',
			event: 'handleExport',
			plain: true,
			icon: 'Download',
			show: checkPermission(['system:role:export'])
		}
	],

	tableShow: true,
	api: listRole,
	tableShowSelection: true,
	tableHeader: [
		{
			label: '角色编号',
			prop: 'roleId',
			showOverflowTooltip: true
		},
		{
			label: '角色名称',
			prop: 'roleName',
			showOverflowTooltip: true
		},
		{
			label: '权限字符',
			prop: 'roleKey',
			showOverflowTooltip: true
		},
		{
			label: '显示顺序',
			prop: 'roleSort',
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
					event: 'handleUpdate',
					show: row => checkPermission(['system:role:edit']) && row.userId !== 1
				},

				{
					type: 'primary',
					link: true,
					icon: 'Delete',
					tip: '删除',
					event: 'handleDelete',
					show: row => checkPermission(['system:role:remove']) && row.userId !== 1
				},

				{
					type: 'primary',
					link: true,
					icon: 'CircleCheck',
					tip: '数据权限',
					event: 'handleDataScope',
					show: row => checkPermission(['system:role:edit']) && row.userId !== 1
				},

				{
					type: 'primary',
					link: true,
					icon: 'User',
					tip: '分配用户',
					event: 'handleAuthRole',
					show: row => checkPermission(['system:role:edit']) && row.userId !== 1
				}
			]
		}
	]
})

function handleButtonClick(event: string) {}
function tableEditClick(row, btn) {}

function handleStatusChange(row) {
	const preStatus = row.status === '0' ? '1' : '0'
	const flagMsg = row.status === '0' ? '启用' : '停用'

	ElMessageBox({
		title: '提示',
		type: 'warning',
		message: `确认要"${flagMsg}""${row.roleId}"用户吗?`,
		showCancelButton: true,
		cancelButtonText: '取消',
		confirmButtonText: '确定'
	})
		.then(async () => {
			// await changeUserStatus(row.userId, row.status)
			// ElMessage.success(flagMsg + '成功')

			formGeneratorRef.value?.queryTableData()
		})
		.catch(() => {
			row.status = preStatus
		})
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
			@selectionChange="selectionChange"
		>
			<template #statusSlot="{ row }">
				<el-switch
					v-model="row.status"
					active-value="0"
					inactive-value="1"
					@click="handleStatusChange(row)"
				/>
			</template>
		</FormGenerator>
	</div>
</template>

<style scoped></style>
