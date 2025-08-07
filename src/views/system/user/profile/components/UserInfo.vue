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
	nickName: '',
	phonenumber: '',
	email: '',
	sex: ''
})

const formRules = ref({
	nickName: [
		{
			required: true,
			message: '用户昵称不能为空',
			trigger: 'blur'
		}
	],
	email: [
		{
			required: true,
			message: '邮箱地址不能为空',
			trigger: 'blur'
		},
		{
			message: '请输入正确的邮箱地址',
			trigger: ['blur', 'change']
		}
	],
	phonenumber: [
		{
			required: true,
			message: '手机号码不能为空',
			trigger: 'blur'
		},
		{
			pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
			message: '请输入正确的手机号码',
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
	<el-form
		ref="formRef"
		:model="formModel"
		:rules="formRules"
		label-width="80px"
	>
		<el-form-item
			label="用户昵称"
			prop="nickName"
		>
			<el-input
				v-model="formModel.nickName"
				maxlength="30"
			/>
		</el-form-item>
		<el-form-item
			label="手机号码"
			prop="phonenumber"
		>
			<el-input
				v-model="formModel.phonenumber"
				maxlength="11"
			/>
		</el-form-item>
		<el-form-item
			label="邮箱"
			prop="email"
		>
			<el-input
				v-model="formModel.email"
				maxlength="50"
			/>
		</el-form-item>
		<el-form-item label="性别">
			<el-radio-group v-model="formModel.sex">
				<el-radio value="0">男</el-radio>
				<el-radio value="1">女</el-radio>
			</el-radio-group>
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
