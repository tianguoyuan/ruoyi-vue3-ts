<script setup lang="ts">
import type { FormConfig } from '@/components/FormGenerator/types'
import FormGenerator from '@/components/FormGenerator/index.vue'
import { getDicts } from '@/api/system/dict'
import { addUser, getUser, updateUser } from '@/api/system/user'
import { getConfigKey } from '@/api/system/config'
import { validEmailReg, validPhoneReg } from '@/utils/validate'
import { ElMessage } from 'element-plus'

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
	nickName: '',
	deptId: '',
	phonenumber: '',
	email: '',
	userName: '',
	password: '',
	sex: '',
	status: '0',
	postIds: [],
	roleIds: [],
	remark: ''
}
const formData = ref({ ...initFormData })

const formConfig = ref<FormConfig>({
	labelWidth: '80px',
	span: 12,
	fields: [
		{
			type: 'input',
			label: '用户昵称',
			prop: 'nickName',
			placeholder: '请输入用户昵称',
			maxlength: 30
		},
		{
			type: 'cascader',
			label: '归属部门',
			prop: 'deptId',
			props: {
				value: 'id',
				label: 'label',
				children: 'children',
				emitPath: false,
				checkStrictly: true
			},
			placeholder: '请选择归属部门',
			options: cacheEnabledDeptOptions as unknown as any[]
		},
		{
			type: 'input',
			label: '手机号码',
			prop: 'phonenumber',
			placeholder: '请输入手机号码',
			maxlength: 11
		},
		{
			type: 'input',
			label: '邮箱',
			prop: 'email',
			placeholder: '请输入邮箱',
			maxlength: 50
		},

		{
			type: 'input',
			label: '用户名称',
			prop: 'userName',
			placeholder: '请输入用户名称',
			maxlength: 30,
			hidden: cacheHasUserId as unknown as boolean
		},
		{
			type: 'input',
			label: '用户密码',
			prop: 'password',
			showPassword: true,
			placeholder: '请输入用户密码',
			maxlength: 20,
			hidden: cacheHasUserId as unknown as boolean
		},

		{
			type: 'select',
			label: '用户性别',
			prop: 'sex',
			placeholder: '请选择用户性别',
			options: sysUserSex as unknown as any[]
		},
		{
			type: 'radio',
			label: '状态',
			prop: 'status',
			options: sysNormalDisable as unknown as any[]
		},

		{
			type: 'select',
			label: '岗位',
			prop: 'postIds',
			placeholder: '请选择岗位',
			multiple: true,
			options: postIdsOptions as unknown as any[]
		},
		{
			type: 'select',
			label: '角色',
			prop: 'roleIds',
			placeholder: '请选择角色',
			multiple: true,
			options: roleIdsOptions as unknown as any[]
		},
		{
			type: 'textarea',
			label: '备注',
			prop: 'remark',
			rows: 3,
			placeholder: '请输入备注',
			span: 24
		}
	],
	formRules: {},
	buttons: [],
	tableShow: false,
	tableInitQueryRefuse: true
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
		nickName: [
			{
				required: true,
				message: '用户昵称不能为空',
				trigger: 'blur'
			}
		],

		email: [
			{
				pattern: validEmailReg,
				message: '请输入正确的邮箱地址',
				trigger: ['blur', 'change']
			}
		],
		phonenumber: [
			{
				pattern: validPhoneReg,
				message: '请输入正确的手机号码',
				trigger: 'blur'
			}
		]
	}
	formConfig.value.formRules = { ...initRules }

	if (!userId) {
		formConfig.value.formRules.userName = [
			{
				required: true,
				message: '用户名称不能为空',
				trigger: 'blur'
			},
			{
				min: 2,
				max: 20,
				message: '用户名称长度必须介于 2 和 20 之间',
				trigger: 'blur'
			}
		]
		formConfig.value.formRules.password = [
			{
				required: true,
				message: '用户密码不能为空',
				trigger: 'blur'
			},
			{
				min: 5,
				max: 20,
				message: '用户密码长度必须介于 5 和 20 之间',
				trigger: 'blur'
			},
			{
				pattern: /^[^<>"'|\\]+$/,
				message: '不能包含非法字符：< > " \' \\ |',
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
		:model-value="props.visible"
		:title="props.userId ? '修改用户' : '添加用户'"
		:close-on-click-modal="false"
		@update:modelValue="v => emits('update:visible', v)"
	>
		<FormGenerator
			ref="formGeneratorRef"
			v-model="formData"
			:config="formConfig"
		/>

		<template #footer>
			<el-button
				plain
				@click="emits('update:visible', false)"
			>
				取消
			</el-button>
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
