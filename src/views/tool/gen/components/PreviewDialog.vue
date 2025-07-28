<script setup lang="ts">
import { copyText } from '@/utils/copyText'
import { ElMessage } from 'element-plus'

const props = defineProps<{
	show: boolean
	previewInfo: Record<string, string>
}>()

const emit = defineEmits<{
	'update:show': [val: boolean]
}>()

const activeName = ref(0)

function copyTextSuccess(val) {
	copyText(val)
	ElMessage.success('复制成功')
}
</script>

<template>
	<ElDialog
		:model-value="props.show"
		title="导入表"
		width="80%"
		:close-on-click-modal="false"
		@update:modelValue="v => emit('update:show', v)"
	>
		<el-tabs v-model="activeName">
			<el-tab-pane
				v-for="(val, key, index) in previewInfo"
				:key="index"
				:label="key.substring(key.lastIndexOf('/') + 1, key.indexOf('.vm'))"
				:name="index"
			>
				<el-link
					underline="always"
					icon="DocumentCopy"
					style="float: right"
					@click="copyTextSuccess(val)"
				>
					&nbsp;复制
				</el-link>
				<pre>{{ val }}</pre>
			</el-tab-pane>
		</el-tabs>
	</ElDialog>
</template>

<style scoped></style>
