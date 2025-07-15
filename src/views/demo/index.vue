<script lang="ts" setup>
import { ref } from 'vue'
import FormGenerator from '@/components/FormGenerator/index.vue'
import type { FormConfig } from '@/components/FormGenerator/types'
import { demoList } from '@/api'

const formData = ref<Record<string, any>>({})

const formConfig = ref<FormConfig>({
	labelWidth: '80px',
	span: 6,
	fields: [
		{
			type: 'input',
			label: '用户名',
			prop: 'username',
			placeholder: '请输入用户名',
			rules: [
				{ required: true, message: '用户名不能为空', trigger: 'change' },
				{ min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'change' }
			]
		},
		{
			type: 'select',
			label: '城市',
			prop: 'city5',
			options: [
				{ label: '北京', value: 'beijing' },
				{ label: '上海', value: 'shanghai' },
				{ label: '广州', value: 'guangzhou' }
			]
		},
		{
			type: 'select',
			label: '城市',
			prop: 'city4',
			options: [
				{ label: '北京', value: 'beijing' },
				{ label: '上海', value: 'shanghai' },
				{ label: '广州', value: 'guangzhou' }
			]
		},
		{
			type: 'select',
			label: '城市',
			prop: 'city3',
			options: [
				{ label: '北京', value: 'beijing' },
				{ label: '上海', value: 'shanghai' },
				{ label: '广州', value: 'guangzhou' }
			]
		},
		{
			type: 'select',
			label: '城市',
			prop: 'city2',
			options: [
				{ label: '北京', value: 'beijing' },
				{ label: '上海', value: 'shanghai' },
				{ label: '广州', value: 'guangzhou' }
			]
		},
		{
			type: 'editor',
			label: '城市',
			prop: 'city1'
		}
	],
	buttons: [
		{ label: '搜索', type: 'primary', event: 'search' },
		{ label: '重置', type: 'danger', event: 'reset' }
	],

	tableShow: true,
	api: demoList,
	tableInitQueryRefuse: true,
	tableShowSelection: true,
	tableShowIndex: true,
	tableHeader: [
		{ label: 'a1', prop: 'date' },
		{ label: 'a2', prop: 'name' },
		{ label: 'a3', prop: 'address' },
		{ label: '操作', custom: true, tableEditBtn: [{ label: '编辑', type: 'primary' }] }
	]
})

const formGeneratorRef = ref<InstanceType<typeof FormGenerator> | null>(null)
const handleButtonClick = async (event: string, data: any) => {
	if (event === 'search') {
		const isPass = await formGeneratorRef.value?.validate()
		if (!isPass) return
		formGeneratorRef.value?.queryTableData()
	} else if (event === 'reset') {
		console.log(' 重置表单')
		formGeneratorRef.value?.resetFields()
	}
}

const tableEditClick = (row, conf) => {
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
			@tableEditClick="tableEditClick"
			@selectionChange="selectionChange"
		/>
	</div>
</template>
