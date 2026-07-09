<script setup lang="ts">
import { getConfig, addConfig, updateConfig } from '@/api/system/config'
import { getDicts } from '@/api/system/dict'
import FormGenerator from '@/components/FormGenerator/index.vue'
import type { FormConfig } from '@/components/FormGenerator/types'

const props = defineProps<{
	visible: boolean
	id?: string
	sysYesNo: API.IGetDictsRes
}>()
const emits = defineEmits<{
	'update:visible': [v: boolean]
	refresh: []
}>()

const sysYesNo = computed(() => props.sysYesNo)
const formGeneratorRef = ref<InstanceType<typeof FormGenerator> | null>(null)

const initFormData = {
	configKey: undefined,
	configName: undefined,
	configType: 'Y',
	configValue: undefined,
	remark: ''
}
const formData = ref({ ...initFormData })

watch(
	() => props.visible,
	v => {
		if (!v) return
		formData.value = { ...initFormData }
		setTimeout(() => formGeneratorRef.value?.clearValidate())

		if (!props.id) return
		getConfig(props.id).then(({ data }) => {
			formData.value = data
		})
	}
)

const formConfig = ref<FormConfig>({
	buttons: [],
	fields: [
		{
			label: '参数名称',
			placeholder: '请输入参数名称',
			prop: 'configName',
			type: 'input'
		},

		{
			label: '参数键名',
			placeholder: '请输入参数键名',
			prop: 'configKey',
			type: 'input'
		},
		{
			label: '参数键值',
			placeholder: '请输入参数键值',
			prop: 'configValue',
			type: 'input'
		},
		{
			label: '系统内置',
			options: sysYesNo as unknown as any[],
			prop: 'configType',
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
		configKey: [
			{
				message: '参数键名不能为空',
				required: true
			}
		],
		configName: [
			{
				message: '参数名称不能为空',
				required: true
			}
		],
		configValue: [
			{
				message: '参数键值不能为空',
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
	const apiFunc = props.id ? updateConfig : addConfig
	await apiFunc(formData.value)
	const message = props.id ? '修改成功' : '新增成功'
	ElMessage.success(message)
	emits('update:visible', false)
	emits('refresh')
}
</script>

<template>
	<ElDialog
		:closeOnClickModal="false"
		:modelValue="props.visible"
		:title="id ? '修改参数' : '添加参数'"
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
