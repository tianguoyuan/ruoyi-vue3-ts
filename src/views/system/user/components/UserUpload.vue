<script setup lang="ts">
import { USER_UPLOAD_URL, userImportTemplate } from '@/api/system/user'
import { downloadBlobFile } from '@/utils'
import storage from '@/utils/storage'
import { ElAlert, type UploadInstance } from 'element-plus'
import { UploadFilled } from '@element-plus/icons-vue'

const props = defineProps<{
	visible: boolean
}>()
const emits = defineEmits<{
	'update:visible': [v: boolean]
	refresh: []
}>()

const uploadRef = ref<null | UploadInstance>(null)

const upload = ref({
	// 是否显示弹出层（用户导入）
	open: false,
	// 弹出层标题（用户导入）
	title: '',
	// 是否禁用上传
	isUploading: false,
	// 是否更新已经存在的用户数据
	updateSupport: false,
	// 设置上传的请求头部
	headers: { Authorization: 'Bearer ' + storage.get('token') },
	// 上传的地址
	url: USER_UPLOAD_URL
})

function handleFileUploadProgress() {
	upload.value.isUploading = true
}

function handleFileSuccess(response, file) {
	upload.value.open = false
	upload.value.isUploading = false
	uploadRef.value?.handleRemove(file)

	ElMessageBox.alert(
		"<div style='overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;'>" + response.msg + '</div>',
		'导入结果',
		{
			confirmButtonText: '确定',
			dangerouslyUseHTMLString: true
		}
	)
	emits('refresh')
}

function importTemplate() {
	userImportTemplate().then(data => {
		downloadBlobFile(data.data, data.filename ? data.filename : `user_template_${new Date().getTime()}.xlsx`)
	})
}

function submitFileForm() {
	uploadRef.value?.submit()
}
</script>

<template>
	<el-dialog
		:model-value="props.visible"
		title="用户导入"
		width="400px"
		append-to-body
		@update:modelValue="v => emits('update:visible', v)"
	>
		<el-upload
			ref="uploadRef"
			:limit="1"
			accept=".xlsx, .xls"
			:headers="upload.headers"
			:action="upload.url + '?updateSupport=' + upload.updateSupport"
			:disabled="upload.isUploading"
			:on-progress="handleFileUploadProgress"
			:on-success="handleFileSuccess"
			:auto-upload="false"
			drag
		>
			<el-icon class="el-icon--upload"><UploadFilled /></el-icon>
			<div class="el-upload__text">将文件拖到此处，或<em> 点击上传</em></div>
			<template #tip>
				<div class="el-upload__tip text-center">
					<div class="el-upload__tip">
						<el-checkbox
							v-model="upload.updateSupport"
							class="align-middle"
						/>
						<span class="align-middle ml-1">是否更新已经存在的用户数据</span>
					</div>
					<span>仅允许导入xls、xlsx格式文件。</span>
					<el-link
						type="primary"
						underline="always"
						style="font-size: 12px; vertical-align: baseline"
						@click="importTemplate"
					>
						下载模板
					</el-link>
				</div>
			</template>
		</el-upload>
		<template #footer>
			<div class="dialog-footer">
				<el-button
					type="primary"
					@click="submitFileForm"
				>
					确 定
				</el-button>
				<el-button @click="emits('update:visible', false)">取 消</el-button>
			</div>
		</template>
	</el-dialog>
</template>

<style scoped></style>
