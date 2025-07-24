<script setup lang="ts">
import { ref, watch } from 'vue'
import { User, Lock } from '@element-plus/icons-vue'
import { useRoute, useRouter } from 'vue-router'
import type { FormInstance } from 'element-plus'
import { useUserStore } from '@/store/user'
import { captchaImage } from '@/api/user'
import Cookies from 'js-cookie'
import { encrypt, decrypt } from '@/utils/jsencrypt'
import to from 'await-to-js'

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
	username: '',
	password: '',
	rememberMe: false,
	code: '',
	uuid: ''
})
const formRule = ref({
	username: [
		{
			required: true,
			message: 'Please input username',
			trigger: 'blur'
		}
	],
	password: [
		{
			required: true,
			message: 'Please input password',
			trigger: 'blur'
		}
	],
	code: [
		{
			required: true,
			message: 'Please input code',
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
			username: formModel.value.username,
			password: formModel.value.password,
			code: formModel.value.code,
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
				:model="formModel"
				:rules="formRule"
				class="form"
			>
				<ElFormItem
					prop="username"
					label=""
				>
					<ElInput
						v-model.trim="formModel.username"
						type="text"
						clearable
						:prefix-icon="User"
						placeholder="Username"
						class="h-9.5"
						autocomplete="off"
					/>
				</ElFormItem>
				<ElFormItem
					prop="password"
					label=""
				>
					<ElInput
						ref="passwordRef"
						v-model.trim="formModel.password"
						type="password"
						clearable
						:prefix-icon="Lock"
						placeholder="Password"
						autocomplete="off"
						class="h-9.5"
						@keyup.enter="submit"
					/>
				</ElFormItem>

				<ElForm prop="code">
					<div class="flex justify-between mb-4.5">
						<div class="w-63%">
							<ElInput
								v-model="formModel.code"
								auto-complete="off"
								placeholder="验证码"
								class="h-9.5 w-100%"
								@keyup.enter="submit"
							>
								<template #prefix>
									<svg-icon
										icon-class="validCode"
										size="14"
									/>
								</template>
							</ElInput>
						</div>
						<img
							:src="codeImg"
							class="h-9.5 cursor-pointer"
							@click="getCaptchaImage"
						/>
					</div>
				</ElForm>

				<ElFormItem>
					<ElCheckbox v-model="formModel.rememberMe">记住密码</ElCheckbox>
				</ElFormItem>
				<ElButton
					type="primary"
					class="w-full"
					size="large"
					@click="submit"
				>
					登录
				</ElButton>
			</ElForm>
		</div>
	</div>
</template>
