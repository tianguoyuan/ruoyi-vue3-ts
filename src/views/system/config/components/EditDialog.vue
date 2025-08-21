<script setup lang="ts">
import { getDicts } from '@/api/system/dict'
import type { FormConfig } from '@/components/FormGenerator/types'
import FormGenerator from '@/components/FormGenerator/index.vue'
import { getConfig, addConfig, updateConfig } from '@/api/system/config'

const props = defineProps<{
	visible: boolean
	id?: string
}>()
const emits = defineEmits<{
	'update:visible': [v: boolean]
	refresh: []
}>()

const formGeneratorRef = ref<InstanceType<typeof FormGenerator> | null>(null)

const sysYesNo = ref<API.IGetDictsRes>([])

const initFormData = {
	configName: undefined,
	configKey: undefined,
	configValue: undefined,
	configType: 'Y',
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
	labelWidth: '80px',
	span: 24,
	formRules: {
		configName: [
			{
				required: true,
				message: '参数名称不能为空'
			}
		],
		configKey: [
			{
				required: true,
				message: '参数键名不能为空'
			}
		],
		configValue: [
			{
				required: true,
				message: '参数键值不能为空'
			}
		]
	},
	fields: [
		{
			type: 'input',
			label: '参数名称',
			prop: 'configName',
			placeholder: '请输入参数名称'
		},

		{
			type: 'input',
			label: '参数键名',
			prop: 'configKey',
			placeholder: '请输入参数键名'
		},
		{
			type: 'input',
			label: '参数键值',
			prop: 'configValue',
			placeholder: '请输入参数键值'
		},
		{
			type: 'radio',
			label: '系统内置',
			prop: 'configType',
			options: sysYesNo as unknown as any[]
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
	const apiFunc = props.id ? updateConfig : addConfig
	await apiFunc(formData.value)
	const message = props.id ? '修改成功' : '新增成功'
	ElMessage.success(message)
	emits('update:visible', false)
	emits('refresh')
}

function init() {
	getDicts('sys_yes_no').then(data => {
		sysYesNo.value = data
	})
}
init()
</script>

<template>
	<ElDialog
		:model-value="props.visible"
		:title="id ? '修改参数' : '添加参数'"
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
