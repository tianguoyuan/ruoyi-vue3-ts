<script setup lang="ts">
import FormGenerator from '@/components/FormGenerator/index.vue'
import type { FormConfig } from '@/components/FormGenerator/types'

const props = defineProps<{
	info: API.IGetGenTableRes['data']['info']
}>()

const formGeneratorRef = ref<InstanceType<typeof FormGenerator> | null>(null)
const formData = ref<API.IGetGenTableRes['data']['info']>({
	className: '',
	functionAuthor: '',
	remark: '',
	tableComment: '',
	tableName: ''
})

watch(
	() => props.info,
	value => {
		Object.keys(formData.value).forEach(key => {
			if (Object.prototype.hasOwnProperty.call(value, key)) {
				formData.value[key] = value[key]
			}
		})
	},
	{ immediate: true }
)

const formConfig = ref<FormConfig>({
	fields: [
		{
			label: '表名称',
			placeholder: '请输入表名称',
			prop: 'tableName',
			span: 12,
			type: 'input'
		},
		{
			label: '表描述',
			placeholder: '请输入表描述',
			prop: 'tableComment',
			span: 12,
			type: 'input'
		},
		{
			label: '实体类名称',
			placeholder: '请输入实体类名称',
			prop: 'className',
			span: 12,
			type: 'input'
		},
		{
			label: '作者',
			placeholder: '请输入作者',
			prop: 'functionAuthor',
			span: 12,
			type: 'input'
		},
		{
			label: '备注',
			placeholder: '请输入备注',
			prop: 'remark',
			rows: 4,
			span: 24,
			type: 'textarea'
		}
	],
	formRules: {
		className: [
			{
				message: '请输入表描述',
				required: true,
				trigger: 'blur'
			}
		],
		functionAuthor: [
			{
				message: '请输入作者',
				required: true,
				trigger: 'blur'
			}
		],
		tableComment: [
			{
				message: '请输入实体类名称',
				required: true,
				trigger: 'blur'
			}
		],
		tableName: [
			{
				message: '请输入表名称',
				required: true,
				trigger: 'blur'
			}
		]
		// remark: [
		// 	{
		// 		required: true,
		// 		message: '请输入备注',
		// 		trigger: 'blur'
		// 	}
		// ]
	},
	hideDefaultButton: true,
	labelWidth: '150px',
	span: 6,
	tableInitQueryRefuse: true,
	tableShow: false
})

function validate() {
	return formGeneratorRef.value?.validate()
}

function getData() {
	return formData.value
}

defineExpose({
	getData,
	validate
})
</script>

<template>
	<FormGenerator
		ref="formGeneratorRef"
		v-model="formData"
		:config="formConfig"
	/>
</template>

<style scoped lang="scss">
:deep(.formButtons) {
	justify-content: center;
}
</style>
