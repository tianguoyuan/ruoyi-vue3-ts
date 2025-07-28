<script setup lang="ts">
import type { FormConfig } from '@/components/FormGenerator/types'
import FormGenerator from '@/components/FormGenerator/index.vue'
import { useUserStore } from '@/store/user'

const router = useRouter()
const userStore = useUserStore()

const formGeneratorRef = ref<InstanceType<typeof FormGenerator> | null>(null)
const formData = ref({})
const formConfig = ref<FormConfig>({
	labelWidth: '150px',
	span: 6,
	fields: [
		{
			type: 'input',
			label: '表名称',
			prop: 'tableName',
			placeholder: '请输入表名称',
			span: 12
		},
		{
			type: 'input',
			label: '表描述',
			prop: 'tableComment',
			placeholder: '请输入表描述',
			span: 12
		},
		{
			type: 'input',
			label: '实体类名称',
			prop: 'className',
			placeholder: '请输入实体类名称',
			span: 12
		},
		{
			type: 'input',
			label: '作者',
			prop: 'functionAuthor',
			placeholder: '请输入作者',
			span: 12
		},
		{
			type: 'textarea',
			label: '备注',
			prop: 'remark',
			placeholder: '请输入备注',
			span: 24,
			rows: 4
		}
	],
	formRules: {
		tableName: [
			{
				required: true,
				message: '请输入表名称'
			}
		],
		tableComment: [
			{
				required: true,
				message: '请输入实体类名称'
			}
		],
		className: [
			{
				required: true,
				message: '请输入表描述'
			}
		],
		functionAuthor: [
			{
				required: true,
				message: '请输入作者'
			}
		],
		remark: [
			{
				required: true,
				message: '请输入备注'
			}
		]
	},

	buttons: [
		{
			label: '提交',
			type: 'primary',
			event: 'submit'
		},
		{
			label: '返回',
			event: 'back'
		}
	],
	tableShow: false,
	tableInitQueryRefuse: true
})

async function handleButtonClick(event: string) {
	if (event === 'submit') {
		await formGeneratorRef.value?.validate()
		console.log('formData', formData.value)
	} else if (event === 'back') {
		router.back()
	}
}
</script>

<template>
	<FormGenerator
		ref="formGeneratorRef"
		v-model="formData"
		:config="formConfig"
		@buttonClick="handleButtonClick"
	/>
</template>

<style scoped lang="scss">
:deep(.formButtons) {
	justify-content: center;
}
</style>
