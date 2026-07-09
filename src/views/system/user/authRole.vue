<script setup name="AuthRole" lang="ts">
import dayjs from 'dayjs'
import { ElMessage, type TableInstance } from 'element-plus'

import { getAuthRole, updateAuthRole } from '@/api/system/user'
import { useTagsViewStore } from '@/store/tagsView'

const tagsStore = useTagsViewStore()
const route = useRoute()
const router = useRouter()

const loading = ref(true)
const total = ref(0)
const pageNum = ref(1)
const pageSize = ref(10)
const roleIds = ref([])
const roles = ref<any[]>([])
const form = ref({
	nickName: undefined,
	userName: undefined,
	userId: undefined
})
const roleRef = ref<null | TableInstance>(null)
/** 单击选中行数据 */
function clickRow(row) {
	if (checkSelectable(row)) {
		roleRef.value?.toggleRowSelection(row)
	}
}

/** 多选框选中数据 */
function handleSelectionChange(selection) {
	roleIds.value = selection.map(item => item.roleId)
}

/** 保存选中的数据编号 */
function getRowKey(row) {
	return row.roleId
}

// 检查角色状态
function checkSelectable(row) {
	return row.status === '0' ? true : false
}

/** 关闭按钮 */
function close() {
	const obj = {
		path: route.path,
		name: route.name as string
	}
	tagsStore.delView(obj)
	router.back()
}

/** 提交按钮 */
function submitForm() {
	const userId = form.value.userId
	const rIds = roleIds.value.join(',')
	updateAuthRole({
		userId: userId,
		roleIds: rIds
	}).then(() => {
		ElMessage.success('授权成功')
		close()
	})
}

function init() {
	const userId = route.params && route.params.userId
	if (userId) {
		loading.value = true
		getAuthRole(userId).then(response => {
			form.value = response.user
			roles.value = response.roles
			total.value = roles.value.length
			nextTick(() => {
				roles.value.forEach(row => {
					if (row.flag) {
						roleRef.value?.toggleRowSelection(row)
					}
				})
			})
			loading.value = false
		})
	}
}
init()
</script>

<template>
	<div class="app-container">
		<h4 class="text-4 color-#6379bb border-b border-#ddd border-b-solid pb-1 mb-6">基本信息</h4>
		<ElForm
			:model="form"
			label-width="80px"
		>
			<ElRow>
				<ElCol
					:span="8"
					:offset="2"
				>
					<ElFormItem
						label="用户昵称"
						prop="nickName"
					>
						<ElInput
							v-model="form.nickName"
							disabled
						/>
					</ElFormItem>
				</ElCol>
				<ElCol
					:span="8"
					:offset="2"
				>
					<ElFormItem
						label="登录账号"
						prop="userName"
					>
						<ElInput
							v-model="form.userName"
							disabled
						/>
					</ElFormItem>
				</ElCol>
			</ElRow>
		</ElForm>

		<h4 class="text-4 color-#6379bb border-b border-#ddd border-b-solid pb-1 mb-6">角色信息</h4>
		<ElTable
			ref="roleRef"
			v-loading="loading"
			:row-key="getRowKey"
			:data="roles.slice((pageNum - 1) * pageSize, pageNum * pageSize)"
			@rowClick="clickRow"
			@selectionChange="handleSelectionChange"
		>
			<ElTableColumn
				label="序号"
				width="55"
				type="index"
				align="center"
			>
				<template #default="scope">
					<span>{{ (pageNum - 1) * pageSize + scope.$index + 1 }}</span>
				</template>
			</ElTableColumn>
			<ElTableColumn
				type="selection"
				:reserve-selection="true"
				:selectable="checkSelectable"
				width="55"
			/>
			<ElTableColumn
				label="角色编号"
				align="center"
				prop="roleId"
			/>
			<ElTableColumn
				label="角色名称"
				align="center"
				prop="roleName"
			/>
			<ElTableColumn
				label="权限字符"
				align="center"
				prop="roleKey"
			/>
			<ElTableColumn
				label="创建时间"
				align="center"
				prop="createTime"
				width="180"
			>
				<template #default="scope">
					<span>{{ dayjs(scope.row.createTime).format('YYYY-MM-DD hh:mm:ss') }}</span>
				</template>
			</ElTableColumn>
		</ElTable>

		<div class="overflow-hidden">
			<ElPagination
				v-show="total > 0"
				v-model:current-page="pageNum"
				v-model:page-size="pageSize"
				class="float-right mt-3"
				background
				layout="total, sizes, prev, pager, next, jumper"
				:total="total"
			/>
		</div>

		<div class="mt-7 text-center">
			<ElButton
				type="primary"
				@click="submitForm()"
			>
				提交
			</ElButton>
			<ElButton @click="close()">返回</ElButton>
		</div>
	</div>
</template>
