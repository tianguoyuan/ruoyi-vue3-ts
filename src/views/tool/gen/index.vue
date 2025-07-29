<script setup lang="ts" name="GenEditIndex">
import { delTable, genBatchGenCode, getGenList, previewTable, synchDb } from '@/api/tool/gen'
import FormGenerator from '@/components/FormGenerator/index.vue'
import type { FormConfig } from '@/components/FormGenerator/types'
import { downloadBlobFile } from '@/utils'
import { checkPermission } from '@/utils/permission'
import { ElMessage, type Sort } from 'element-plus'
import CreateDialog from './components/CreateDialog.vue'
import ImportDialog from './components/ImportDialog.vue'
import PreviewDialog from './components/PreviewDialog.vue'
import { useTagsViewStore } from '@/store/tagsView'
import type { RouteLocationNormalizedLoaded } from 'vue-router'

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
	orderByColumn: 'createTime',
	isAsc: 'ascending'
})
const defaultSort = {
	prop: 'createTime',
	order: 'ascending'
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
			event: 'search',
			icon: 'Search'
		},
		{
			label: '重置',
			event: 'reset',
			icon: 'Refresh'
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
					tip: '修改',
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
		// 查询
		const isPass = await formGeneratorRef.value?.validate()
		if (!isPass) return
		pageChange()
	} else if (event === 'reset') {
		// 重置表单
		formGeneratorRef.value?.resetFields()
		formGeneratorRef.value?.resetPage()
		pageChange()
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

		console.log('editTablePage', editTablePage)

		if (editTablePage) {
			tagsViewStore.addView({
				...editTablePage,
				path: `/tool/gen-edit/index/${row.tableId}`,
				meta: {
					...editTablePage.meta,
					title: '修改[' + row.tableName + ']生成配置'
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
			title: '系统提示',
			type: 'warning',
			confirmButtonText: '确定',
			cancelButtonText: '取消'
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
		title: '系统提示',
		type: 'warning',
		confirmButtonText: '确定',
		cancelButtonText: '取消'
	})
	await delTable(ids)
	ElMessage({
		message: '删除成功',
		type: 'success'
	})

	pageChange()
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
			:default-sort="defaultSort"
			@buttonClick="handleButtonClick"
			@tableEditClick="tableEditClick"
			@customPageChange="pageChange"
			@selectionChange="selectionChange"
		/>

		<!-- 新增弹窗 -->
		<CreateDialog
			ref="createDialogRef"
			@refresh="pageChange"
		/>

		<!-- 导入弹窗 -->
		<ImportDialog
			ref="importDialogRef"
			@refresh="pageChange"
		/>

		<!-- 查看弹窗 -->
		<PreviewDialog
			v-model:show="previewDialogShow"
			:preview-info="previewInfo"
		/>
	</div>
</template>

<style scoped></style>
