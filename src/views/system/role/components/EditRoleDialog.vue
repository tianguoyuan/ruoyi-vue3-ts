<script setup lang="ts">
import type { FormConfig } from '@/components/FormGenerator/types'
import FormGenerator from '@/components/FormGenerator/index.vue'
import { getDicts } from '@/api/system/dict'

const props = defineProps<{
	visible: boolean
	id?: string
}>()
const emits = defineEmits<{
	'update:visible': [v: boolean]
}>()

const sysNormalDisable = ref<API.IGetDictsRes>([])

const formGeneratorRef = ref<InstanceType<typeof FormGenerator> | null>(null)
const formData = ref({})
const formConfig = ref<FormConfig>({
	labelWidth: '100px',
	span: 24,
	fields: [
		{
			type: 'input',
			label: '角色名称',
			prop: 'roleName',
			placeholder: '请输入角色名称'
		},

		{
			type: 'input',
			label: '权限字符',
			prop: 'roleKey',
			placeholder: '请输入权限字符'
		},
		{
			type: 'input-number',
			label: '角色顺序',
			prop: 'roleSort',
			min: 0,
			controlsPosition: 'right'
		},
		{
			type: 'radio',
			label: '状态',
			prop: 'status',
			options: sysNormalDisable as unknown as any[]
		},
		{
			type: 'slot',
			slotName: ''
		},
		{
			type: 'textarea',
			rows: 5,
			label: '备注',
			prop: 'remark',
			placeholder: '请输入备注'
		}
	],
	buttons: [],
	tableShow: false
})

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
		:title="id ? '修改角色' : '添加角色'"
		@update:modelValue="v => emits('update:visible', v)"
	>
		<FormGenerator
			ref="formGeneratorRef"
			v-model="formData"
			:config="formConfig"
		/>
	</ElDialog>
</template>

<style scoped></style>
