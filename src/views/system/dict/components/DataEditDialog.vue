<script setup lang="ts">
import { getDicts } from '@/api/system/dict'
import type { FormConfig } from '@/components/FormGenerator/types'
import FormGenerator from '@/components/FormGenerator/index.vue'
import { getData, addData, updateData } from '@/api/system/dictData'
const props = defineProps<{
	visible: boolean
	dictType: string
	id?: string
}>()
const emits = defineEmits<{
	'update:visible': [v: boolean]
	refresh: []
}>()

const formGeneratorRef = ref<InstanceType<typeof FormGenerator> | null>(null)

const sysNormalDisable = ref<API.IGetDictsRes>([])
const listClassOptions = ref([
	{
		value: 'default',
		label: '默认(default)'
	},
	{
		value: 'primary',
		label: '主要(primary)'
	},
	{
		value: 'success',
		label: '成功(success)'
	},
	{
		value: 'info',
		label: '信息(info)'
	},
	{
		value: 'warning',
		label: '警告(warning)'
	},
	{
		value: 'danger',
		label: '危险(danger)'
	}
])

const initFormData = {
	dictType: '',
	dictSort: 0,
	status: '0',
	remark: '',
	listClass: 'default'
}
const formData = ref({ ...initFormData })

watch(
	() => props.visible,
	v => {
		if (!v) return
		formData.value = {
			...initFormData,
			dictType: props.dictType
		}
		setTimeout(() => formGeneratorRef.value?.clearValidate())

		if (!props.id) return
		getData(props.id).then(({ data }) => {
			formData.value = data
		})
	}
)
const formConfig = ref<FormConfig>({
	labelWidth: '80px',
	span: 24,
	formRules: {
		dictLabel: [
			{
				required: true,
				message: '请输入数据标签'
			}
		],
		dictValue: [
			{
				required: true,
				message: '请输入数据键值'
			}
		],
		dictSort: [
			{
				required: true,
				message: '请输入显示排序'
			}
		]
	},
	fields: [
		{
			type: 'input',
			label: '字典类型',
			prop: 'dictType',
			disabled: true,
			placeholder: '请输入字典类型'
		},

		{
			type: 'input',
			label: '数据标签',
			prop: 'dictLabel',
			placeholder: '请输入数据标签'
		},
		{
			type: 'input',
			label: '数据键值',
			prop: 'dictValue',
			placeholder: '请输入数据键值'
		},
		{
			type: 'input',
			label: '样式属性',
			prop: 'cssClass',
			placeholder: '请输入样式属性'
		},
		{
			type: 'input-number',
			label: '显示排序',
			min: 0,
			prop: 'dictSort',
			placeholder: '请输入显示排序'
		},
		{
			type: 'select',
			label: '回显样式',
			prop: 'listClass',
			placeholder: '请选择回显样式',
			options: listClassOptions as unknown as any[]
		},
		{
			type: 'radio',
			label: '状态',
			prop: 'status',
			options: sysNormalDisable as unknown as any[]
		},
		{
			type: 'textarea',
			rows: 3,
			label: '备注',
			prop: 'remark',
			placeholder: '请输入备注'
		}
	],
	buttons: [],
	tableShow: false,
	tableInitQueryRefuse: true
})

async function submit() {
	await formGeneratorRef.value?.validate()
	const apiFunc = props.id ? updateData : addData
	await apiFunc(formData.value)
	const message = props.id ? '修改成功' : '新增成功'
	ElMessage.success(message)
	emits('update:visible', false)
	emits('refresh')
}

function init() {
	getDicts('sys_normal_disable').then(data => {
		sysNormalDisable.value = data
	})
}
init()
</script>

<template>
	<ElDialog
		:model-value="props.visible"
		:title="id ? '修改字典类型' : '添加字典类型'"
		:close-on-click-modal="false"
		width="500px"
		@update:modelValue="v => emits('update:visible', v)"
	>
		<FormGenerator
			ref="formGeneratorRef"
			v-model="formData"
			:config="formConfig"
		/>
		<template #footer>
			<el-button @click="emits('update:visible', false)">取消</el-button>
			<el-button
				type="primary"
				@click="submit"
			>
				确定
			</el-button>
		</template>
	</ElDialog>
</template>

<style scoped></style>
