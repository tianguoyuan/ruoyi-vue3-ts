<script setup lang="ts" name="User">
import dayjs from 'dayjs'
import { ElMessage, type TreeInstance } from 'element-plus'

import { getDicts } from '@/api/system/dict'
import { changeUserStatus, listUser, resetUserPwd, delUser, deptTreeSelect, userExport } from '@/api/system/user'
import FormGenerator from '@/components/FormGenerator/index.vue'
import type { FormConfig } from '@/components/FormGenerator/types'
import { downloadBlobFile } from '@/utils'
import { checkPermission } from '@/utils/permission'

import EditUserDialog from './components/EditUserDialog.vue'
import UserUpload from './components/UserUpload.vue'

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
	api: listUser,
	fields: [
		{
			label: '用户名称',
			placeholder: '请输入用户名称',
			prop: 'userName',
			span: 8,
			type: 'input'
		},
		{
			label: '手机号码',
			placeholder: '请输入手机号码',
			prop: 'phonenumber',
			span: 8,
			type: 'input'
		},
		{
			label: '状态',
			options: sysNormalDisable as unknown as any[],
			prop: 'status',
			span: 8,
			type: 'select'
		},
		{
			dateType: 'daterange',
			endPlaceholder: '结束日期',
			label: '创建时间',
			prop: 'daterange',
			span: 8,
			startPlaceholder: '开始日期',
			type: 'date-picker'
		}
	],
	labelWidth: '80px',
	leftButtons: [
		{
			event: 'handleAdd',
			icon: 'Plus',
			label: '新增',
			plain: true,
			show: checkPermission(['system:user:add']),
			type: 'primary'
		},

		{
			disabled: single as unknown as boolean,
			event: 'handleUpdate',
			icon: 'Edit',
			label: '修改',
			plain: true,
			show: checkPermission(['system:user:edit']),
			type: 'success'
		},

		{
			disabled: multiple as unknown as boolean,
			event: 'handleDelete',
			icon: 'Delete',
			label: '删除',
			plain: true,
			show: checkPermission(['system:user:remove']),
			type: 'danger'
		},

		{
			event: 'handleImport',
			icon: 'Upload',
			label: '导入',
			plain: true,
			show: checkPermission(['system:user:import']),
			type: 'info'
		},

		{
			event: 'handleExport',
			icon: 'Download',
			label: '导出',
			plain: true,
			show: checkPermission(['system:user:export']),
			type: 'warning'
		}
	],

	span: 6,
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
			format: v => dayjs(v).format('YYYY-MM-DD hh:mm:ss'),
			label: '创建时间',
			prop: 'createTime',
			width: '160px'
		},
		{
			custom: true,
			label: '操作',
			prop: '',
			tableEditBtn: [
				{
					event: 'handleUpdate',
					icon: 'Edit',
					link: true,
					show: row => checkPermission(['system:user:edit']) && row.userId !== 1,
					tip: '修改',
					type: 'primary'
				},

				{
					event: 'handleDelete',
					icon: 'Delete',
					link: true,
					show: row => checkPermission(['system:user:remove']) && row.userId !== 1,
					tip: '删除',
					type: 'primary'
				},

				{
					event: 'handleResetPwd',
					icon: 'Key',
					link: true,
					show: row => checkPermission(['system:user:resetPwd']) && row.userId !== 1,
					tip: '重置密码',
					type: 'primary'
				},

				{
					event: 'handleAuthRole',
					icon: 'CircleCheck',
					link: true,
					show: row => checkPermission(['system:user:edit']) && row.userId !== 1,
					tip: '分配角色',
					type: 'primary'
				}
			],
			width: '140px'
		}
	],
	tableShow: true,
	tableShowSelection: true
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
			cancelButtonText: '取消',
			closeOnClickModal: false,
			confirmButtonText: '确定',
			inputErrorMessage: '用户密码长度必须介于 5 和 20 之间',
			inputPattern: /^.{5,20}$/,
			inputValidator: value => {
				if (/<|>|"|'|\||\\/.test(value)) {
					return '不能包含非法字符：< > " \' \\ |'
				} else {
					return true
				}
			},
			title: '提示'
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
		cancelButtonText: '取消',
		confirmButtonText: '确定',
		message: `是否确认删除用户编号为"${ids}"的数据项？`,
		showCancelButton: true,
		title: '提示',
		type: 'warning'
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
		cancelButtonText: '取消',
		confirmButtonText: '确定',
		message: `确认要"${flagMsg}""${row.userName}"用户吗?`,
		showCancelButton: true,
		title: '提示',
		type: 'warning'
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
		<ElSplitter>
			<ElSplitterPanel size="16%">
				<div class="mr-3">
					<ElInput
						v-model="deptName"
						clearable
						placeholder="请输入部门名称"
						prefixIcon="Search"
						style="margin-bottom: 20px"
					/>

					<ElTree
						ref="deptTreeRef"
						:data="deptOptions"
						defaultExpandAll
						:expandOnClickNode="false"
						:filterNodeMethod="filterNode"
						highlightCurrent
						nodeKey="id"
						:props="{ label: 'label', children: 'children' }"
						@nodeClick="handleNodeClick"
					/>
				</div>
			</ElSplitterPanel>
			<ElSplitterPanel :min="200">
				<div class="px-3">
					<FormGenerator
						ref="formGeneratorRef"
						v-model="formData"
						:config="formConfig"
						@buttonClick="handleButtonClick"
						@selectionChange="selectionChange"
						@tableEditClick="tableEditClick"
					>
						<template #statusSlot="{ row }">
							<ElSwitch
								v-model="row.status"
								activeValue="0"
								inactiveValue="1"
								@click="handleStatusChange(row)"
							/>
						</template>
					</FormGenerator>
				</div>
			</ElSplitterPanel>
		</ElSplitter>
		<UserUpload
			v-model:visible="userUploadOpen"
			@refresh="queryList"
		/>

		<EditUserDialog
			v-model:visible="addUserDialogVisible"
			:enabledDeptOptions="enabledDeptOptions"
			:userId="addUserDialogId"
			@refresh="queryList"
		/>
	</div>
</template>

<style scoped></style>
