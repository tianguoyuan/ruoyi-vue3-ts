<script setup lang="ts">
import { getDicts } from '@/api/system/dict'
import type { FormConfig } from '@/components/FormGenerator/types'
import FormGenerator from '@/components/FormGenerator/index.vue'
import { addType, getType, updateType } from '@/api/system/dictType'

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
	postName: '',
	postCode: '',
	postSort: 0,
	status: '0',
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
		getType(props.id).then(({ data }) => {
			formData.value = data
		})
	}
)
const formConfig = ref<FormConfig>({
	labelWidth: '80px',
	span: 24,
	formRules: {
		dictName: [
			{
				required: true,
				message: '请输入字典名称'
			}
		],
		dictType: [
			{
				required: true,
				message: '请输入字典类型'
			}
		]
	},
	fields: [
		{
			type: 'input',
			label: '字典名称',
			prop: 'dictName',
			placeholder: '请输入字典名称'
		},

		{
			type: 'input',
			label: '字典类型',
			prop: 'dictType',
			placeholder: '请输入字典类型'
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
