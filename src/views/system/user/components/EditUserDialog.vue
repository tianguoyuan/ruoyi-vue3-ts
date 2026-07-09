<script setup lang="ts">
import { ElMessage } from 'element-plus'

import { getConfigKey } from '@/api/system/config'
import { getDicts } from '@/api/system/dict'
import { addUser, getUser, updateUser } from '@/api/system/user'
import FormGenerator from '@/components/FormGenerator/index.vue'
import type { FormConfig } from '@/components/FormGenerator/types'
import { validEmailReg, validPhoneReg } from '@/utils/validate'

const props = defineProps<{
	visible: boolean
	userId?: string
	enabledDeptOptions: any[]
}>()

const emits = defineEmits<{
	'update:visible': [v: boolean]
	refresh: []
}>()

const cacheEnabledDeptOptions = computed(() => props.enabledDeptOptions)
const cacheHasUserId = computed(() => !!props.userId)

const sysUserSex = ref<API.IGetDictsRes>([])
const sysNormalDisable = ref<API.IGetDictsRes>([])
const postIdsOptions = ref<API.IGetDictsRes>([])
const roleIdsOptions = ref<API.IGetDictsRes>([])
const originInitPassword = ref('')

const formGeneratorRef = ref<InstanceType<typeof FormGenerator> | null>(null)
const initFormData = {
	deptId: '',
	email: '',
	nickName: '',
	password: '',
	phonenumber: '',
	postIds: [],
	remark: '',
	roleIds: [],
	sex: '',
	status: '0',
	userName: ''
}
const formData = ref({ ...initFormData })

const formConfig = ref<FormConfig>({
	buttons: [],
	fields: [
		{
			label: '用户昵称',
			maxlength: 30,
			placeholder: '请输入用户昵称',
			prop: 'nickName',
			type: 'input'
		},
		{
			label: '归属部门',
			options: cacheEnabledDeptOptions as unknown as any[],
			placeholder: '请选择归属部门',
			prop: 'deptId',
			props: {
				checkStrictly: true,
				children: 'children',
				emitPath: false,
				label: 'label',
				value: 'id'
			},
			type: 'cascader'
		},
		{
			label: '手机号码',
			maxlength: 11,
			placeholder: '请输入手机号码',
			prop: 'phonenumber',
			type: 'input'
		},
		{
			label: '邮箱',
			maxlength: 50,
			placeholder: '请输入邮箱',
			prop: 'email',
			type: 'input'
		},

		{
			hidden: cacheHasUserId as unknown as boolean,
			label: '用户名称',
			maxlength: 30,
			placeholder: '请输入用户名称',
			prop: 'userName',
			type: 'input'
		},
		{
			hidden: cacheHasUserId as unknown as boolean,
			label: '用户密码',
			maxlength: 20,
			placeholder: '请输入用户密码',
			prop: 'password',
			showPassword: true,
			type: 'input'
		},

		{
			label: '用户性别',
			options: sysUserSex as unknown as any[],
			placeholder: '请选择用户性别',
			prop: 'sex',
			type: 'select'
		},
		{
			label: '状态',
			options: sysNormalDisable as unknown as any[],
			prop: 'status',
			type: 'radio'
		},

		{
			label: '岗位',
			multiple: true,
			options: postIdsOptions as unknown as any[],
			placeholder: '请选择岗位',
			prop: 'postIds',
			type: 'select'
		},
		{
			label: '角色',
			multiple: true,
			options: roleIdsOptions as unknown as any[],
			placeholder: '请选择角色',
			prop: 'roleIds',
			type: 'select'
		},
		{
			label: '备注',
			placeholder: '请输入备注',
			prop: 'remark',
			rows: 3,
			span: 24,
			type: 'textarea'
		}
	],
	formRules: {},
	labelWidth: '80px',
	span: 12,
	tableInitQueryRefuse: true,
	tableShow: false
})

watch(
	() => [props.visible, props.userId],
	async ([visible, userId]) => {
		if (!visible) return
		setFormRules(userId)
		// 每次打开清空
		await nextTick()
		formData.value = { ...initFormData }
		// 动态rules 错误信息去除方法
		setTimeout(() => {
			formGeneratorRef.value?.clearValidate()
		})

		// 新增默认password
		if (!userId && originInitPassword.value && !formData.value.password) {
			formData.value.password = originInitPassword.value
		}

		getUser(userId + '').then(data => {
			postIdsOptions.value = data.posts.map(v => ({
				label: v.postName,
				value: v.postId
			}))
			roleIdsOptions.value = data.roles.map(v => ({
				label: v.roleName,
				value: v.roleId
			}))

			if (data.data) {
				Object.keys(formData.value).forEach(key => {
					if (Object.prototype.hasOwnProperty.call(data.data, key)) {
						formData.value[key] = data.data[key]
					}
				})
			}
			if (data.postIds) formData.value.postIds = data.postIds
			if (data.roleIds) formData.value.roleIds = data.roleIds
		})
	}
)

function setFormRules(userId) {
	const initRules = {
		email: [
			{
				message: '请输入正确的邮箱地址',
				pattern: validEmailReg,
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
				message: '请输入正确的手机号码',
				pattern: validPhoneReg,
				trigger: 'blur'
			}
		]
	}
	formConfig.value.formRules = { ...initRules }

	if (!userId) {
		formConfig.value.formRules.userName = [
			{
				message: '用户名称不能为空',
				required: true,
				trigger: 'blur'
			},
			{
				max: 20,
				message: '用户名称长度必须介于 2 和 20 之间',
				min: 2,
				trigger: 'blur'
			}
		]
		formConfig.value.formRules.password = [
			{
				message: '用户密码不能为空',
				required: true,
				trigger: 'blur'
			},
			{
				max: 20,
				message: '用户密码长度必须介于 5 和 20 之间',
				min: 5,
				trigger: 'blur'
			},
			{
				message: '不能包含非法字符：< > " \' \\ |',
				pattern: /^[^<>"'|\\]+$/,
				trigger: 'blur'
			}
		]
	} else {
		formConfig.value.formRules = { ...initRules }
	}
}

async function submit() {
	await formGeneratorRef.value?.validate()
	const apiFunc = props.userId ? updateUser : addUser
	const params = {
		...formData.value,
		userId: props.userId
	}
	apiFunc({ ...params }).then(() => {
		ElMessage.success(props.userId ? '修改成功' : '新增成功')
		emits('update:visible', false)
		emits('refresh')
	})
}

function init() {
	getDicts('sys_user_sex').then(data => {
		sysUserSex.value = data
	})
	getDicts('sys_normal_disable').then(data => {
		sysNormalDisable.value = data
	})

	getConfigKey('sys.user.initPassword').then(data => {
		formData.value.password = data.msg
		originInitPassword.value = data.msg
	})
}
init()
</script>

<template>
	<ElDialog
		:closeOnClickModal="false"
		:modelValue="props.visible"
		:title="props.userId ? '修改用户' : '添加用户'"
		@update:modelValue="v => emits('update:visible', v)"
	>
		<FormGenerator
			ref="formGeneratorRef"
			v-model="formData"
			:config="formConfig"
		/>

		<template #footer>
			<ElButton
				plain
				@click="emits('update:visible', false)"
			>
				取消
			</ElButton>
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
