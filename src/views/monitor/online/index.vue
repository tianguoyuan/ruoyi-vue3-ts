<script setup lang="ts" name="Online">
import dayjs from 'dayjs'
import { ElMessage } from 'element-plus'

import { forceLogout, getOnlineList } from '@/api/monitor/online'
import FormGenerator from '@/components/FormGenerator/index.vue'
import type { FormConfig } from '@/components/FormGenerator/types'
import { checkPermission } from '@/utils/permission'

const formData = ref({})
const formGeneratorRef = ref<InstanceType<typeof FormGenerator> | null>(null)
const formConfig = ref<FormConfig>({
	api: getOnlineList,
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
		}
	],
	labelWidth: '80px',

	span: 6,
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
			format: val => dayjs(val).format('YYYY-MM-DD hh:mm:ss'),
			label: '登录时间',
			prop: 'loginTime',
			showOverflowTooltip: true
		},
		{
			custom: true,
			label: '操作',
			prop: '',
			tableEditBtn: [
				{
					event: 'forceOut',
					icon: 'Delete',
					label: '强退',
					link: true,
					show: checkPermission(['monitor:online:forceLogout']),
					type: 'primary'
				}
			]
		}
	],
	tableShow: true,
	tableShowIndex: true
})

function handleTableEditClick(row, btn) {
	if (btn.event === 'forceOut') {
		ElMessageBox({
			cancelButtonText: '取消',
			confirmButtonText: '确定',
			message: `是否确认强退名称为"${row.userName}"的用户?`,
			showCancelButton: true,
			title: '提示',
			type: 'warning'
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
