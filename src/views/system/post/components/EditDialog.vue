<script setup lang="ts">
import { getDicts } from '@/api/system/dict'
import { addPost, getPost, updatePost } from '@/api/system/post'
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
		getPost(props.id).then(({ data }) => {
			formData.value = data
		})
	}
)
const formConfig = ref<FormConfig>({
	buttons: [],
	fields: [
		{
			label: '岗位名称',
			placeholder: '请输入岗位名称',
			prop: 'postName',
			type: 'input'
		},

		{
			label: '岗位编码',
			placeholder: '请输入岗位编码',
			prop: 'postCode',
			type: 'input'
		},
		{
			label: '岗位顺序',
			min: 0,
			placeholder: '请输入岗位顺序',
			prop: 'postSort',
			type: 'input-number'
		},
		{
			label: '岗位状态',
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
		postCode: [
			{
				message: '请输入岗位编码',
				required: true
			}
		],
		postName: [
			{
				message: '请输入岗位名称',
				required: true
			}
		],
		postSort: [
			{
				message: '请输入岗位顺序',
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
	const apiFunc = props.id ? updatePost : addPost
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
		:title="id ? '修改岗位' : '添加岗位'"
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
