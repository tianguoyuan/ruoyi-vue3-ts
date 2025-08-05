<script setup lang="ts" name="Online">
import { forceLogout, getOnlineList } from '@/api/monitor/online'
import type { FormConfig } from '@/components/FormGenerator/types'
import { checkPermission } from '@/utils/permission'
import dayjs from 'dayjs'
import { ElMessage } from 'element-plus'
import FormGenerator from '@/components/FormGenerator/index.vue'

const formData = ref({})
const formGeneratorRef = ref<InstanceType<typeof FormGenerator> | null>(null)
const formConfig = ref<FormConfig>({
	labelWidth: '80px',
	span: 6,
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
		}
	],

	tableShow: true,
	api: getOnlineList,
	tableShowIndex: true,
	tableHeader: [
		{
			label: '会话编号',
			prop: 'tokenId',
			showOverflowTooltip: true
		},
		{
			label: '登录名称',
			prop: 'userName',
			showOverflowTooltip: true
		},
		{
			label: '所属部门',
			prop: 'deptName',
			showOverflowTooltip: true
		},
		{
			label: '主机',
			prop: 'ipaddr',
			showOverflowTooltip: true
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
			label: '登录时间',
			prop: 'loginTime',
			format: val => dayjs(val).format('YYYY-MM-DD hh:mm:ss'),
			showOverflowTooltip: true
		},
		{
			custom: true,
			prop: '',
			label: '操作',
			tableEditBtn: [
				{
					link: true,
					type: 'primary',
					icon: 'Delete',
					label: '强退',
					event: 'forceOut',
					show: checkPermission(['monitor:online:forceLogout'])
				}
			]
		}
	]
})

function handleTableEditClick(row, btn) {
	if (btn.event === 'forceOut') {
		ElMessageBox({
			title: '提示',
			message: `是否确认强退名称为"${row.userName}"的用户?`,
			type: 'warning',
			showCancelButton: true,
			cancelButtonText: '取消',
			confirmButtonText: '确定'
		}).then(() => {
			forceLogout(row.tokenId).then(res => {
				ElMessage.success(res.msg)
				formGeneratorRef.value?.queryTableData()
			})
		})
	}
}
</script>

<template>
	<div class="p-3">
		<FormGenerator
			ref="formGeneratorRef"
			v-model="formData"
			:config="formConfig"
			@tableEditClick="handleTableEditClick"
		/>
	</div>
</template>

<style scoped></style>
