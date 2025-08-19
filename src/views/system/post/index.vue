<script setup lang="ts" name="Post">
import type { FormConfig } from '@/components/FormGenerator/types'
import { checkPermission } from '@/utils/permission'
import FormGenerator from '@/components/FormGenerator/index.vue'
import dayjs from 'dayjs'
import { getDicts } from '@/api/system/dict'
import { downloadBlobFile } from '@/utils'
import { listPost, postExport, delPost } from '@/api/system/post'
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
	labelWidth: '80px',
	span: 6,
	fields: [
		{
			type: 'input',
			label: '岗位编码',
			prop: 'postCode',
			placeholder: '请输入岗位编码'
		},

		{
			type: 'input',
			label: '岗位名称',
			prop: 'postName',
			placeholder: '请输入岗位名称'
		},

		{
			type: 'select',
			label: '岗位状态',
			prop: 'status',
			placeholder: '请选择岗位状态',
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
			show: checkPermission(['system:post:add'])
		},

		{
			label: '修改',
			type: 'success',
			event: 'handleUpdate',
			plain: true,
			icon: 'Edit',
			show: checkPermission(['system:post:edit']),
			disabled: single as unknown as boolean
		},

		{
			label: '删除',
			type: 'danger',
			event: 'handleDelete',
			plain: true,
			icon: 'Delete',
			show: checkPermission(['system:post:remove']),
			disabled: multiple as unknown as boolean
		},

		{
			label: '导出',
			type: 'warning',
			event: 'handleExport',
			plain: true,
			icon: 'Download',
			show: checkPermission(['system:post:export'])
		}
	],

	tableShow: true,
	api: listPost,
	tableShowSelection: true,
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
					label: '修改',
					event: 'handleUpdate',
					show: checkPermission(['system:post:edit'])
				},

				{
					type: 'primary',
					link: true,
					icon: 'Delete',
					tip: '删除',
					label: '删除',
					event: 'handleDelete',
					show: checkPermission(['system:post:remove'])
				}
			]
		}
	]
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

const dialogVIsible = ref(false)
const dialogId = ref('')
function handleUpdate(id: string) {
	dialogVIsible.value = true
	dialogId.value = id + ''
	if (id) {
		// 修改
	} else {
		// 新增
	}
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
			@tableEditClick="tableEditClick"
			@selectionChange="selectionChange"
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
			v-model:visible="dialogVIsible"
			@refresh="queryList"
		/>
	</div>
</template>
