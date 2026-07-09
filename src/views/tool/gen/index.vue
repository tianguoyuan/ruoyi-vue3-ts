<script setup lang="ts" name="GenEditIndex">
import { ElMessage, type Sort } from 'element-plus'

import { delTable, genBatchGenCode, getGenList, previewTable, synchDb } from '@/api/tool/gen'
import FormGenerator from '@/components/FormGenerator/index.vue'
import type { FormConfig } from '@/components/FormGenerator/types'
import { useTagsViewStore } from '@/store/tagsView'
import { downloadBlobFile } from '@/utils'
import { checkPermission } from '@/utils/permission'
import type { RouteLocationNormalizedLoaded } from 'vue-router'

import CreateDialog from './components/CreateDialog.vue'
import ImportDialog from './components/ImportDialog.vue'
import PreviewDialog from './components/PreviewDialog.vue'

const router = useRouter()
const route = useRoute()
const tagsViewStore = useTagsViewStore()

// 新增弹窗
const createDialogRef = ref<InstanceType<typeof CreateDialog> | null>(null)
// 导入弹窗
const importDialogRef = ref<InstanceType<typeof ImportDialog> | null>(null)
// 查看弹窗
const previewDialogShow = ref(false)
const previewInfo = ref({})

const formData = ref<Record<string, any>>({
	isAsc: 'descending',
	orderByColumn: 'createTime'
})
const defaultSort = {
	order: 'descending',
	prop: 'createTime'
} as Sort

interface IListRow {
	tableName: string
	tableId: string
}
const selectionList = ref<IListRow[]>([])
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
	api: getGenList,
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
			label: '表名称',
			placeholder: '请输入表名称',
			prop: 'tableName',
			type: 'input'
		},
		{
			label: '表描述',
			placeholder: '请输入表描述',
			prop: 'tableComment',
			type: 'input'
		},
		{
			dateType: 'daterange',
			label: '创建时间',
			placeholder: '请选择创建时间',
			prop: 'daterange',
			span: 8,
			type: 'date-picker'
		}
	],
	labelWidth: '80px',
	leftButtons: [
		{
			disabled: multiple,
			event: 'handleGenTable',
			icon: 'Download',
			label: '生成',
			plain: true,
			show: checkPermission(['tool:gen:code']),
			type: 'primary'
		},
		{
			event: 'openCreateTable',
			icon: 'Plus',
			label: '创建',
			plain: true,
			show: checkPermission(['admin']),
			type: 'primary'
		},
		{
			event: 'openImportTable',
			icon: 'Upload',
			label: '导入',
			plain: true,
			show: checkPermission(['tool:gen:import']),
			type: 'info'
		},
		{
			disabled: single,
			event: 'handleEditTable',
			icon: 'Edit',
			label: '修改',
			plain: true,
			show: checkPermission(['tool:gen:edit']),
			type: 'success'
		},
		{
			disabled: multiple,
			event: 'handleDelete',
			icon: 'Delete',
			label: '删除',
			plain: true,
			show: checkPermission(['tool:gen:remove']),
			type: 'danger'
		}
	],

	span: 6,
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
			custom: true,
			label: '操作',
			prop: '',
			tableEditBtn: [
				{
					event: 'handlePreview',
					icon: 'View',
					link: true,
					show: checkPermission(['tool:gen:preview']),
					tip: '预览',
					type: 'primary'
				},
				{
					event: 'handleEditTable',
					icon: 'Edit',
					link: true,
					show: checkPermission(['tool:gen:edit']),
					tip: '修改',
					type: 'primary'
				},
				{
					event: 'handleDelete',
					icon: 'Delete',
					link: true,
					show: checkPermission(['tool:gen:remove']),
					tip: '删除',
					type: 'primary'
				},
				{
					event: 'handleSynchDb',
					icon: 'Refresh',
					link: true,
					show: checkPermission(['tool:gen:edit']),
					tip: '同步',
					type: 'primary'
				},
				{
					event: 'handleGenTable',
					icon: 'Download',
					link: true,
					show: checkPermission(['tool:gen:code']),
					tip: '生成代码',
					type: 'primary'
				}
			]
		}
	],
	tableShow: true,
	tableShowIndex: true,
	tableShowSelection: true
})

const formGeneratorRef = ref<InstanceType<typeof FormGenerator> | null>(null)

function queryList() {
	formGeneratorRef.value?.queryTableData()
}
// 表单按钮点击
async function handleButtonClick(event: string, data: any) {
	if (event === 'search') {
		// 查询
		await formGeneratorRef.value?.validate()
		queryList()
	} else if (event === 'reset') {
		// 重置表单
		formGeneratorRef.value?.resetFields()
		formGeneratorRef.value?.resetPage()
		queryList()
	} else if (event === 'handleGenTable') {
		// 生成
		handleGenTable(selectionList.value.map(v => v.tableName).join(','))
	} else if (event === 'openCreateTable') {
		// 创建
		createDialogRef.value?.setVisible(true)
	} else if (event === 'openImportTable') {
		// 导入
		importDialogRef.value?.setVisible(true)
	} else if (event === 'handleEditTable') {
		// 修改
		handleEditTable(selectionList.value.map(v => v.tableId).join(','))
	} else if (event === 'handleDelete') {
		// 删除
		handleDelete(selectionList.value.map(v => v.tableId).join(','))
	}
}
// 表格按钮点击
async function tableEditClick(row, btn) {
	if (btn.event === 'handlePreview') {
		// 预览
		previewDialogShow.value = true
		const { data } = await previewTable(row.tableId)
		previewInfo.value = data
	} else if (btn.event === 'handleEditTable') {
		// 修改
		const editTablePage = router.getRoutes().find(v => v.name === 'GenEditIndex') as RouteLocationNormalizedLoaded | undefined
		if (editTablePage) {
			tagsViewStore.addView({
				...editTablePage,
				meta: {
					...editTablePage.meta,
					title: '修改[' + row.tableName + ']生成配置'
				},
				path: `/tool/gen-edit/index/${row.tableId}`,
				query: {
					pageNum: '1'
				}
			})
		}
		handleEditTable(row.tableId)
	} else if (btn.event === 'handleDelete') {
		// 删除
		handleDelete(row.tableId)
	} else if (btn.event === 'handleSynchDb') {
		// 同步
		await ElMessageBox.confirm('确认要强制同步"' + row.tableName + '"表结构吗？', {
			cancelButtonText: '取消',
			confirmButtonText: '确定',
			title: '系统提示',
			type: 'warning'
		})
		await synchDb(row.tableName)
		ElMessage({
			message: '同步成功',
			type: 'success'
		})
	} else if (btn.event === 'handleGenTable') {
		// 生成
		handleGenTable(row.tableName)
	}
}

function handleEditTable(id: string) {
	router.push({
		path: `/tool/gen-edit/index/${id}`,
		query: {
			pageNum: 1
		}
	})
}

// 删除
async function handleDelete(ids: string) {
	await ElMessageBox.confirm('是否确认删除表编号为"' + ids + '"的数据项？', {
		cancelButtonText: '取消',
		confirmButtonText: '确定',
		title: '系统提示',
		type: 'warning'
	})
	await delTable(ids)
	ElMessage({
		message: '删除成功',
		type: 'success'
	})

	queryList()
}

// 生成代码
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
			:defaultSort="defaultSort"
			@buttonClick="handleButtonClick"
			@selectionChange="selectionChange"
			@tableEditClick="tableEditClick"
		/>

		<!-- 新增弹窗 -->
		<CreateDialog
			ref="createDialogRef"
			@refresh="queryList"
		/>

		<!-- 导入弹窗 -->
		<ImportDialog
			ref="importDialogRef"
			@refresh="queryList"
		/>

		<!-- 查看弹窗 -->
		<PreviewDialog
			v-model:show="previewDialogShow"
			:previewInfo="previewInfo"
		/>
	</div>
</template>

<style scoped></style>
