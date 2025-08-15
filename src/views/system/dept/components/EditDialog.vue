<script setup lang="ts">
import { getDicts } from '@/api/system/dict'
import type { FormConfig } from '@/components/FormGenerator/types'
import FormGenerator from '@/components/FormGenerator/index.vue'
import { addDept, getDept, updateDept } from '@/api/system/dep'

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
	parentId: '',
	orderNum: 0
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
	labelWidth: '80px',
	span: 6,
	formRules: {
		parentId: [
			{
				required: true,
				message: '请选择上级部门'
			}
		],
		deptName: [
			{
				required: true,
				message: '请输入部门名称'
			}
		],
		orderNum: [
			{
				required: true,
				message: '请输入显示排序'
			}
		]
	},
	fields: [
		{
			type: 'cascader',
			options: deptIdOptions as unknown as any[],
			showAllLevels: false,
			props: {
				label: 'deptName',
				value: 'deptId',
				emitPath: false,
				checkStrictly: true
			},
			label: '上级部门',
			prop: 'parentId',
			placeholder: '请选择上级部门',
			span: 24,
			hidden: parentIdTop as unknown as boolean
		},
		{
			type: 'input',
			label: '部门名称',
			prop: 'deptName',
			placeholder: '请输入部门名称',
			span: 12
		},
		{
			type: 'input-number',
			label: '显示排序',
			prop: 'orderNum',
			min: 0,
			controlsPosition: 'right',
			span: 12
		},
		{
			type: 'input',
			label: '负责人',
			placeholder: '请输入负责人',
			prop: 'leader',
			span: 12,
			maxlength: 20
		},
		{
			type: 'input',
			label: '联系电话',
			placeholder: '请输入联系电话',
			prop: 'phone',
			span: 12,
			maxlength: 11
		},
		{
			type: 'input',
			label: '邮箱',
			placeholder: '请输入邮箱',
			prop: 'email',
			span: 12,
			maxlength: 50
		},
		{
			type: 'radio',
			label: '邮箱',
			prop: 'status',
			span: 12,
			options: sysNormalDisable as unknown as any[]
		}
	],
	buttons: [],
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
		:model-value="props.visible"
		:title="props.flag === 'add' ? '添加部门' : '修改部门'"
		width="600px"
		:close-on-click-modal="false"
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
