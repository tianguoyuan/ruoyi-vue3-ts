<script lang="ts" setup name="Demo">
import { ref } from 'vue'

import { demoList } from '@/api'
import FormGenerator from '@/components/FormGenerator/index.vue'
import type { FormConfig } from '@/components/FormGenerator/types'

const formData = ref<Record<string, any>>({})

const formConfig = ref<FormConfig>({
	api: demoList,
	buttons: [
		{
			event: 'search',
			label: '搜索',
			type: 'primary'
		},
		{
			event: 'reset',
			label: '重置',
			type: 'danger'
		}
	],
	fields: [
		{
			label: '用户名',
			placeholder: '请输入用户名',
			prop: 'username',
			rules: [
				{
					message: '用户名不能为空',
					required: true,
					trigger: 'change'
				},
				{
					max: 10,
					message: '长度在 3 到 10 个字符',
					min: 3,
					trigger: 'change'
				}
			],
			type: 'input'
		},
		{
			label: '城市',
			options: [
				{
					label: '北京',
					value: 'beijing'
				},
				{
					label: '上海',
					value: 'shanghai'
				},
				{
					label: '广州',
					value: 'guangzhou'
				}
			],
			prop: 'city4',
			type: 'select'
		},
		{
			label: '城市',
			options: [
				{
					label: '北京',
					value: 'beijing'
				},
				{
					label: '上海',
					value: 'shanghai'
				},
				{
					label: '广州',
					value: 'guangzhou'
				}
			],
			prop: 'city3',
			type: 'select'
		},
		{
			label: '城市',
			options: [
				{
					label: '北京',
					value: 'beijing'
				},
				{
					label: '上海',
					value: 'shanghai'
				},
				{
					label: '广州',
					value: 'guangzhou'
				}
			],
			prop: 'city2',
			type: 'select'
		},
		{
			label: '城市',
			options: [
				{
					label: '北京',
					value: 'beijing'
				},
				{
					label: '上海',
					value: 'shanghai'
				},
				{
					label: '广州',
					value: 'guangzhou'
				}
			],
			prop: 'city1',
			type: 'select'
		}
	],
	labelWidth: '80px',

	span: 6,
	tableHeader: [
		{
			label: 'a1',
			prop: 'date'
		},
		{
			label: 'a2',
			prop: 'name'
		},
		{
			label: 'a3',
			prop: 'address'
		},
		{
			custom: true,
			label: '操作',
			prop: '',
			tableEditBtn: [
				{
					event: 'edit',
					label: '编辑',
					type: 'primary'
				}
			]
		}
	],
	tableInitQueryRefuse: true,
	tableShow: true,
	tableShowIndex: true,
	tableShowSelection: true
})

const formGeneratorRef = ref<InstanceType<typeof FormGenerator> | null>(null)
async function handleButtonClick(event: string, data: any) {
	if (event === 'search') {
		await formGeneratorRef.value?.validate()
		formGeneratorRef.value?.queryTableData()
	} else if (event === 'reset') {
		console.log(' 重置表单')
		formGeneratorRef.value?.resetFields()
	}
}

function tableEditClick(row, conf) {
	console.log('row,conf', row, conf)
}
function selectionChange(selectList) {
	console.log('selectList', selectList)
}
</script>

<template>
	<div class="p-5">
		<FormGenerator
			ref="formGeneratorRef"
			v-model="formData"
			:config="formConfig"
			@buttonClick="handleButtonClick"
			@selectionChange="selectionChange"
			@tableEditClick="tableEditClick"
		/>
	</div>
</template>
