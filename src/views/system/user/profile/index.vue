<script setup lang="ts">
import { systemUserProfile } from '@/api/system/user'
import UserInfo from './components/UserInfo.vue'
import ResetPwd from './components/ResetPwd.vue'

const userProfile = ref<{ label: string; value: string; icon: string }[]>([])

const userForm = ref({
	nickName: '',
	phonenumber: '',
	email: '',
	sex: ''
})
const selectedTab = ref('userinfo')

async function getUserProfile() {
	const { postGroup, roleGroup, data } = await systemUserProfile()
	userProfile.value = [
		{
			label: '用户名称',
			icon: 'user',
			value: data.userName
		},
		{
			label: '手机号码',
			icon: 'phone',
			value: data.phonenumber
		},
		{
			label: '用户邮箱',
			icon: 'email',
			value: data.email
		},
		{
			label: '所属部门',
			icon: 'tree',
			value: data.dept.deptName + ' / ' + postGroup
		},
		{
			label: '所属角色',
			icon: 'peoples',
			value: roleGroup
		},
		{
			label: '创建日期',
			icon: 'date',
			value: data.createTime
		}
	]

	userForm.value.nickName = data.nickName
	userForm.value.phonenumber = data.phonenumber
	userForm.value.email = data.email
	userForm.value.sex = data.sex
}
getUserProfile()
</script>

<template>
	<div class="m-3">
		<el-row>
			<el-col :span="6">
				<el-card class="min-w-70">
					<template #header>
						<div class="card-header">
							<span>个人信息</span>
						</div>
					</template>
					<div class="flex justify-center pb-4">
						<UserAvatar />
					</div>
					<div
						v-for="(item, index) in userProfile"
						:key="index"
						class="flex justify-between text-13px py-3 border-t border-#e7eaec last:border-b"
					>
						<div>
							<SvgIcon
								:icon-class="item.icon"
								size="13"
							/>

							{{ item.label }}
						</div>
						<div>{{ item.value }}</div>
					</div>
				</el-card>
			</el-col>

			<el-col :span="18">
				<el-card class="ml-3">
					<template #header>
						<div class="card-header">
							<span>基本资料</span>
						</div>
					</template>
					<el-tabs v-model="selectedTab">
						<el-tab-pane
							label="基本资料"
							name="userinfo"
						>
							<UserInfo
								:user-form="userForm"
								@refreshInfo="getUserProfile"
							/>
						</el-tab-pane>
						<el-tab-pane
							label="修改密码"
							name="resetPwd"
						>
							<ResetPwd />
						</el-tab-pane>
					</el-tabs>
				</el-card>
			</el-col>
		</el-row>
	</div>
</template>
