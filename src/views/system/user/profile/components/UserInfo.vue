<script setup lang="ts">
import { ElMessage, type FormInstance } from 'element-plus'

import { updateUserProfile } from '@/api/system/user'
import { useUserStore } from '@/store/user'

const props = defineProps<{
	userForm: {
		nickName: string
		phonenumber: string
		email: string
		sex: string
	}
}>()

const formModel = ref({
	email: '',
	nickName: '',
	phonenumber: '',
	sex: ''
})

const formRules = ref({
	email: [
		{
			message: '邮箱地址不能为空',
			required: true,
			trigger: 'blur'
		},
		{
			message: '请输入正确的邮箱地址',
			trigger: ['blur', 'change']
		}
	],
	nickName: [
		{
			message: '用户昵称不能为空',
			required: true,
			trigger: 'blur'
		}
	],
	phonenumber: [
		{
			message: '手机号码不能为空',
			required: true,
			trigger: 'blur'
		},
		{
			message: '请输入正确的手机号码',
			pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
			trigger: 'blur'
		}
	]
})

watch(props.userForm, () => {
	formModel.value = { ...props.userForm }
})

const emits = defineEmits<{
	refreshInfo: []
}>()

const userStore = useUserStore()
const formRef = ref<null | FormInstance>(null)
/** 提交按钮 */
async function submit() {
	if (!formRef.value) return

	await formRef.value.validate()
	updateUserProfile(formModel.value).then(() => {
		ElMessage({
			message: '修改成功',
			type: 'success'
		})
		emits('refreshInfo')
		// nickName修改后, 在查询
		if (props.userForm.nickName !== formModel.value.nickName) {
			userStore.userInfoSimple()
		}
	})
}
</script>

<template>
	<ElForm
		ref="formRef"
		labelWidth="80px"
		:model="formModel"
		:rules="formRules"
	>
		<ElFormItem
			label="用户昵称"
			prop="nickName"
		>
			<ElInput
				v-model="formModel.nickName"
				maxlength="30"
			/>
		</ElFormItem>
		<ElFormItem
			label="手机号码"
			prop="phonenumber"
		>
			<ElInput
				v-model="formModel.phonenumber"
				maxlength="11"
			/>
		</ElFormItem>
		<ElFormItem
			label="邮箱"
			prop="email"
		>
			<ElInput
				v-model="formModel.email"
				maxlength="50"
			/>
		</ElFormItem>
		<ElFormItem label="性别">
			<ElRadioGroup v-model="formModel.sex">
				<ElRadio value="0">男</ElRadio>
				<ElRadio value="1">女</ElRadio>
			</ElRadioGroup>
		</ElFormItem>
		<ElFormItem>
			<ElButton
				type="primary"
				@click="submit"
			>
				保存
			</ElButton>
		</ElFormItem>
	</ElForm>
</template>
