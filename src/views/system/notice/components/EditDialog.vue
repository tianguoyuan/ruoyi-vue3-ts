<script setup lang="ts">
import { getDicts } from '@/api/system/dict'
import { getNotice, addNotice, updateNotice } from '@/api/system/notice'
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

const sysNoticeType = ref<API.IGetDictsRes>([])
const sysNoticeStatus = ref<API.IGetDictsRes>([])

const initFormData = {
	noticeContent: undefined,
	noticeTitle: undefined,
	noticeType: undefined,
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
		getNotice(props.id).then(({ data }) => {
			formData.value = data
		})
	}
)
const formConfig = ref<FormConfig>({
	buttons: [],
	fields: [
		{
			label: '公告标题',
			placeholder: '请输入公告标题',
			prop: 'noticeTitle',
			span: 12,
			type: 'input'
		},

		{
			label: '公告类型',
			options: sysNoticeType as unknown as any[],
			placeholder: '请选择公告类型',
			prop: 'noticeType',
			span: 12,
			type: 'select'
		},
		{
			label: '状态',
			options: sysNoticeStatus as unknown as any[],
			prop: 'status',
			type: 'radio'
		},
		{
			label: '内容',
			prop: 'noticeContent',
			slotName: 'noticeContentSlot',
			type: 'slot'
		}
	],
	formRules: {
		noticeTitle: [
			{
				message: '公告标题不能为空',
				required: true,
				trigger: 'blur'
			}
		],
		noticeType: [
			{
				message: '公告类型不能为空',
				required: true,
				trigger: 'change'
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
		:closeOnClickModal="false"
		:modelValue="props.visible"
		:title="id ? '修改公告' : '添加公告'"
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
					:minHeight="192"
				/>
			</template>
		</FormGenerator>
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
