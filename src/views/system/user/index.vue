<script setup lang="ts" name="User">
import { changeUserStatus, listUser, resetUserPwd, delUser, deptTreeSelect, userExport } from '@/api/system/user'
import type { FormConfig } from '@/components/FormGenerator/types'
import FormGenerator from '@/components/FormGenerator/index.vue'
import { checkPermission } from '@/utils/permission'
import dayjs from 'dayjs'
import { getDicts } from '@/api/system/dict'
import { ElMessage, type TreeInstance } from 'element-plus'
import { downloadBlobFile } from '@/utils'
import UserUpload from './components/UserUpload.vue'
import EditUserDialog from './components/EditUserDialog.vue'

const router = useRouter()

const sysNormalDisable = ref<API.IGetDictsRes>([])

const formGeneratorRef = ref<InstanceType<typeof FormGenerator> | null>(null)
const formData = ref({
	deptId: ''
})
const selectionList = ref([])
const multiple = computed(() => !(selectionList.value.length >= 1))
const single = computed(() => !(selectionList.value.length === 1))

function selectionChange(v) {
	selectionList.value = v.map(item => item.userId)
}

const formConfig = ref<FormConfig>({
	labelWidth: '80px',
	span: 6,
	fields: [
		{
			type: 'input',
			label: '用户名称',
			prop: 'userName',
			placeholder: '请输入用户名称',
			span: 8
		},
		{
			type: 'input',
			label: '手机号码',
			prop: 'phonenumber',
			placeholder: '请输入手机号码',
			span: 8
		},
		{
			type: 'select',
			label: '状态',
			prop: 'status',
			options: sysNormalDisable as unknown as any[],
			span: 8
		},
		{
			type: 'date-picker',
			label: '创建时间',
			prop: 'daterange',
			startPlaceholder: '开始日期',
			endPlaceholder: '结束日期',
			dateType: 'daterange',
			span: 8
		}
	],
	leftButtons: [
		{
			label: '新增',
			type: 'primary',
			event: 'handleAdd',
			plain: true,
			icon: 'Plus',
			show: checkPermission(['system:user:add'])
		},

		{
			label: '修改',
			type: 'success',
			event: 'handleUpdate',
			plain: true,
			icon: 'Edit',
			show: checkPermission(['system:user:edit']),
			disabled: single as unknown as boolean
		},

		{
			label: '删除',
			type: 'danger',
			event: 'handleDelete',
			plain: true,
			icon: 'Delete',
			show: checkPermission(['system:user:remove']),
			disabled: multiple as unknown as boolean
		},

		{
			label: '导入',
			type: 'info',
			event: 'handleImport',
			plain: true,
			icon: 'Upload',
			show: checkPermission(['system:user:import'])
		},

		{
			label: '导出',
			type: 'warning',
			event: 'handleExport',
			plain: true,
			icon: 'Download',
			show: checkPermission(['system:user:export'])
		}
	],

	tableShow: true,
	api: listUser,
	tableShowSelection: true,
	tableHeader: [
		{
			label: '用户编号',
			prop: 'userId',
			showOverflowTooltip: true
		},
		{
			label: '用户名称',
			prop: 'userName',
			showOverflowTooltip: true
		},
		{
			label: '用户昵称',
			prop: 'nickName',
			showOverflowTooltip: true
		},
		{
			label: '部门',
			prop: 'dept.deptName',
			showOverflowTooltip: true
		},
		{
			label: '手机号码',
			prop: 'phonenumber',
			width: '120px'
		},
		{
			label: '状态',
			prop: 'status',
			slotName: 'statusSlot'
		},
		{
			label: '创建时间',
			prop: 'createTime',
			width: '160px',
			format: v => dayjs(v).format('YYYY-MM-DD hh:mm:ss')
		},
		{
			label: '操作',
			custom: true,
			prop: '',
			width: '140px',
			tableEditBtn: [
				{
					type: 'primary',
					link: true,
					icon: 'Edit',
					tip: '修改',
					event: 'handleUpdate',
					show: row => checkPermission(['system:user:edit']) && row.userId !== 1
				},

				{
					type: 'primary',
					link: true,
					icon: 'Delete',
					tip: '删除',
					event: 'handleDelete',
					show: row => checkPermission(['system:user:remove']) && row.userId !== 1
				},

				{
					type: 'primary',
					link: true,
					icon: 'Key',
					tip: '重置密码',
					event: 'handleResetPwd',
					show: row => checkPermission(['system:user:resetPwd']) && row.userId !== 1
				},

				{
					type: 'primary',
					link: true,
					icon: 'CircleCheck',
					tip: '分配角色',
					event: 'handleAuthRole',
					show: row => checkPermission(['system:user:edit']) && row.userId !== 1
				}
			]
		}
	]
})

const deptTreeRef = ref<null | TreeInstance>(null)
const deptName = ref('')
const deptOptions = ref([])

// 添加修改对话框 - 归属部门
const enabledDeptOptions = ref([])

/** 根据名称筛选部门树 */
watch(deptName, val => {
	deptTreeRef.value?.filter(val)
})

/** 通过条件过滤节点  */
function filterNode(value, data) {
	if (!value) return true
	return data.label.indexOf(value) !== -1
}

/** 节点单击事件 */
function handleNodeClick(data) {
	formData.value.deptId = data.id
	formGeneratorRef.value?.resetPage({ pageNum: 1 })
	formGeneratorRef.value?.queryTableData()
}

const userUploadOpen = ref<boolean>(false)

function queryList() {
	formGeneratorRef.value?.queryTableData()
}

function handleButtonClick(event) {
	if (event === 'handleAdd') {
		// 新增
		handleUpdate('')
	} else if (event === 'handleUpdate') {
		// 修改
		const id = selectionList.value[0]
		handleUpdate(id)
	} else if (event === 'handleDelete') {
		// 删除
		const ids = selectionList.value.join(',')
		handleDelete(ids)
	} else if (event === 'handleImport') {
		// 导入
		userUploadOpen.value = true
	} else if (event === 'handleExport') {
		// 导出
		const pageParams = formGeneratorRef.value?.getPageParams()
		userExport({ ...pageParams }).then(data => {
			downloadBlobFile(data.data, data.filename ? data.filename : `user_${new Date().getTime()}.xlsx`)
		})
	}
}
function tableEditClick(row, btn) {
	const { event } = btn
	if (event === 'handleUpdate') {
		// 修改
		handleUpdate(row.userId + '')
	} else if (event === 'handleDelete') {
		// 删除
		handleDelete(row.userId + '')
	} else if (event === 'handleResetPwd') {
		// 重置密码
		ElMessageBox.prompt(`请输入"${row.userName}"的新密码`, {
			title: '提示',
			confirmButtonText: '确定',
			cancelButtonText: '取消',
			closeOnClickModal: false,
			inputPattern: /^.{5,20}$/,
			inputErrorMessage: '用户密码长度必须介于 5 和 20 之间',
			inputValidator: value => {
				if (/<|>|"|'|\||\\/.test(value)) {
					return '不能包含非法字符：< > " \' \\ |'
				} else {
					return true
				}
			}
		})
			.then(({ value }) => {
				resetUserPwd(row.userId, value).then(() => {
					ElMessage.success(`修改成功，新密码是：${value}`)
				})
			})
			.catch(() => {})
	} else if (event === 'handleAuthRole') {
		// 分配角色
		router.push(`/system/user-auth/role/${row.userId}`)
	}
}

async function handleDelete(ids: string) {
	await ElMessageBox({
		title: '提示',
		type: 'warning',
		message: `是否确认删除用户编号为"${ids}"的数据项？`,
		showCancelButton: true,
		cancelButtonText: '取消',
		confirmButtonText: '确定'
	})

	await delUser(ids)
	queryList()
}

const addUserDialogVisible = ref(false)
const addUserDialogId = ref('')
function handleUpdate(id: string) {
	addUserDialogId.value = id
	addUserDialogVisible.value = true
}
function handleStatusChange(row) {
	const preStatus = row.status === '0' ? '1' : '0'
	const flagMsg = row.status === '0' ? '启用' : '停用'

	ElMessageBox({
		title: '提示',
		type: 'warning',
		message: `确认要"${flagMsg}""${row.userName}"用户吗?`,
		showCancelButton: true,
		cancelButtonText: '取消',
		confirmButtonText: '确定'
	})
		.then(async () => {
			await changeUserStatus(row.userId, row.status)
			ElMessage.success(flagMsg + '成功')

			formGeneratorRef.value?.queryTableData()
		})
		.catch(() => {
			row.status = preStatus
		})
}
/** 查询部门下拉树结构 */
function getDeptTree() {
	deptTreeSelect().then(response => {
		deptOptions.value = response.data
		enabledDeptOptions.value = filterDisabledDept(JSON.parse(JSON.stringify(response.data)))
	})
}
/** 过滤禁用的部门 */
function filterDisabledDept(deptList) {
	return deptList.filter(dept => {
		if (dept.disabled) {
			return false
		}
		if (dept.children && dept.children.length) {
			dept.children = filterDisabledDept(dept.children)
		}
		return true
	})
}
function init() {
	getDeptTree()
	getDicts('sys_normal_disable').then(data => {
		sysNormalDisable.value = data
	})
}
init()
</script>

<template>
	<div class="p-3">
		<el-splitter>
			<el-splitter-panel size="16%">
				<div class="mr-3">
					<el-input
						v-model="deptName"
						placeholder="请输入部门名称"
						clearable
						prefix-icon="Search"
						style="margin-bottom: 20px"
					/>

					<el-tree
						ref="deptTreeRef"
						:data="deptOptions"
						:props="{ label: 'label', children: 'children' }"
						:expand-on-click-node="false"
						:filter-node-method="filterNode"
						node-key="id"
						highlight-current
						default-expand-all
						@nodeClick="handleNodeClick"
					/>
				</div>
			</el-splitter-panel>
			<el-splitter-panel :min="200">
				<div class="px-3">
					<FormGenerator
						ref="formGeneratorRef"
						v-model="formData"
						:config="formConfig"
						@buttonClick="handleButtonClick"
						@tableEditClick="tableEditClick"
						@selectionChange="selectionChange"
					>
						<template #statusSlot="{ row }">
							<el-switch
								v-model="row.status"
								active-value="0"
								inactive-value="1"
								@click="handleStatusChange(row)"
							/>
						</template>
					</FormGenerator>
				</div>
			</el-splitter-panel>
		</el-splitter>
		<UserUpload
			v-model:visible="userUploadOpen"
			@refresh="queryList"
		/>

		<EditUserDialog
			v-model:visible="addUserDialogVisible"
			:user-id="addUserDialogId"
			:enabled-dept-options="enabledDeptOptions"
			@refresh="queryList"
		/>
	</div>
</template>

<style scoped></style>
