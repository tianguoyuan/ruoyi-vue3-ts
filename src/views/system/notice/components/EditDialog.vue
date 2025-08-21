<script setup lang="ts">
import { getDicts } from '@/api/system/dict'
import type { FormConfig } from '@/components/FormGenerator/types'
import FormGenerator from '@/components/FormGenerator/index.vue'
import { getNotice, addNotice, updateNotice } from '@/api/system/notice'

const props = defineProps<{
	visible: boolean
	id?: string
}>()
const emits = defineEmits<{
	'update:visible': [v: boolean]
	refresh: []
}>()

const formGeneratorRef = ref<InstanceType<typeof FormGenerator> | null>(null)

const sysNoticeType = ref<API.IGetDictsRes>([])
const sysNoticeStatus = ref<API.IGetDictsRes>([])

const initFormData = {
	noticeTitle: undefined,
	noticeType: undefined,
	status: '0',
	noticeContent: undefined
}
const formData = ref({ ...initFormData })

watch(
	() => props.visible,
	v => {
		if (!v) return
		formData.value = { ...initFormData }
		setTimeout(() => formGeneratorRef.value?.clearValidate())

		if (!props.id) return
		getNotice(props.id).then(({ data }) => {
			formData.value = data
		})
	}
)
const formConfig = ref<FormConfig>({
	labelWidth: '80px',
	span: 24,
	formRules: {
		noticeTitle: [
			{
				required: true,
				message: '公告标题不能为空',
				trigger: 'blur'
			}
		],
		noticeType: [
			{
				required: true,
				message: '公告类型不能为空',
				trigger: 'change'
			}
		]
	},
	fields: [
		{
			type: 'input',
			label: '公告标题',
			prop: 'noticeTitle',
			placeholder: '请输入公告标题',
			span: 12
		},

		{
			type: 'select',
			label: '公告类型',
			prop: 'noticeType',
			placeholder: '请选择公告类型',
			options: sysNoticeType as unknown as any[],
			span: 12
		},
		{
			type: 'radio',
			label: '状态',
			prop: 'status',
			options: sysNoticeStatus as unknown as any[]
		},
		{
			type: 'slot',
			slotName: 'noticeContentSlot',
			label: '内容',
			prop: 'noticeContent'
		}
	],
	buttons: [],
	tableShow: false,
	tableInitQueryRefuse: true
})

async function submit() {
	await formGeneratorRef.value?.validate()
	const apiFunc = props.id ? updateNotice : addNotice
	await apiFunc(formData.value)
	const message = props.id ? '修改成功' : '新增成功'
	ElMessage.success(message)
	emits('update:visible', false)
	emits('refresh')
}

function init() {
	getDicts('sys_notice_type').then(data => {
		sysNoticeType.value = data
	})
	getDicts('sys_notice_status').then(data => {
		sysNoticeStatus.value = data
	})
}
init()
</script>

<template>
	<ElDialog
		:model-value="props.visible"
		:title="id ? '修改公告' : '添加公告'"
		:close-on-click-modal="false"
		width="800px"
		@update:modelValue="v => emits('update:visible', v)"
	>
		<FormGenerator
			ref="formGeneratorRef"
			v-model="formData"
			:config="formConfig"
		>
			<template #noticeContentSlot>
				<Editor
					v-model="formData.noticeContent"
					:min-height="192"
				/>
			</template>
		</FormGenerator>
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
