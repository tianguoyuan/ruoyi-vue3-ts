<script setup lang="ts">
import { updateUserPwd } from '@/api/system/user'
import { ElMessage, type FormInstance } from 'element-plus'

const formModel = ref({
	oldPassword: undefined,
	newPassword: undefined,
	confirmPassword: undefined
})

function equalToPassword(rule, value, callback) {
	if (formModel.value.newPassword !== value) {
		callback(new Error('两次输入的密码不一致'))
	} else {
		callback()
	}
}

const formRules = ref({
	oldPassword: [
		{
			required: true,
			message: '旧密码不能为空',
			trigger: 'blur'
		}
	],
	newPassword: [
		{
			required: true,
			message: '新密码不能为空',
			trigger: 'blur'
		},
		{
			min: 6,
			max: 20,
			message: '长度在 6 到 20 个字符',
			trigger: 'blur'
		},
		{
			pattern: /^[^<>"'|\\]+$/,
			message: '不能包含非法字符：< > " \' \\ |',
			trigger: 'blur'
		}
	],
	confirmPassword: [
		{
			required: true,
			message: '确认密码不能为空',
			trigger: 'blur'
		},
		{
			required: true,
			validator: equalToPassword,
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
	<el-form
		ref="formRef"
		:model="formModel"
		:rules="formRules"
		label-width="80px"
	>
		<el-form-item
			label="旧密码"
			prop="oldPassword"
		>
			<el-input
				v-model="formModel.oldPassword"
				placeholder="请输入旧密码"
				type="password"
				show-password
			/>
		</el-form-item>
		<el-form-item
			label="新密码"
			prop="newPassword"
		>
			<el-input
				v-model="formModel.newPassword"
				placeholder="请输入新密码"
				type="password"
				show-password
			/>
		</el-form-item>
		<el-form-item
			label="确认密码"
			prop="confirmPassword"
		>
			<el-input
				v-model="formModel.confirmPassword"
				placeholder="请确认新密码"
				type="password"
				show-password
			/>
		</el-form-item>
		<el-form-item>
			<el-button
				type="primary"
				@click="submit"
			>
				保存
			</el-button>
		</el-form-item>
	</el-form>
</template>
