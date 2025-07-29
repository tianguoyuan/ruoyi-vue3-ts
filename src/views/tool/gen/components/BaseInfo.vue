<script setup lang="ts">
import type { FormConfig } from '@/components/FormGenerator/types'
import FormGenerator from '@/components/FormGenerator/index.vue'
import { useUserStore } from '@/store/user'

const props = defineProps<{
	info: API.IGetGenTableRes['data']['info']
}>()

const router = useRouter()

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
		formGeneratorRef.value?.setFormData(value)
	},
	{ immediate: true }
)

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
				message: '请输入表名称',
				trigger: 'blur'
			}
		],
		tableComment: [
			{
				required: true,
				message: '请输入实体类名称',
				trigger: 'blur'
			}
		],
		className: [
			{
				required: true,
				message: '请输入表描述',
				trigger: 'blur'
			}
		],
		functionAuthor: [
			{
				required: true,
				message: '请输入作者',
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
	tableShow: false,
	tableInitQueryRefuse: true,
	hideDefaultButton: true
})

function validate() {
	return formGeneratorRef.value?.validate()
}

function getData() {
	return formData.value
}

defineExpose({
	validate,
	getData
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
