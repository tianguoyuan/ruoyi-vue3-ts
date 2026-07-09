<script setup lang="ts">
import { addDept, getDept, updateDept } from '@/api/system/dept'
import { getDicts } from '@/api/system/dict'
import FormGenerator from '@/components/FormGenerator/index.vue'
import type { FormConfig } from '@/components/FormGenerator/types'

const props = defineProps<{
	visible: boolean
	flag: 'add' | 'edit'
	parentId: string
	deptId: string
	options: any[]
}>()
const emits = defineEmits<{
	'update:visible': [v: boolean]
	refresh: []
}>()

const formGeneratorRef = ref<InstanceType<typeof FormGenerator> | null>(null)
console.log('props.options', props.options)

const initFormData = {
	orderNum: 0,
	parentId: ''
}
const formData = ref({ ...initFormData })
watch(
	() => props.visible,
	async () => {
		if (!props.visible) return

		await nextTick()
		formData.value = { ...initFormData }

		setTimeout(() => {
			formGeneratorRef.value?.clearValidate()
		})
		if (props.flag === 'edit' && props.deptId) {
			getDept(props.deptId).then(({ data }) => {
				formData.value = data
			})
		}
	}
)

const parentIdTop = computed(() => props.flag === 'edit' && formData.value.parentId !== '0')

const deptIdOptions = computed(() => props.options)

const sysNormalDisable = ref<API.IGetDictsRes>([])

const formConfig = ref<FormConfig>({
	buttons: [],
	fields: [
		{
			hidden: parentIdTop as unknown as boolean,
			label: '上级部门',
			options: deptIdOptions as unknown as any[],
			placeholder: '请选择上级部门',
			prop: 'parentId',
			props: {
				checkStrictly: true,
				emitPath: false,
				label: 'deptName',
				value: 'deptId'
			},
			showAllLevels: false,
			span: 24,
			type: 'cascader'
		},
		{
			label: '部门名称',
			placeholder: '请输入部门名称',
			prop: 'deptName',
			span: 12,
			type: 'input'
		},
		{
			controlsPosition: 'right',
			label: '显示排序',
			min: 0,
			prop: 'orderNum',
			span: 12,
			type: 'input-number'
		},
		{
			label: '负责人',
			maxlength: 20,
			placeholder: '请输入负责人',
			prop: 'leader',
			span: 12,
			type: 'input'
		},
		{
			label: '联系电话',
			maxlength: 11,
			placeholder: '请输入联系电话',
			prop: 'phone',
			span: 12,
			type: 'input'
		},
		{
			label: '邮箱',
			maxlength: 50,
			placeholder: '请输入邮箱',
			prop: 'email',
			span: 12,
			type: 'input'
		},
		{
			label: '邮箱',
			options: sysNormalDisable as unknown as any[],
			prop: 'status',
			span: 12,
			type: 'radio'
		}
	],
	formRules: {
		deptName: [
			{
				message: '请输入部门名称',
				required: true
			}
		],
		orderNum: [
			{
				message: '请输入显示排序',
				required: true
			}
		],
		parentId: [
			{
				message: '请选择上级部门',
				required: true
			}
		]
	},
	labelWidth: '80px',
	span: 6,
	tableShow: false
})

async function submit() {
	await formGeneratorRef.value?.validate()
	const apiFunc = props.flag === 'add' ? addDept : updateDept
	const message = props.flag === 'add' ? '新增成功' : '修改成功'
	apiFunc(formData.value).then(() => {
		ElMessage.success(message)
		emits('update:visible', false)
		emits('refresh')
	})
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
		:title="props.flag === 'add' ? '添加部门' : '修改部门'"
		width="600px"
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
