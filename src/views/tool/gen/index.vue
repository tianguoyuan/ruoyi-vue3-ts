<script setup lang="ts">
import { genBatchGenCode, getGenList } from '@/api/tool/gen'
import FormGenerator from '@/components/FormGenerator/index.vue'
import type { FormConfig } from '@/components/FormGenerator/types'
import { downloadBlobFile } from '@/utils'
import { checkPermission } from '@/utils/permission'

const formData = ref<Record<string, any>>({})

const selectionList = ref<{ tableName: string }[]>([])
function selectionChange(val) {
	selectionList.value = val
}
const multiple = computed(() => {
	return !(selectionList.value.length > 1)
}) as unknown as boolean
const single = computed(() => {
	return !(selectionList.value.length === 1)
}) as unknown as boolean

const formConfig = ref<FormConfig>({
	labelWidth: '80px',
	span: 6,
	fields: [
		{
			type: 'input',
			label: '表名称',
			prop: 'tableName',
			placeholder: '请输入表名称'
		},
		{
			type: 'input',
			label: '表描述',
			prop: 'tableComment',
			placeholder: '请输入表描述'
		},
		{
			type: 'date-picker',
			label: '创建时间',
			prop: 'beginTime',
			placeholder: '请选择创建时间',
			dateType: 'daterange',
			span: 8
		}
	],
	buttons: [
		{
			label: '搜索',
			type: 'primary',
			event: 'search'
		},
		{
			label: '重置',
			type: 'danger',
			event: 'reset'
		}
	],
	leftButtons: [
		{
			label: '生成',
			type: 'primary',
			event: 'handleGenTable',
			plain: true,
			icon: 'Download',
			show: checkPermission(['tool:gen:code']),
			disabled: multiple
		},
		{
			label: '创建',
			type: 'primary',
			event: 'openCreateTable',
			plain: true,
			icon: 'Plus',
			show: checkPermission(['admin'])
		},
		{
			label: '导入',
			type: 'info',
			event: 'openImportTable',
			plain: true,
			icon: 'Upload',
			show: checkPermission(['tool:gen:import'])
		},
		{
			label: '修改',
			type: 'success',
			event: 'handleEditTable',
			plain: true,
			icon: 'Edit',
			show: checkPermission(['tool:gen:edit']),
			disabled: single
		},
		{
			label: '删除',
			type: 'danger',
			event: 'handleDelete',
			plain: true,
			icon: 'Delete',
			show: checkPermission(['tool:gen:remove']),
			disabled: multiple
		}
	],

	tableShow: true,
	api: getGenList,
	customPageChange: true,
	tableInitQueryRefuse: true,
	tableShowSelection: true,
	tableShowIndex: true,
	tableHeader: [
		{
			label: '表名称',
			prop: 'tableName'
		},
		{
			label: '表描述',
			prop: 'tableComment'
		},
		{
			label: '实体',
			prop: 'className'
		},
		{
			label: '创建时间',
			prop: 'createTime',
			sortable: 'custom'
		},
		{
			label: '更新时间',
			prop: 'updateTime'
		},
		{
			label: '操作',
			custom: true,
			tableEditBtn: [
				{
					type: 'primary',
					link: true,
					icon: 'View',
					tip: '预览',
					event: 'handlePreview',
					show: checkPermission(['tool:gen:preview'])
				},
				{
					type: 'primary',
					link: true,
					icon: 'Edit',
					tip: '编辑',
					event: 'handleEditTable',
					show: checkPermission(['tool:gen:edit'])
				},
				{
					type: 'primary',
					link: true,
					icon: 'Delete',
					tip: '删除',
					event: 'handleDelete',
					show: checkPermission(['tool:gen:remove'])
				},
				{
					type: 'primary',
					link: true,
					icon: 'Refresh',
					tip: '同步',
					event: 'handleSynchDb',
					show: checkPermission(['tool:gen:edit'])
				},
				{
					type: 'primary',
					link: true,
					icon: 'Download',
					event: 'handleGenTable',
					show: checkPermission(['tool:gen:code']),
					tip: '生成代码'
				}
			]
		}
	]
})

const formGeneratorRef = ref<InstanceType<typeof FormGenerator> | null>(null)
function pageChange(otherParams = {}) {
	formGeneratorRef.value?.queryTableData({
		'params[beginTime]': formData.value.beginTime ? formData.value.beginTime[0] : undefined,
		'params[endTime]': formData.value.beginTime ? formData.value.beginTime[1] : undefined,
		beginTime: undefined,
		...otherParams
	})
}

onMounted(() => {
	pageChange()
})

// 表单按钮点击
async function handleButtonClick(event: string, data: any) {
	if (event === 'search') {
		const isPass = await formGeneratorRef.value?.validate()
		if (!isPass) return
		pageChange()
	} else if (event === 'reset') {
		formGeneratorRef.value?.resetFields()
	} else if (event === 'handleGenTable') {
		// 生成
		handleGenTable(selectionList.value.map(v => v.tableName).join(','))
	} else if (event === 'openCreateTable') {
		// 创建
	} else if (event === 'openImportTable') {
		// 导入
	} else if (event === 'handleEditTable') {
		// 修改
	} else if (event === 'handleDelete') {
		// 删除
	}
}
// 表格按钮点击
function tableEditClick(row, btn) {
	if (btn.event === 'handlePreview') {
		// 预览
	} else if (btn.event === 'handleEditTable') {
		// 编辑
	} else if (btn.event === 'handleDelete') {
		// 删除
	} else if (btn.event === 'handleSynchDb') {
		// 同步
	} else if (btn.event === 'handleGenTable') {
		// 生成
		handleGenTable(row.tableName)
	}
}

function handleGenTable(tableName: string) {
	genBatchGenCode({ tables: tableName }).then(data => {
		downloadBlobFile(data.data, data.filename || new Date().getTime() + '.zip')
	})
}
</script>

<template>
	<div class="p-3">
		<FormGenerator
			ref="formGeneratorRef"
			v-model="formData"
			:config="formConfig"
			@buttonClick="handleButtonClick"
			@tableEditClick="tableEditClick"
			@customPageChange="pageChange"
			@selectionChange="selectionChange"
		/>
	</div>
</template>

<style scoped></style>
