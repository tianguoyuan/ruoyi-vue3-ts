<script setup lang="ts" name="Post">
import dayjs from 'dayjs'

import { getDicts } from '@/api/system/dict'
import { listPost, postExport, delPost } from '@/api/system/post'
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
	selectionList.value = v.map(item => item.postId)
}

const sysNormalDisable = ref<API.IGetDictsRes>([])

const formConfig = ref<FormConfig>({
	api: listPost,
	fields: [
		{
			label: '岗位编码',
			placeholder: '请输入岗位编码',
			prop: 'postCode',
			type: 'input'
		},

		{
			label: '岗位名称',
			placeholder: '请输入岗位名称',
			prop: 'postName',
			type: 'input'
		},

		{
			label: '岗位状态',
			options: sysNormalDisable as unknown as any[],
			placeholder: '请选择岗位状态',
			prop: 'status',
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
			show: checkPermission(['system:post:add']),
			type: 'primary'
		},

		{
			disabled: single as unknown as boolean,
			event: 'handleUpdate',
			icon: 'Edit',
			label: '修改',
			plain: true,
			show: checkPermission(['system:post:edit']),
			type: 'success'
		},

		{
			disabled: multiple as unknown as boolean,
			event: 'handleDelete',
			icon: 'Delete',
			label: '删除',
			plain: true,
			show: checkPermission(['system:post:remove']),
			type: 'danger'
		},

		{
			event: 'handleExport',
			icon: 'Download',
			label: '导出',
			plain: true,
			show: checkPermission(['system:post:export']),
			type: 'warning'
		}
	],

	span: 6,
	tableHeader: [
		{
			label: '岗位编号',
			prop: 'postId',
			showOverflowTooltip: true
		},
		{
			label: '岗位编码',
			prop: 'postCode',
			showOverflowTooltip: true
		},
		{
			label: '岗位名称',
			prop: 'postName',
			showOverflowTooltip: true
		},
		{
			label: '岗位排序',
			prop: 'postSort',
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
					show: checkPermission(['system:post:edit']),
					tip: '修改',
					type: 'primary'
				},

				{
					event: 'handleDelete',
					icon: 'Delete',
					label: '删除',
					link: true,
					show: checkPermission(['system:post:remove']),
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
function handleButtonClick(event: string) {
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
		postExport(pageParams).then(data => {
			downloadBlobFile(data.data, data.filename ? data.filename : `role_${new Date().getTime()}.xlsx`)
		})
	}
}
// 表格按钮
function tableEditClick(row, btn) {
	const { event } = btn
	if (event === 'handleUpdate') {
		// 修改
		handleUpdate(row.postId)
	} else if (event === 'handleDelete') {
		// 删除
		handleDelete(row.postId)
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
	await delPost(ids)
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
