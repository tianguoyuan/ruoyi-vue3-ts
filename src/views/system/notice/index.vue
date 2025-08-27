<script setup lang="ts" name="Notice">
import type { FormConfig } from '@/components/FormGenerator/types'
import { checkPermission } from '@/utils/permission'
import FormGenerator from '@/components/FormGenerator/index.vue'
import dayjs from 'dayjs'
import { getDicts } from '@/api/system/dict'
import { downloadBlobFile } from '@/utils'
import { listNotice, delNotice } from '@/api/system/notice'
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
	selectionList.value = v.map(item => item.noticeId)
}

const sysNoticeType = ref<API.IGetDictsRes>([])
const sysNoticeStatus = ref<API.IGetDictsRes>([])

const formConfig = ref<FormConfig>({
	labelWidth: '80px',
	span: 6,
	fields: [
		{
			type: 'input',
			label: '公告标题',
			prop: 'noticeTitle',
			placeholder: '请输入公告标题'
		},

		{
			type: 'input',
			label: '操作人员',
			prop: 'createBy',
			placeholder: '请输入操作人员'
		},

		{
			type: 'select',
			label: '公告类型',
			prop: 'noticeType',
			placeholder: '请选择公告类型',
			options: sysNoticeType as unknown as any[]
		}
	],
	leftButtons: [
		{
			label: '新增',
			type: 'primary',
			event: 'handleAdd',
			plain: true,
			icon: 'Plus',
			show: checkPermission(['system:notice:add'])
		},

		{
			label: '修改',
			type: 'success',
			event: 'handleUpdate',
			plain: true,
			icon: 'Edit',
			show: checkPermission(['system:notice:edit']),
			disabled: single as unknown as boolean
		},

		{
			label: '删除',
			type: 'danger',
			event: 'handleDelete',
			plain: true,
			icon: 'Delete',
			show: checkPermission(['system:notice:remove']),
			disabled: multiple as unknown as boolean
		}
	],

	tableShow: true,
	api: listNotice,
	tableShowSelection: true,
	tableHeader: [
		{
			label: '序号',
			prop: 'noticeId',
			width: '80px',
			showOverflowTooltip: true
		},
		{
			label: '公告标题',
			prop: 'noticeTitle',
			width: '350px',
			showOverflowTooltip: true
		},
		{
			label: '公告类型',
			prop: 'noticeType',
			slotName: 'noticeTypeSlot'
		},
		{
			label: '状态',
			prop: 'status',
			slotName: 'statusSlot'
		},
		{
			label: '创建者',
			prop: 'createBy',
			showOverflowTooltip: true
		},
		{
			label: '创建时间',
			prop: 'createTime',
			format: v => dayjs(v).format('YYYY-MM-DD')
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
					show: checkPermission(['system:notice:edit'])
				},

				{
					type: 'primary',
					link: true,
					icon: 'Delete',
					tip: '删除',
					label: '删除',
					event: 'handleDelete',
					show: checkPermission(['system:notice:remove'])
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
	}
}
// 表格按钮
async function tableEditClick(row, btn) {
	const { event } = btn
	if (event === 'handleUpdate') {
		// 修改
		handleUpdate(row.noticeId)
	} else if (event === 'handleDelete') {
		// 删除
		handleDelete(row.noticeId)
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
	await delNotice(ids)
	ElMessage.success('删除成功')
	formGeneratorRef.value?.queryTableData()
}

function queryList() {
	formGeneratorRef.value?.queryTableData()
}

function init() {
	getDicts('sys_notice_type').then(data => {
		sysNoticeType.value = data
	})
	getDicts('sys_notice_status').then(data => {
		sysNoticeStatus.value = data
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
					:options="sysNoticeStatus"
					:value="row.status"
				/>
			</template>
			<template #noticeTypeSlot="{ row }">
				<DictTag
					:options="sysNoticeType"
					:value="row.noticeType"
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
