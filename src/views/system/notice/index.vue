<script setup lang="ts" name="Notice">
import dayjs from 'dayjs'

import { getDicts } from '@/api/system/dict'
import { listNotice, delNotice } from '@/api/system/notice'
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
	selectionList.value = v.map(item => item.noticeId)
}

const sysNoticeType = ref<API.IGetDictsRes>([])
const sysNoticeStatus = ref<API.IGetDictsRes>([])

const formConfig = ref<FormConfig>({
	api: listNotice,
	fields: [
		{
			label: '公告标题',
			placeholder: '请输入公告标题',
			prop: 'noticeTitle',
			type: 'input'
		},

		{
			label: '操作人员',
			placeholder: '请输入操作人员',
			prop: 'createBy',
			type: 'input'
		},

		{
			label: '公告类型',
			options: sysNoticeType as unknown as any[],
			placeholder: '请选择公告类型',
			prop: 'noticeType',
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
			show: checkPermission(['system:notice:add']),
			type: 'primary'
		},

		{
			disabled: single as unknown as boolean,
			event: 'handleUpdate',
			icon: 'Edit',
			label: '修改',
			plain: true,
			show: checkPermission(['system:notice:edit']),
			type: 'success'
		},

		{
			disabled: multiple as unknown as boolean,
			event: 'handleDelete',
			icon: 'Delete',
			label: '删除',
			plain: true,
			show: checkPermission(['system:notice:remove']),
			type: 'danger'
		}
	],

	span: 6,
	tableHeader: [
		{
			label: '序号',
			prop: 'noticeId',
			showOverflowTooltip: true,
			width: '80px'
		},
		{
			label: '公告标题',
			prop: 'noticeTitle',
			showOverflowTooltip: true,
			width: '350px'
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
			format: v => dayjs(v).format('YYYY-MM-DD'),
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
					show: checkPermission(['system:notice:edit']),
					tip: '修改',
					type: 'primary'
				},

				{
					event: 'handleDelete',
					icon: 'Delete',
					label: '删除',
					link: true,
					show: checkPermission(['system:notice:remove']),
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
		cancelButtonText: '取消',
		confirmButtonText: '确定',
		message: `是否确认删除用户编号为"${ids}"的数据项？`,
		showCancelButton: true,
		title: '提示',
		type: 'warning'
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
			@selectionChange="selectionChange"
			@tableEditClick="tableEditClick"
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
