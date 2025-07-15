<script setup lang="ts" name="Home">
import { useStorage } from '@vueuse/core'

const obj = useStorage('__test', 1)
const set = () => {
	obj.value += 1
}
const edit = () => {
	obj.value = undefined
}
const get = () => {
	console.log(obj.value)
}

const msg = ref('')
</script>

<template>
	<div class="app-container">
		<h2>home page{{ obj }}</h2>
		<div class="h-3" />
		<ElInput v-model="msg" />
		<div class="h-3" />
		<ElButton
			type="primary"
			@click="set"
		>
			设置
		</ElButton>
		<ElButton
			type="danger"
			@click="edit"
		>
			修改
		</ElButton>
		<ElButton
			type="success"
			@click="get"
		>
			获取
		</ElButton>
		<div
			v-for="item in 10"
			:key="item"
			class="bg-gray h-10 m-5"
		/>
	</div>
</template>

<style scoped></style>
