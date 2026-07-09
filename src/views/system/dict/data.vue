<script setup lang="ts" name="Dict">
import dayjs from 'dayjs'

import { getDicts, optionselect } from '@/api/system/dict'
import { listData, dataExport, delData, getData } from '@/api/system/dictData'
import { getType } from '@/api/system/dictType'
import FormGenerator from '@/components/FormGenerator/index.vue'
import type { FormConfig } from '@/components/FormGenerator/types'
import { useTagsViewStore } from '@/store/tagsView'
import { downloadBlobFile } from '@/utils'
import { checkPermission } from '@/utils/permission'

import DataEditDialog from './components/DataEditDialog.vue'

const router = useRouter()
const route = useRoute()
const tagsStore = useTagsViewStore()

const routeDictId = route.params.dictId as string
const defaultDictType = ref('')

const formGeneratorRef = ref<InstanceType<typeof FormGenerator> | null>(null)
const formData = ref({
	dictType: ''
})
const selectionList = ref<string[]>([])
const multiple = computed(() => !(selectionList.value.length >= 1))
const single = computed(() => !(selectionList.value.length === 1))

function selectionChange(v) {
	selectionList.value = v.map(item => item.dictCode)
}

const sysNormalDisable = ref<API.IGetDictsRes>([])
const typeOptions = ref<API.IGetDictsRes>([])

const formConfig = ref<FormConfig>({
	api: listData,
	buttons: [
		{
			event: 'search',
			icon: 'Search',
			label: '搜索',
			type: 'primary'
		},
		{
			event: 'reset',
			icon: 'Refresh',
			label: '重置'
		}
	],
	fields: [
		{
			clearable: false,
			label: '字典名称',
			options: typeOptions as unknown as any[],
			placeholder: '请输入字典名称',
			prop: 'dictType',
			type: 'select'
		},

		{
			label: '字典标签',
			placeholder: '请输入字典标签',
			prop: 'dictLabel',
			type: 'input'
		},

		{
			label: '字典状态',
			options: sysNormalDisable as unknown as any[],
			placeholder: '请选择字典状态',
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
			event: 'handleClose',
			icon: 'Close',
			label: '关闭',
			plain: true,
			type: 'danger'
		}
	],

	span: 6,
	tableHeader: [
		{
			label: '字典编码',
			prop: 'dictCode',
			showOverflowTooltip: true
		},
		{
			label: '字典标签',
			prop: 'dictLabel',
			showOverflowTooltip: true,
			slotName: 'dictLabelSlot'
		},
		{
			label: '字典键值',
			prop: 'dictValue',
			showOverflowTooltip: true
		},
		{
			label: '字典排序',
			prop: 'dictSort'
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
	tableInitQueryRefuse: true,
	tableShow: true,
	tableShowSelection: true
})

// 表单按钮
async function handleButtonClick(event: string) {
	if (event === 'search') {
		queryList()
	} else if (event === 'reset') {
		formGeneratorRef.value?.resetFields()
		formData.value.dictType = defaultDictType.value
		queryList()
	} else if (event === 'handleAdd') {
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
		dataExport({
			...pageParams,
			dictType: formData.value.dictType
		}).then(data => {
			downloadBlobFile(data.data, data.filename ? data.filename : `role_${new Date().getTime()}.xlsx`)
		})
	} else if (event === 'handleClose') {
		// 关闭页面
		tagsStore.delView({
			name: route.name as string,
			path: route.path
		})
		router.replace('/system/dict')
	}
}
// 表格按钮
async function tableEditClick(row, btn) {
	const { event } = btn
	if (event === 'handleUpdate') {
		// 修改
		handleUpdate(row.dictCode)
	} else if (event === 'handleDelete') {
		// 删除
		handleDelete(row.dictCode)
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
	await delData(ids)
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

	/** 查询字典类型详细 */
	getType(routeDictId).then(response => {
		formData.value.dictType = response.data.dictType
		defaultDictType.value = response.data.dictType
		queryList()
	})

	/** 查询字典类型列表 */
	optionselect().then(response => {
		typeOptions.value = response.data.map(v => ({
			label: v.dictName,
			value: v.dictType
		}))
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
			<template #dictLabelSlot="{ row }">
				<span v-if="(row.listClass == '' || row.listClass == 'default') && (row.cssClass == '' || row.cssClass == null)">{{
					row.dictLabel
				}}</span>
				<ElTag
					v-else
					:class="row.cssClass"
					:type="row.listClass == 'primary' ? '' : row.listClass"
				>
					{{ row.dictLabel }}
				</ElTag>
			</template>

			<template #statusSlot="{ row }">
				<DictTag
					:options="sysNormalDisable"
					:value="row.status"
				/>
			</template>
		</FormGenerator>

		<DataEditDialog
			:id="dialogId"
			v-model:visible="dialogVisible"
			:dictType="formData.dictType"
			@refresh="queryList"
		/>
	</div>
</template>
