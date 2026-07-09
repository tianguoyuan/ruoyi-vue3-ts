<script setup lang="ts">
import { getDicts } from '@/api/system/dict'
import { getData, addData, updateData } from '@/api/system/dictData'
import FormGenerator from '@/components/FormGenerator/index.vue'
import type { FormConfig } from '@/components/FormGenerator/types'

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
		label: '默认(default)',
		value: 'default'
	},
	{
		label: '主要(primary)',
		value: 'primary'
	},
	{
		label: '成功(success)',
		value: 'success'
	},
	{
		label: '信息(info)',
		value: 'info'
	},
	{
		label: '警告(warning)',
		value: 'warning'
	},
	{
		label: '危险(danger)',
		value: 'danger'
	}
])

const initFormData = {
	dictSort: 0,
	dictType: '',
	listClass: 'default',
	remark: '',
	status: '0'
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
	buttons: [],
	fields: [
		{
			disabled: true,
			label: '字典类型',
			placeholder: '请输入字典类型',
			prop: 'dictType',
			type: 'input'
		},

		{
			label: '数据标签',
			placeholder: '请输入数据标签',
			prop: 'dictLabel',
			type: 'input'
		},
		{
			label: '数据键值',
			placeholder: '请输入数据键值',
			prop: 'dictValue',
			type: 'input'
		},
		{
			label: '样式属性',
			placeholder: '请输入样式属性',
			prop: 'cssClass',
			type: 'input'
		},
		{
			label: '显示排序',
			min: 0,
			placeholder: '请输入显示排序',
			prop: 'dictSort',
			type: 'input-number'
		},
		{
			label: '回显样式',
			options: listClassOptions as unknown as any[],
			placeholder: '请选择回显样式',
			prop: 'listClass',
			type: 'select'
		},
		{
			label: '状态',
			options: sysNormalDisable as unknown as any[],
			prop: 'status',
			type: 'radio'
		},
		{
			label: '备注',
			placeholder: '请输入备注',
			prop: 'remark',
			rows: 3,
			type: 'textarea'
		}
	],
	formRules: {
		dictLabel: [
			{
				message: '请输入数据标签',
				required: true
			}
		],
		dictSort: [
			{
				message: '请输入显示排序',
				required: true
			}
		],
		dictValue: [
			{
				message: '请输入数据键值',
				required: true
			}
		]
	},
	labelWidth: '80px',
	span: 24,
	tableInitQueryRefuse: true,
	tableShow: false
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
		:closeOnClickModal="false"
		:modelValue="props.visible"
		:title="id ? '修改字典类型' : '添加字典类型'"
		width="500px"
		@update:modelValue="v => emits('update:visible', v)"
	>
		<FormGenerator
			ref="formGeneratorRef"
			v-model="formData"
			:config="formConfig"
		/>
		<template #footer>
			<ElButton @click="emits('update:visible', false)">取消</ElButton>
			<ElButton
				type="primary"
				@click="submit"
			>
				确定
			</ElButton>
		</template>
	</ElDialog>
</template>

<style scoped></style>
