<script setup name="AuthRole" lang="ts">
import { getAuthRole, updateAuthRole } from '@/api/system/user'
import { useTagsViewStore } from '@/store/tagsView'
import dayjs from 'dayjs'
import { ElMessage, type TableInstance } from 'element-plus'

const tagsStore = useTagsViewStore()
const route = useRoute()

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
		<el-form
			:model="form"
			label-width="80px"
		>
			<el-row>
				<el-col
					:span="8"
					:offset="2"
				>
					<el-form-item
						label="用户昵称"
						prop="nickName"
					>
						<el-input
							v-model="form.nickName"
							disabled
						/>
					</el-form-item>
				</el-col>
				<el-col
					:span="8"
					:offset="2"
				>
					<el-form-item
						label="登录账号"
						prop="userName"
					>
						<el-input
							v-model="form.userName"
							disabled
						/>
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>

		<h4 class="text-4 color-#6379bb border-b border-#ddd border-b-solid pb-1 mb-6">角色信息</h4>
		<el-table
			ref="roleRef"
			v-loading="loading"
			:row-key="getRowKey"
			:data="roles.slice((pageNum - 1) * pageSize, pageNum * pageSize)"
			@rowClick="clickRow"
			@selectionChange="handleSelectionChange"
		>
			<el-table-column
				label="序号"
				width="55"
				type="index"
				align="center"
			>
				<template #default="scope">
					<span>{{ (pageNum - 1) * pageSize + scope.$index + 1 }}</span>
				</template>
			</el-table-column>
			<el-table-column
				type="selection"
				:reserve-selection="true"
				:selectable="checkSelectable"
				width="55"
			/>
			<el-table-column
				label="角色编号"
				align="center"
				prop="roleId"
			/>
			<el-table-column
				label="角色名称"
				align="center"
				prop="roleName"
			/>
			<el-table-column
				label="权限字符"
				align="center"
				prop="roleKey"
			/>
			<el-table-column
				label="创建时间"
				align="center"
				prop="createTime"
				width="180"
			>
				<template #default="scope">
					<span>{{ dayjs(scope.row.createTime).format('YYYY-MM-DD hh:mm:ss') }}</span>
				</template>
			</el-table-column>
		</el-table>

		<div class="overflow-hidden">
			<el-pagination
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
			<el-button
				type="primary"
				@click="submitForm()"
			>
				提交
			</el-button>
			<el-button @click="close()">返回</el-button>
		</div>
	</div>
</template>
