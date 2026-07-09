<script setup lang="ts">
import { User, Lock } from '@element-plus/icons-vue'
import to from 'await-to-js'
import Cookies from 'js-cookie'
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { captchaImage } from '@/api/user'
import { useUserStore } from '@/store/user'
import { encrypt, decrypt } from '@/utils/jsencrypt'
import type { FormInstance } from 'element-plus'

const appTitle = import.meta.env.VITE_GLOB_APP_TITLE
const route = useRoute()
const router = useRouter()
const redirect = ref<string | null>(null)
const otherQuery = ref({})
function getOtherQuery(query) {
	return Object.keys(query).reduce((pre, cur) => {
		if (cur !== 'redirect') pre[cur] = query[cur]
		return pre
	}, {})
}
watch(
	route,
	() => {
		const query = route.query
		if (query.redirect) {
			try {
				redirect.value = query.redirect as string
				otherQuery.value = getOtherQuery(query)
			} catch (error) {
				redirect.value = null
			}
		}
	},
	{ immediate: true }
)

const formModel = ref({
	code: '',
	password: 'admin123',
	rememberMe: false,
	username: 'admin',
	uuid: ''
})
const formRule = ref({
	code: [
		{
			message: 'Please input code',
			required: true,
			trigger: 'blur'
		}
	],
	password: [
		{
			message: 'Please input password',
			required: true,
			trigger: 'blur'
		}
	],
	username: [
		{
			message: 'Please input username',
			required: true,
			trigger: 'blur'
		}
	]
})
const formRef = ref<null | FormInstance>(null)
const userStore = useUserStore()
async function submit() {
	await formRef.value?.validate()
	const [err] = await to(
		userStore.login({
			code: formModel.value.code,
			password: formModel.value.password,
			username: formModel.value.username,
			uuid: formModel.value.uuid
		})
	)
	if (err) {
		getCaptchaImage()
		return
	}

	// 勾选了需要记住密码设置在 cookie 中设置记住用户名和密码
	if (formModel.value.rememberMe) {
		Cookies.set('username', formModel.value.username, { expires: 30 })
		Cookies.set('password', encrypt(formModel.value.password), { expires: 30 })
		Cookies.set('rememberMe', formModel.value.rememberMe, { expires: 30 })
	} else {
		// 否则移除
		Cookies.remove('username')
		Cookies.remove('password')
		Cookies.remove('rememberMe')
	}

	router.push({
		path: redirect.value || '/',
		query: otherQuery.value
	})
}

const codeImg = ref('')
async function getCaptchaImage() {
	const result = await captchaImage()
	codeImg.value = 'data:image/gif;base64,' + result.img
	formModel.value.uuid = result.uuid
}
function getCookie() {
	const username = Cookies.get('username')
	const password = Cookies.get('password')
	const rememberMe = Cookies.get('rememberMe')
	formModel.value.username = username === undefined ? formModel.value.username : username

	formModel.value.password = password === undefined ? formModel.value.password : decrypt(password)

	formModel.value.rememberMe = rememberMe === undefined ? false : Boolean(rememberMe)
}
getCaptchaImage()
getCookie()
</script>

<template>
	<div class="h-screen w-screen bg-#2d3a4b overflow-auto select-none flex items-center justify-center">
		<div class="bg-white rounded-2 p-6 w-100">
			<div class="text-#707070 text-4.5 text-center mb-7.5">{{ appTitle }}</div>
			<ElForm
				ref="formRef"
				class="form"
				:model="formModel"
				:rules="formRule"
			>
				<ElFormItem
					label=""
					prop="username"
				>
					<ElInput
						v-model.trim="formModel.username"
						autocomplete="off"
						class="h-9.5"
						clearable
						placeholder="Username"
						:prefixIcon="User"
						type="text"
					/>
				</ElFormItem>
				<ElFormItem
					label=""
					prop="password"
				>
					<ElInput
						ref="passwordRef"
						v-model.trim="formModel.password"
						autocomplete="off"
						class="h-9.5"
						clearable
						placeholder="Password"
						:prefixIcon="Lock"
						type="password"
						@keyup.enter="submit"
					/>
				</ElFormItem>

				<ElForm prop="code">
					<div class="flex justify-between mb-4.5">
						<div class="w-63%">
							<ElInput
								v-model="formModel.code"
								autoComplete="off"
								class="h-9.5 w-100%"
								placeholder="验证码"
								@keyup.enter="submit"
							>
								<template #prefix>
									<SvgIcon
										iconClass="validCode"
										size="14"
									/>
								</template>
							</ElInput>
						</div>
						<img
							class="h-9.5 cursor-pointer"
							:src="codeImg"
							@click="getCaptchaImage"
						/>
					</div>
				</ElForm>

				<ElFormItem>
					<ElCheckbox v-model="formModel.rememberMe">记住密码</ElCheckbox>
				</ElFormItem>
				<ElButton
					class="w-full"
					size="large"
					type="primary"
					@click="submit"
				>
					登录
				</ElButton>
			</ElForm>
		</div>
	</div>
</template>
