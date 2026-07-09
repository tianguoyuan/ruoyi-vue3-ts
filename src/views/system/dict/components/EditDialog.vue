<script setup lang="ts">
import { getDicts } from '@/api/system/dict'
import { addType, getType, updateType } from '@/api/system/dictType'
import FormGenerator from '@/components/FormGenerator/index.vue'
import type { FormConfig } from '@/components/FormGenerator/types'

const props = defineProps<{
	visible: boolean
	id?: string
}>()
const emits = defineEmits<{
	'update:visible': [v: boolean]
	refresh: []
}>()

const formGeneratorRef = ref<InstanceType<typeof FormGenerator> | null>(null)

const sysNormalDisable = ref<API.IGetDictsRes>([])

const initFormData = {
	postCode: '',
	postName: '',
	postSort: 0,
	remark: '',
	status: '0'
}
const formData = ref({ ...initFormData })

watch(
	() => props.visible,
	v => {
		if (!v) return
		formData.value = { ...initFormData }
		setTimeout(() => formGeneratorRef.value?.clearValidate())

		if (!props.id) return
		getType(props.id).then(({ data }) => {
			formData.value = data
		})
	}
)
const formConfig = ref<FormConfig>({
	buttons: [],
	fields: [
		{
			label: '字典名称',
			placeholder: '请输入字典名称',
			prop: 'dictName',
			type: 'input'
		},

		{
			label: '字典类型',
			placeholder: '请输入字典类型',
			prop: 'dictType',
			type: 'input'
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
		dictName: [
			{
				message: '请输入字典名称',
				required: true
			}
		],
		dictType: [
			{
				message: '请输入字典类型',
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
	const apiFunc = props.id ? updateType : addType
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
