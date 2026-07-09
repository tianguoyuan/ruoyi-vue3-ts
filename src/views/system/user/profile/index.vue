<script setup lang="ts">
import { systemUserProfile } from '@/api/system/user'

import ResetPwd from './components/ResetPwd.vue'
import UserInfo from './components/UserInfo.vue'

const userProfile = ref<{ label: string; value: string; icon: string }[]>([])

const userForm = ref({
	email: '',
	nickName: '',
	phonenumber: '',
	sex: ''
})
const selectedTab = ref('userinfo')

async function getUserProfile() {
	const { data, postGroup, roleGroup } = await systemUserProfile()
	userProfile.value = [
		{
			icon: 'user',
			label: '用户名称',
			value: data.userName
		},
		{
			icon: 'phone',
			label: '手机号码',
			value: data.phonenumber
		},
		{
			icon: 'email',
			label: '用户邮箱',
			value: data.email
		},
		{
			icon: 'tree',
			label: '所属部门',
			value: data.dept.deptName + ' / ' + postGroup
		},
		{
			icon: 'peoples',
			label: '所属角色',
			value: roleGroup
		},
		{
			icon: 'date',
			label: '创建日期',
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
		<ElRow>
			<ElCol :span="6">
				<ElCard class="min-w-70">
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
								:iconClass="item.icon"
								size="13"
							/>

							{{ item.label }}
						</div>
						<div>{{ item.value }}</div>
					</div>
				</ElCard>
			</ElCol>

			<ElCol :span="18">
				<ElCard class="ml-3">
					<template #header>
						<div class="card-header">
							<span>基本资料</span>
						</div>
					</template>
					<ElTabs v-model="selectedTab">
						<ElTabPane
							label="基本资料"
							name="userinfo"
						>
							<UserInfo
								:userForm="userForm"
								@refreshInfo="getUserProfile"
							/>
						</ElTabPane>
						<ElTabPane
							label="修改密码"
							name="resetPwd"
						>
							<ResetPwd />
						</ElTabPane>
					</ElTabs>
				</ElCard>
			</ElCol>
		</ElRow>
	</div>
</template>
