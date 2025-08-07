<script setup lang="ts">
import { getGenTable } from '@/api/system/dict'
import BaseInfo from './components/BaseInfo.vue'
import FieldInfo from './components/FieldInfo.vue'
import GenInfo from './components/GenInfo.vue'
import { ElMessage } from 'element-plus'
import { updateGenTable } from '@/api/tool/genEdit'
import { useTagsViewStore } from '@/store/tagsView'

const router = useRouter()
const route = useRoute()
type IActiveName = '0' | '1' | '2'
const activeName = ref<IActiveName>((route.query.pageNum as IActiveName) || '0')

const info = ref<API.IGetGenTableRes['data']['info']>({
	className: '',
	functionAuthor: '',
	remark: '',
	tableComment: '',
	tableName: ''
})
const columns = ref<any[]>([])
const tables = ref<any[]>([])
function init() {
	// 获取表详细信息
	getGenTable(route.params.tableId as string).then(({ data }) => {
		info.value = data.info
		columns.value = data.rows
		tables.value = data.tables
	})
}
init()

const baseInfoRef = ref<InstanceType<typeof BaseInfo> | null>(null)
const genInfoRef = ref<InstanceType<typeof GenInfo> | null>(null)
async function submitForm() {
	Promise.all([baseInfoRef.value?.validate(), genInfoRef.value?.validate()])
		.then(() => {
			const baseInfoData = baseInfoRef.value?.getData()
			const genInfoData = genInfoRef.value?.getData()
			const params = {
				...info.value,
				...baseInfoData,
				...genInfoData,
				columns: columns.value
			}

			updateGenTable(params).then(res => {
				ElMessage.success(res.msg)
				if (res.code === 200) {
					pageBack()
				}
			})
		})
		.catch(() => {
			ElMessage.error('表单校验未通过，请重新检查提交内容')
		})
}

const tagsViewStore = useTagsViewStore()
function pageBack() {
	tagsViewStore.delView({
		path: route.path,
		name: route.name as string
	})

	router.back()
}
</script>

<template>
	<div class="p-3 relative h-full">
		<el-tabs
			v-model="activeName"
			class="demo-tabs"
		>
			<el-tab-pane
				label="基本信息"
				name="0"
			>
				<BaseInfo
					ref="baseInfoRef"
					:info="info"
				/>
			</el-tab-pane>

			<el-tab-pane
				label="字段信息"
				name="1"
			>
				<FieldInfo :columns="columns" />
			</el-tab-pane>

			<el-tab-pane
				label="生成信息"
				name="2"
			>
				<GenInfo
					ref="genInfoRef"
					:info="info"
					:tables="tables"
				/>
			</el-tab-pane>
		</el-tabs>
		<div class="text-center m-auto py-3 shadow-2xl">
			<el-button
				type="primary"
				@click="submitForm()"
			>
				提交
			</el-button>
			<el-button @click="pageBack()">返回</el-button>
		</div>
	</div>
</template>

<style scoped></style>
