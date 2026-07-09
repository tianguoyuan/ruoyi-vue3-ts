<script setup lang="ts">
import { ElMessage } from 'element-plus'

import { copyText } from '@/utils/copyText'

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
		:closeOnClickModal="false"
		:modelValue="props.show"
		title="导入表"
		width="80%"
		@update:modelValue="v => emit('update:show', v)"
	>
		<ElTabs v-model="activeName">
			<ElTabPane
				v-for="(val, key, index) in previewInfo"
				:key="index"
				:label="key.substring(key.lastIndexOf('/') + 1, key.indexOf('.vm'))"
				:name="index"
			>
				<ElLink
					icon="DocumentCopy"
					style="float: right"
					underline="always"
					@click="copyTextSuccess(val)"
				>
					&nbsp;复制
				</ElLink>
				<pre>{{ val }}</pre>
			</ElTabPane>
		</ElTabs>
	</ElDialog>
</template>

<style scoped></style>
