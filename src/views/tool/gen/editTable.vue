<script setup lang="ts">
import { ElMessage } from 'element-plus'

import { getGenTable } from '@/api/system/dict'
import { updateGenTable } from '@/api/tool/genEdit'
import { useTagsViewStore } from '@/store/tagsView'

import BaseInfo from './components/BaseInfo.vue'
import FieldInfo from './components/FieldInfo.vue'
import GenInfo from './components/GenInfo.vue'

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
		name: route.name as string,
		path: route.path
	})

	router.back()
}
</script>

<template>
	<div class="p-3 relative h-full">
		<ElTabs
			v-model="activeName"
			class="demo-tabs"
		>
			<ElTabPane
				label="基本信息"
				name="0"
			>
				<BaseInfo
					ref="baseInfoRef"
					:info="info"
				/>
			</ElTabPane>

			<ElTabPane
				label="字段信息"
				name="1"
			>
				<FieldInfo :columns="columns" />
			</ElTabPane>

			<ElTabPane
				label="生成信息"
				name="2"
			>
				<GenInfo
					ref="genInfoRef"
					:info="info"
					:tables="tables"
				/>
			</ElTabPane>
		</ElTabs>
		<div class="text-center m-auto py-3 shadow-2xl">
			<ElButton
				type="primary"
				@click="submitForm()"
			>
				提交
			</ElButton>
			<ElButton @click="pageBack()">返回</ElButton>
		</div>
	</div>
</template>

<style scoped></style>
