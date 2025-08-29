<script setup lang="ts">
import { VueCropper } from 'vue-cropper'
import { uploadAvatar } from '@/api/system/user'
import { useUserStore } from '@/store/user'
import { ElMessage } from 'element-plus'
import { Upload } from '@element-plus/icons-vue'
import 'vue-cropper/dist/index.css'

const userStore = useUserStore()
const open = ref(false)
const visible = ref(false)
const title = ref('修改头像')

const cropperRef = ref<any>(null)

//图片裁剪数据
const options = ref({
	img: userStore.userInfo.avatar, // 裁剪图片的地址
	autoCrop: true, // 是否默认生成截图框
	autoCropWidth: 200, // 默认生成截图框宽度
	autoCropHeight: 200, // 默认生成截图框高度
	fixedBox: true, // 固定截图框大小 不允许改变
	outputType: 'png', // 默认生成截图为PNG格式
	filename: 'avatar', // 文件名称
	previews: {
		url: undefined,
		img: undefined
	} //预览数据
})

/** 编辑头像 */
function editCropper() {
	open.value = true
}

/** 打开弹出层结束时的回调 */
function modalOpened() {
	visible.value = true
}

/** 向左旋转 */
function rotateLeft() {
	cropperRef.value?.rotateLeft()
}

/** 向右旋转 */
function rotateRight() {
	cropperRef.value?.rotateRight()
}

/** 图片缩放 */
function changeScale(num) {
	num = num || 1
	cropperRef.value?.changeScale(num)
}

/** 上传预处理 */
function beforeUpload(file) {
	if (file.type.indexOf('image/') === -1) {
		ElMessage.error('文件格式错误，请上传图片类型,如：JPG，PNG后缀的文件。')
	} else {
		const reader = new FileReader()
		reader.readAsDataURL(file)
		reader.onload = () => {
			options.value.img = reader.result as string
			options.value.filename = file.name
		}
	}
}

/** 上传图片 */
function uploadImg() {
	cropperRef.value?.getCropBlob(data => {
		let formData = new FormData()
		formData.append('avatarfile', data, options.value.filename)
		uploadAvatar(formData).then(response => {
			open.value = false
			options.value.img = import.meta.env.VITE_API_URL + response.imgUrl
			console.log('options.value.img', options.value.img)

			userStore.setAvatar(options.value.img)
			ElMessage.success('修改成功')
			visible.value = false
		})
	})
}

/** 实时预览 */
function realTime(data) {
	options.value.previews = data
}

/** 关闭窗口 */
function closeDialog() {
	options.value.img = userStore.userInfo.avatar
	visible.value = false
}
</script>

<template>
	<div
		class="user-info-head"
		@click="editCropper()"
	>
		<img
			:src="options.img"
			title="点击上传头像"
			class="h-full w-full rounded-full"
		/>
		<el-dialog
			v-model="open"
			:title="title"
			width="800px"
			append-to-body
			@opened="modalOpened"
			@close="closeDialog"
		>
			<el-row>
				<el-col
					:xs="24"
					:md="12"
					:style="{ height: '350px' }"
				>
					<VueCropper
						v-if="visible"
						ref="cropperRef"
						:img="options.img"
						:info="true"
						:auto-crop="options.autoCrop"
						:auto-crop-width="options.autoCropWidth"
						:auto-crop-height="options.autoCropHeight"
						:fixed-box="options.fixedBox"
						:output-type="options.outputType"
						@realTime="realTime"
					/>
				</el-col>
				<el-col
					:xs="24"
					:md="12"
					:style="{ height: '350px' }"
				>
					<div class="avatar-upload-preview">
						<img
							:src="options.previews.url"
							:style="options.previews.img"
						/>
					</div>
				</el-col>
			</el-row>
			<br />
			<el-row>
				<el-col
					:lg="2"
					:md="2"
				>
					<el-upload
						action="#"
						:http-request="undefined"
						:show-file-list="false"
						:before-upload="beforeUpload"
					>
						<el-button>
							选择
							<el-icon class="el-icon--right"><Upload /></el-icon>
						</el-button>
					</el-upload>
				</el-col>
				<el-col
					:lg="{ span: 1, offset: 2 }"
					:md="2"
				>
					<el-button
						icon="Plus"
						@click="changeScale(1)"
					/>
				</el-col>
				<el-col
					:lg="{ span: 1, offset: 1 }"
					:md="2"
				>
					<el-button
						icon="Minus"
						@click="changeScale(-1)"
					/>
				</el-col>
				<el-col
					:lg="{ span: 1, offset: 1 }"
					:md="2"
				>
					<el-button
						icon="RefreshLeft"
						@click="rotateLeft()"
					/>
				</el-col>
				<el-col
					:lg="{ span: 1, offset: 1 }"
					:md="2"
				>
					<el-button
						icon="RefreshRight"
						@click="rotateRight()"
					/>
				</el-col>
				<el-col
					:lg="{ span: 2, offset: 6 }"
					:md="2"
				>
					<el-button
						type="primary"
						@click="uploadImg()"
					>
						提 交
					</el-button>
				</el-col>
			</el-row>
		</el-dialog>
	</div>
</template>

<style lang="scss" scoped>
.user-info-head {
	position: relative;
	display: inline-block;
	width: 120px;
	height: 120px;
}
.user-info-head:hover::after {
	position: absolute;
	inset: 0;
	font-size: 24px;
	font-style: normal;
	line-height: 120px;
	color: #eeeeee;
	text-align: center;
	cursor: pointer;
	content: '+';
	background: rgb(0 0 0 / 50%);
	border-radius: 50%;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
}
.avatar-upload-preview {
	position: absolute;
	top: 50%;
	width: 200px;
	height: 200px;
	overflow: hidden;
	border-radius: 50%;
	box-shadow: 0 0 4px #cccccc;
	transform: translate(50%, -50%);
}
</style>
