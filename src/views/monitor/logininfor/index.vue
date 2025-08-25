<script setup lang="ts" name="Logininfor">
import type { FormConfig } from '@/components/FormGenerator/types'
import { checkPermission } from '@/utils/permission'
import FormGenerator from '@/components/FormGenerator/index.vue'
import dayjs from 'dayjs'
import { getDicts } from '@/api/system/dict'
import { downloadBlobFile } from '@/utils'
import { cleanLogininfor, delLogininfor, list, operLogininfor, unlockLogininfor } from '@/api/system/logininfor'
import type { Sort } from 'element-plus'

const router = useRouter()
const formGeneratorRef = ref<InstanceType<typeof FormGenerator> | null>(null)
const formData = ref({
	deptId: '',
	orderByColumn: 'loginTime',
	isAsc: 'descending'
})
const defaultSort = {
	prop: 'loginTime',
	order: 'descending'
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
	labelWidth: '80px',
	span: 7,
	fields: [
		{
			type: 'input',
			label: '登录地址',
			prop: 'ipaddr',
			placeholder: '请输入登录地址'
		},
		{
			type: 'input',
			label: '用户名称',
			prop: 'userName',
			placeholder: '请输入用户名称'
		},
		{
			type: 'select',
			label: '登录状态',
			prop: 'status',
			placeholder: '请选择登录状态',
			options: sysCommonStatus as unknown as any[]
		},
		{
			type: 'date-picker',
			dateType: 'daterange',
			prop: 'daterange',
			label: '登录时间',
			valueFormat: 'YYYY-MM-DD HH:mm:ss',
			defaultTime: [new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 1, 1, 23, 59, 59)]
		}
	],
	leftButtons: [
		{
			label: '删除',
			type: 'danger',
			event: 'handleDelete',
			plain: true,
			icon: 'Delete',
			show: checkPermission(['monitor:logininfor:remove']),
			disabled: multiple as unknown as boolean
		},
		{
			label: '清空',
			type: 'danger',
			event: 'handleClean',
			plain: true,
			icon: 'Delete',
			show: checkPermission(['monitor:logininfor:remove'])
		},
		{
			label: '解锁',
			type: 'primary',
			event: 'handleUnlock',
			plain: true,
			icon: 'Unlock',
			show: checkPermission(['monitor:logininfor:unlock']),
			disabled: single as unknown as boolean
		},
		{
			label: '导出',
			type: 'warning',
			event: 'handleExport',
			plain: true,
			icon: 'Download',
			show: checkPermission(['monitor:logininfor:export'])
		}
	],
	tableShow: true,
	api: list,
	tableShowSelection: true,
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
			label: '访问时间',
			prop: 'loginTime',
			sortable: 'custom',
			format: v => dayjs(v).format('YYYY-MM-DD hh:mm:ss'),
			width: '160px'
		}
	]
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
			title: '提示',
			type: 'warning',
			message: `是否确认清空所有操作日志数据项？`,
			showCancelButton: true,
			cancelButtonText: '取消',
			confirmButtonText: '确定'
		})
		await cleanLogininfor()
		ElMessage.success('清空成功')
		queryList()
	} else if (event === 'handleUnlock') {
		// 解锁
		const username = selectionNameList.value.join(',')
		await ElMessageBox({
			title: '提示',
			type: 'warning',
			message: `是否确认解锁用户${username}数据项?`,
			showCancelButton: true,
			cancelButtonText: '取消',
			confirmButtonText: '确定'
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
		title: '提示',
		type: 'warning',
		message: `是否确认删除用户编号为"${ids}"的数据项？`,
		showCancelButton: true,
		cancelButtonText: '取消',
		confirmButtonText: '确定'
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
			:default-sort="defaultSort"
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
