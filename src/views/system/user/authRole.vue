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
	userId: undefined,
	userName: undefined
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
		name: route.name as string,
		path: route.path
	}
	tagsStore.delView(obj)
	router.back()
}

/** 提交按钮 */
function submitForm() {
	const userId = form.value.userId
	const rIds = roleIds.value.join(',')
	updateAuthRole({
		roleIds: rIds,
		userId: userId
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
	<div class="p-5">
		<h4 class="text-4 color-#6379bb border-b border-#ddd border-b-solid pb-1 mb-6">基本信息</h4>
		<ElForm
			labelWidth="80px"
			:model="form"
		>
			<ElRow>
				<ElCol
					:offset="2"
					:span="8"
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
					:offset="2"
					:span="8"
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
			:data="roles.slice((pageNum - 1) * pageSize, pageNum * pageSize)"
			:rowKey="getRowKey"
			@rowClick="clickRow"
			@selectionChange="handleSelectionChange"
		>
			<ElTableColumn
				align="center"
				label="序号"
				type="index"
				width="55"
			>
				<template #default="scope">
					<span>{{ (pageNum - 1) * pageSize + scope.$index + 1 }}</span>
				</template>
			</ElTableColumn>
			<ElTableColumn
				:reserveSelection="true"
				:selectable="checkSelectable"
				type="selection"
				width="55"
			/>
			<ElTableColumn
				align="center"
				label="角色编号"
				prop="roleId"
			/>
			<ElTableColumn
				align="center"
				label="角色名称"
				prop="roleName"
			/>
			<ElTableColumn
				align="center"
				label="权限字符"
				prop="roleKey"
			/>
			<ElTableColumn
				align="center"
				label="创建时间"
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
				v-model:currentPage="pageNum"
				v-model:pageSize="pageSize"
				background
				class="float-right mt-3"
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
