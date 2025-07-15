<script setup lang="ts">
import { ref, watch } from 'vue'
import { User, Lock } from '@element-plus/icons-vue'
import { useRoute, useRouter } from 'vue-router'
import type { FormInstance } from 'element-plus'
import { useUserStore } from '@/store/user'

const route = useRoute()
const router = useRouter()
const redirect = ref<string | null>(null)
const otherQuery = ref({})
const getOtherQuery = function (query) {
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
	password: ''
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
	]
})
const formRef = ref<null | FormInstance>(null)
const userStore = useUserStore()
const submit = async () => {
	await formRef.value?.validate()
	await userStore.login(formModel.value)
	router.push({
		path: redirect.value || '/',
		query: otherQuery.value
	})
}
</script>

<template>
	<div class="h-screen w-screen bg-#2d3a4b overflow-auto select-none">
		<div class="w-md mt-1/10 mx-auto">
			<ElForm
				ref="formRef"
				:model="formModel"
				:rules="formRule"
				class="form"
			>
				<div class="color-white text-center font-bold text-3xl mb-5">Login Form</div>
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
						@keyup.enter="submit"
					/>
				</ElFormItem>
				<ElButton
					type="primary"
					class="mt-3 w-full"
					@click="submit"
				>
					login
				</ElButton>
			</ElForm>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.form {
	::v-deep(label.el-form-item__label) {
		color: #fff;
	}
	::v-deep(div.el-input__wrapper) {
		border: 1px solid rgba(255, 255, 255, 0.1);
		background: rgba(0, 0, 0, 0.1);
		border-radius: 5px;
		color: #454545;
		box-shadow: none;

		input {
			background-color: transparent;
			border: 0;
			color: #fff;
		}
		input:-webkit-autofill {
			-webkit-box-shadow: 0 0 0px 1000px #283443 inset !important;
			box-shadow: 0 0 0px 1000px #283443 inset !important;
			-webkit-text-fill-color: #fff !important;
		}
	}
}
</style>
