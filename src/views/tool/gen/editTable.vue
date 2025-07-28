<script setup lang="ts">
import BaseInfo from './components/BaseInfo.vue'
import FieldInfo from './components/FieldInfo.vue'
import GenInfo from './components/GenInfo.vue'

const activeName = ref<'baseInfo' | 'fieldInfo' | 'genInfo'>('baseInfo')
</script>

<template>
	<div class="p-3">
		<el-tabs
			v-model="activeName"
			class="demo-tabs"
		>
			<el-tab-pane
				label="基本信息"
				name="baseInfo"
			>
				<BaseInfo />
			</el-tab-pane>

			<el-tab-pane
				label="字段信息"
				name="fieldInfo"
			>
				<FieldInfo />
			</el-tab-pane>

			<el-tab-pane
				label="生成信息"
				name="genInfo"
			>
				<GenInfo />
			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<style scoped></style>
