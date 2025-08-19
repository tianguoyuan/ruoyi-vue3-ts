<script setup lang="ts">
import { getDicts } from '@/api/system/dict'
import type { FormConfig } from '@/components/FormGenerator/types'
import FormGenerator from '@/components/FormGenerator/index.vue'
import { addPost, getPost, updatePost } from '@/api/system/post'

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
		getPost(props.id).then(({ data }) => {
			formData.value = data
		})
	}
)
const formConfig = ref<FormConfig>({
	labelWidth: '80px',
	span: 24,
	formRules: {
		postName: [
			{
				required: true,
				message: '请输入岗位名称'
			}
		],
		postCode: [
			{
				required: true,
				message: '请输入岗位编码'
			}
		],
		postSort: [
			{
				required: true,
				message: '请输入岗位顺序'
			}
		]
	},
	fields: [
		{
			type: 'input',
			label: '岗位名称',
			prop: 'postName',
			placeholder: '请输入岗位名称'
		},

		{
			type: 'input',
			label: '岗位编码',
			prop: 'postCode',
			placeholder: '请输入岗位编码'
		},
		{
			type: 'input-number',
			label: '岗位顺序',
			prop: 'postSort',
			min: 0,
			placeholder: '请输入岗位顺序'
		},
		{
			type: 'radio',
			label: '岗位状态',
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
		:model-value="props.visible"
		:title="id ? '修改岗位' : '添加岗位'"
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
