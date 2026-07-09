<script setup lang="ts" name="Logininfor">
import dayjs from 'dayjs'

import { getDicts } from '@/api/system/dict'
import { cleanLogininfor, delLogininfor, list, operLogininfor, unlockLogininfor } from '@/api/system/logininfor'
import FormGenerator from '@/components/FormGenerator/index.vue'
import type { FormConfig } from '@/components/FormGenerator/types'
import { downloadBlobFile } from '@/utils'
import { checkPermission } from '@/utils/permission'
import type { Sort } from 'element-plus'

const router = useRouter()
const formGeneratorRef = ref<InstanceType<typeof FormGenerator> | null>(null)
const formData = ref({
	deptId: '',
	isAsc: 'descending',
	orderByColumn: 'loginTime'
})
const defaultSort = {
	order: 'descending',
	prop: 'loginTime'
} as Sort

const selectionList = ref<string[]>([])
const selectionNameList = ref<string[]>([])
const multiple = computed(() => !(selectionList.value.length >= 1))
const single = computed(() => !(selectionList.value.length === 1))

function selectionChange(v) {
	selectionList.value = v.map(item => item.infoId)
	selectionNameList.value = v.map(item => item.userName)
}

const sysCommonStatus = ref<API.IGetDictsRes>([])

const formConfig = ref<FormConfig>({
	api: list,
	fields: [
		{
			label: '登录地址',
			placeholder: '请输入登录地址',
			prop: 'ipaddr',
			type: 'input'
		},
		{
			label: '用户名称',
			placeholder: '请输入用户名称',
			prop: 'userName',
			type: 'input'
		},
		{
			label: '登录状态',
			options: sysCommonStatus as unknown as any[],
			placeholder: '请选择登录状态',
			prop: 'status',
			type: 'select'
		},
		{
			dateType: 'daterange',
			defaultTime: [new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 1, 1, 23, 59, 59)],
			label: '登录时间',
			prop: 'daterange',
			type: 'date-picker',
			valueFormat: 'YYYY-MM-DD HH:mm:ss'
		}
	],
	labelWidth: '80px',
	leftButtons: [
		{
			disabled: multiple as unknown as boolean,
			event: 'handleDelete',
			icon: 'Delete',
			label: '删除',
			plain: true,
			show: checkPermission(['monitor:logininfor:remove']),
			type: 'danger'
		},
		{
			event: 'handleClean',
			icon: 'Delete',
			label: '清空',
			plain: true,
			show: checkPermission(['monitor:logininfor:remove']),
			type: 'danger'
		},
		{
			disabled: single as unknown as boolean,
			event: 'handleUnlock',
			icon: 'Unlock',
			label: '解锁',
			plain: true,
			show: checkPermission(['monitor:logininfor:unlock']),
			type: 'primary'
		},
		{
			event: 'handleExport',
			icon: 'Download',
			label: '导出',
			plain: true,
			show: checkPermission(['monitor:logininfor:export']),
			type: 'warning'
		}
	],
	span: 7,
	tableHeader: [
		{
			label: '访问编号',
			prop: 'infoId',
			showOverflowTooltip: true
		},
		{
			label: '用户名称',
			prop: 'userName',
			showOverflowTooltip: true,
			sortable: 'custom'
		},
		{
			label: '地址',
			prop: 'ipaddr'
		},
		{
			label: '登录地点',
			prop: 'loginLocation',
			showOverflowTooltip: true
		},
		{
			label: '操作系统',
			prop: 'os',
			showOverflowTooltip: true
		},
		{
			label: '浏览器',
			prop: 'browser',
			showOverflowTooltip: true
		},
		{
			label: '登录状态',
			prop: 'status',
			slotName: 'statusSlot'
		},
		{
			label: '描述',
			prop: 'msg',
			showOverflowTooltip: true
		},
		{
			format: v => dayjs(v).format('YYYY-MM-DD hh:mm:ss'),
			label: '访问时间',
			prop: 'loginTime',
			sortable: 'custom',
			width: '160px'
		}
	],
	tableShow: true,
	tableShowSelection: true
})

// 表单按钮
async function handleButtonClick(event: string) {
	if (event === 'handleDelete') {
		// 删除
		const ids = selectionList.value.join(',')
		handleDelete(ids)
	} else if (event === 'handleClean') {
		// 清空
		await ElMessageBox({
			cancelButtonText: '取消',
			confirmButtonText: '确定',
			message: `是否确认清空所有操作日志数据项？`,
			showCancelButton: true,
			title: '提示',
			type: 'warning'
		})
		await cleanLogininfor()
		ElMessage.success('清空成功')
		queryList()
	} else if (event === 'handleUnlock') {
		// 解锁
		const username = selectionNameList.value.join(',')
		await ElMessageBox({
			cancelButtonText: '取消',
			confirmButtonText: '确定',
			message: `是否确认解锁用户${username}数据项?`,
			showCancelButton: true,
			title: '提示',
			type: 'warning'
		})

		await unlockLogininfor(username)
		ElMessage.success(`用户${username}解锁成功`)
	} else if (event === 'handleExport') {
		// 导出
		const pageParams = formGeneratorRef.value?.getPageParams()
		operLogininfor({
			...pageParams,
			...formData.value
		}).then(data => {
			downloadBlobFile(data.data, data.filename ? data.filename : `logininfor_${new Date().getTime()}.xlsx`)
		})
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
	await delLogininfor(ids)
	ElMessage.success('删除成功')
	formGeneratorRef.value?.queryTableData()
}

function queryList() {
	formGeneratorRef.value?.queryTableData()
}

function init() {
	getDicts('sys_common_status').then(data => {
		sysCommonStatus.value = data
	})
}
init()
</script>

<template>
	<div
		id="operlog"
		class="p-3"
	>
		<FormGenerator
			ref="formGeneratorRef"
			v-model="formData"
			:config="formConfig"
			:defaultSort="defaultSort"
			@buttonClick="handleButtonClick"
			@selectionChange="selectionChange"
		>
			<template #statusSlot="{ row }">
				<DictTag
					:options="sysCommonStatus"
					:value="row.status"
				/>
			</template>
		</FormGenerator>
	</div>
</template>
