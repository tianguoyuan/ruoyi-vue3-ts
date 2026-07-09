<script setup lang="ts">
import { ElMessage, type FormInstance } from 'element-plus'

import { updateUserPwd } from '@/api/system/user'

const formModel = ref({
	confirmPassword: undefined,
	newPassword: undefined,
	oldPassword: undefined
})

function equalToPassword(rule, value, callback) {
	if (formModel.value.newPassword !== value) {
		callback(new Error('两次输入的密码不一致'))
	} else {
		callback()
	}
}

const formRules = ref({
	confirmPassword: [
		{
			message: '确认密码不能为空',
			required: true,
			trigger: 'blur'
		},
		{
			required: true,
			trigger: 'blur',
			validator: equalToPassword
		}
	],
	newPassword: [
		{
			message: '新密码不能为空',
			required: true,
			trigger: 'blur'
		},
		{
			max: 20,
			message: '长度在 6 到 20 个字符',
			min: 6,
			trigger: 'blur'
		},
		{
			message: '不能包含非法字符：< > " \' \\ |',
			pattern: /^[^<>"'|\\]+$/,
			trigger: 'blur'
		}
	],
	oldPassword: [
		{
			message: '旧密码不能为空',
			required: true,
			trigger: 'blur'
		}
	]
})

const formRef = ref<null | FormInstance>(null)
/** 提交按钮 */
async function submit() {
	if (!formRef.value) return
	await formRef.value.validate()
	updateUserPwd(formModel.value.oldPassword, formModel.value.newPassword).then(() => {
		ElMessage({
			message: '修改成功',
			type: 'success'
		})
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
			label="旧密码"
			prop="oldPassword"
		>
			<ElInput
				v-model="formModel.oldPassword"
				placeholder="请输入旧密码"
				showPassword
				type="password"
			/>
		</ElFormItem>
		<ElFormItem
			label="新密码"
			prop="newPassword"
		>
			<ElInput
				v-model="formModel.newPassword"
				placeholder="请输入新密码"
				showPassword
				type="password"
			/>
		</ElFormItem>
		<ElFormItem
			label="确认密码"
			prop="confirmPassword"
		>
			<ElInput
				v-model="formModel.confirmPassword"
				placeholder="请确认新密码"
				showPassword
				type="password"
			/>
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
