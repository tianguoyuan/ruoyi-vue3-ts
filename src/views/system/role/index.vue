<script setup lang="ts" name="Role">
import { listUser } from '@/api/system/user'
import type { FormConfig } from '@/components/FormGenerator/types'
import { checkPermission } from '@/utils/permission'
import FormGenerator from '@/components/FormGenerator/index.vue'
import dayjs from 'dayjs'
import { getDicts } from '@/api/system/dict'
import {
	addRole,
	changeRoleStatus,
	dataScope,
	delRole,
	deptTreeSelect,
	getRole,
	listRole,
	roleExport,
	updateRole
} from '@/api/system/role'
import { downloadBlobFile } from '@/utils'
import type { TreeInstance } from 'element-plus'
import { roleMenuTreeselect, treeselect } from '@/api/system/menu'

const router = useRouter()
const formGeneratorRef = ref<InstanceType<typeof FormGenerator> | null>(null)
const formData = ref({
	deptId: ''
})
const selectionList = ref([])
const multiple = computed(() => !(selectionList.value.length >= 1))
const single = computed(() => !(selectionList.value.length === 1))

function selectionChange(v) {
	selectionList.value = v.map(item => item.roleId)
}

const sysNormalDisable = ref<API.IGetDictsRes>([])

const formConfig = ref<FormConfig>({
	labelWidth: '80px',
	span: 6,
	fields: [
		{
			type: 'input',
			label: '角色名称',
			prop: 'roleName',
			placeholder: '请输入角色名称'
		},

		{
			type: 'input',
			label: '权限字符',
			prop: 'roleKey',
			placeholder: '请输入权限字符'
		},

		{
			type: 'select',
			label: '状态',
			prop: 'roleName',
			placeholder: '请选择状态',
			options: sysNormalDisable as unknown as any[]
		},

		{
			type: 'date-picker',
			dateType: 'daterange',
			label: '创建时间',
			prop: 'daterange',
			placeholder: '请选择创建时间'
		}
	],
	leftButtons: [
		{
			label: '新增',
			type: 'primary',
			event: 'handleAdd',
			plain: true,
			icon: 'Plus',
			show: checkPermission(['system:role:add'])
		},

		{
			label: '修改',
			type: 'success',
			event: 'handleUpdate',
			plain: true,
			icon: 'Edit',
			show: checkPermission(['system:role:edit']),
			disabled: single as unknown as boolean
		},

		{
			label: '删除',
			type: 'danger',
			event: 'handleDelete',
			plain: true,
			icon: 'Delete',
			show: checkPermission(['system:role:remove']),
			disabled: multiple as unknown as boolean
		},

		{
			label: '导出',
			type: 'warning',
			event: 'handleExport',
			plain: true,
			icon: 'Download',
			show: checkPermission(['system:role:export'])
		}
	],

	tableShow: true,
	api: listRole,
	tableShowSelection: true,
	tableHeader: [
		{
			label: '角色编号',
			prop: 'roleId',
			showOverflowTooltip: true
		},
		{
			label: '角色名称',
			prop: 'roleName',
			showOverflowTooltip: true
		},
		{
			label: '权限字符',
			prop: 'roleKey',
			showOverflowTooltip: true
		},
		{
			label: '显示顺序',
			prop: 'roleSort',
			showOverflowTooltip: true
		},
		{
			label: '状态',
			prop: 'status',
			slotName: 'statusSlot'
		},
		{
			label: '创建时间',
			prop: 'createTime',
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
					show: row => checkPermission(['system:role:edit']) && row.userId !== 1
				},

				{
					type: 'primary',
					link: true,
					icon: 'Delete',
					tip: '删除',
					event: 'handleDelete',
					show: row => checkPermission(['system:role:remove']) && row.userId !== 1
				},

				{
					type: 'primary',
					link: true,
					icon: 'CircleCheck',
					tip: '数据权限',
					event: 'handleDataScope',
					show: row => checkPermission(['system:role:edit']) && row.userId !== 1
				},

				{
					type: 'primary',
					link: true,
					icon: 'User',
					tip: '分配用户',
					event: 'handleAuthRole',
					show: row => checkPermission(['system:role:edit']) && row.userId !== 1
				}
			]
		}
	]
})

const dataScopeDialogVisible = ref(false)
const dataScopeDialogForm = ref({
	roleName: '',
	roleKey: '',
	dataScope: '',
	deptCheckStrictly: true,
	menuCheckStrictly: true,
	roleId: ''
})
const dataScopeDialogDeptTree = ref([
	{
		value: '1',
		label: '全部数据权限'
	},
	{
		value: '2',
		label: '自定数据权限'
	},
	{
		value: '3',
		label: '本部门数据权限'
	},
	{
		value: '4',
		label: '本部门及以下数据权限'
	},
	{
		value: '5',
		label: '仅本人数据权限'
	}
])
const deptOptions = ref<any[]>([])
const deptExpand = ref(true)
const deptNodeAll = ref(false)

const menuOptions = ref<any[]>([])
const menuRef = ref<any>(null)
const deptRef = ref<TreeInstance | null>(null)
/** 树权限（展开/折叠）*/
function handleCheckedTreeExpand(value, type) {
	if (type === 'menu') {
		let treeList = menuOptions.value
		for (let i = 0; i < treeList.length; i++) {
			menuRef.value.store.nodesMap[treeList[i].id].expanded = value
		}
	} else if (type === 'dept') {
		let treeList = deptOptions.value
		for (let i = 0; i < treeList.length; i++) {
			if (deptRef.value) {
				deptRef.value.store.nodesMap[treeList[i].id].expanded = value
			}
		}
	}
}
/** 树权限（全选/全不选） */
function handleCheckedTreeNodeAll(value, type) {
	if (type === 'menu') {
		menuRef.value.setCheckedNodes(value ? menuOptions.value : [])
	} else if (type === 'dept') {
		if (deptRef.value) {
			deptRef.value.setCheckedNodes(value ? deptOptions.value : [])
		}
	}
}
/** 树权限（父子联动） */
function handleCheckedTreeConnect(value, type) {
	if (type === 'menu') {
		dataScopeDialogForm.value.menuCheckStrictly = value ? true : false
	} else if (type === 'dept') {
		dataScopeDialogForm.value.deptCheckStrictly = value ? true : false
	}
}

function dataScopeDialogClose() {
	dataScopeDialogVisible.value = false
}
/** 所有部门节点数据 */
function getDeptAllCheckedKeys() {
	if (!deptRef.value) return
	// 目前被选中的部门节点
	let checkedKeys = deptRef.value.getCheckedKeys()
	// 半选中的部门节点
	let halfCheckedKeys = deptRef.value.getHalfCheckedKeys()
	checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys)
	return checkedKeys
}
function dataScopeDialogSubmit() {
	const params = {
		...dataScopeDialogForm.value,
		deptIds: getDeptAllCheckedKeys()
	}
	dataScope(params).then(() => {
		ElMessage.success('修改成功')
		dataScopeDialogClose()
	})
}

// 表单按钮
function handleButtonClick(event: string) {
	if (event === 'handleAdd') {
		// 新增
		handleUpdate()
	} else if (event === 'handleUpdate') {
		// 修改
		handleUpdate(selectionList.value[0])
	} else if (event === 'handleDelete') {
		// 删除
		const ids = selectionList.value.join(',')
		handleDelete(ids)
	} else if (event === 'handleExport') {
		// 导出
		const pageParams = formGeneratorRef.value?.getPageParams()
		roleExport(pageParams).then(data => {
			downloadBlobFile(data.data, data.filename ? data.filename : `role_${new Date().getTime()}.xlsx`)
		})
	}
}
// 表格按钮
function tableEditClick(row, btn) {
	const { event } = btn
	if (event === 'handleUpdate') {
		// 修改
		handleUpdate(row.roleId)
	} else if (event === 'handleDelete') {
		// 删除
		handleDelete(row.roleId)
	} else if (event === 'handleDataScope') {
		// 数据权限
		Promise.all([deptTreeSelect(row.roleId), getRole(row.roleId)]).then(([data1, { data }]) => {
			// 弹窗表单
			dataScopeDialogForm.value.roleName = data.roleName
			dataScopeDialogForm.value.roleKey = data.roleKey
			dataScopeDialogForm.value.dataScope = data.dataScope
			dataScopeDialogForm.value.roleId = data.roleId
			dataScopeDialogVisible.value = true

			deptOptions.value = data1.depts
			nextTick(() => {
				if (deptRef.value) {
					deptRef.value.setCheckedKeys(data1.checkedKeys)
				}
			})
		})
	} else if (event === 'handleAuthRole') {
		// 分配用户
		router.push('/system/role-auth/user/' + row.roleId)
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
	await delRole(ids)
	ElMessage.success('删除成功')
	formGeneratorRef.value?.queryTableData()
}

function handleStatusChange(row) {
	const preStatus = row.status === '0' ? '1' : '0'
	const flagMsg = row.status === '0' ? '启用' : '停用'

	ElMessageBox({
		title: '提示',
		type: 'warning',
		message: `确认要"${flagMsg}""${row.roleId}"用户吗?`,
		showCancelButton: true,
		cancelButtonText: '取消',
		confirmButtonText: '确定'
	})
		.then(async () => {
			await changeRoleStatus(row.roleId, row.status)
			ElMessage.success(flagMsg + '成功')

			formGeneratorRef.value?.queryTableData()
		})
		.catch(() => {
			row.status = preStatus
		})
}
/** 所有菜单节点数据 */
function getMenuAllCheckedKeys() {
	// 目前被选中的菜单节点
	let checkedKeys = menuRef.value.getCheckedKeys()
	// 半选中的菜单节点
	let halfCheckedKeys = menuRef.value.getHalfCheckedKeys()
	checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys)
	return checkedKeys
}

const dialogVisible = ref(false)
const dialogFormGeneratorRef = ref<InstanceType<typeof FormGenerator> | null>(null)
const dialogId = ref('')
const initDialogFormData = {
	menuCheckStrictly: true,
	roleId: '',
	menuIds: '',

	roleName: '',
	roleKey: '',
	roleSort: 0,
	status: '0',
	remark: ''
}
const dialogFormData = ref({ ...initDialogFormData })
const menuExpand = ref(false)
const menuNodeAll = ref(false)

const dialogFormConfig = ref<FormConfig>({
	labelWidth: '100px',
	span: 24,
	formRules: {
		roleName: [
			{
				required: true,
				message: '请输入角色名称'
			}
		],
		roleKey: [
			{
				required: true,
				message: '请输入权限字符'
			}
		],
		roleSort: [
			{
				required: true,
				message: '请输入角色顺序'
			}
		]
	},
	fields: [
		{
			type: 'input',
			label: '角色名称',
			prop: 'roleName',
			placeholder: '请输入角色名称'
		},

		{
			type: 'input',
			label: '权限字符',
			prop: 'roleKey',
			placeholder: '请输入权限字符'
		},
		{
			type: 'input-number',
			label: '角色顺序',
			prop: 'roleSort',
			min: 0,
			controlsPosition: 'right'
		},
		{
			type: 'radio',
			label: '状态',
			prop: 'status',
			options: sysNormalDisable as unknown as any[]
		},
		{
			type: 'slot',
			slotName: 'expandedSlot',
			prop: 'expanded',
			label: '菜单权限'
		},
		{
			type: 'textarea',
			rows: 3,
			label: '备注',
			prop: 'remark',
			placeholder: '请输入备注'
		}
	],
	buttons: [],
	tableShow: false,
	tableInitQueryRefuse: true
})

// 新增|编辑
async function handleUpdate(id = '') {
	dialogVisible.value = true
	await nextTick()
	dialogFormData.value = { ...initDialogFormData }
	setTimeout(() => dialogFormGeneratorRef.value?.clearValidate())

	if (!id) {
		const { data } = await treeselect()
		menuOptions.value = data
		return
	} else {
		const { checkedKeys, menus } = await roleMenuTreeselect(id)
		menuOptions.value = menus
		getRole(id).then(({ data }) => {
			dialogFormData.value = data
			dialogFormData.value.roleSort = Number(data.roleSort)

			checkedKeys.forEach(v => menuRef.value.setChecked(v, true, false))
		})
	}
}

async function dialogCancel() {
	dialogVisible.value = false
}
async function dialogSubmit() {
	await dialogFormGeneratorRef.value?.validate()
	if (dialogFormData.value.roleId) {
		dialogFormData.value.menuIds = getMenuAllCheckedKeys()
		updateRole(dialogFormData.value).then(response => {
			ElMessage.success('修改成功')
			dialogVisible.value = false
			formGeneratorRef.value?.queryTableData()
		})
	} else {
		dialogFormData.value.menuIds = getMenuAllCheckedKeys()
		addRole(dialogFormData.value).then(response => {
			ElMessage.success('新增成功')
			dialogVisible.value = false
			formGeneratorRef.value?.queryTableData()
		})
	}
}

function init() {
	getDicts('sys_normal_disable').then(data => {
		sysNormalDisable.value = data
	})
}
init()
</script>

<template>
	<div class="p-3">
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

		<!-- 分配数据权限 -->
		<ElDialog
			v-model="dataScopeDialogVisible"
			title="分配数据权限"
			width="500px"
			:close-on-click-modal="false"
			@close="dataScopeDialogClose"
		>
			<ElForm :model="dataScopeDialogForm">
				<ElFormItem
					label="角色名称"
					prop="roleName"
				>
					<ElInput
						v-model="dataScopeDialogForm.roleName"
						disabled
					/>
				</ElFormItem>
				<ElFormItem
					label="权限字符"
					prop="roleKey"
				>
					<ElInput
						v-model="dataScopeDialogForm.roleKey"
						disabled
					/>
				</ElFormItem>
				<ElFormItem
					label="角色名称"
					prop="roleName"
				>
					<ElSelect v-model="dataScopeDialogForm.dataScope">
						<ElOption
							v-for="item in dataScopeDialogDeptTree"
							:key="item.value"
							:label="item.label"
							:value="item.value"
						/>
					</ElSelect>
				</ElFormItem>
				<ElFormItem
					v-show="dataScopeDialogForm.dataScope === '2'"
					label="数据权限"
				>
					<el-checkbox
						v-model="deptExpand"
						@change="handleCheckedTreeExpand($event, 'dept')"
					>
						展开/折叠
					</el-checkbox>
					<el-checkbox
						v-model="deptNodeAll"
						@change="handleCheckedTreeNodeAll($event, 'dept')"
					>
						全选/全不选
					</el-checkbox>
					<el-checkbox
						v-model="dataScopeDialogForm.deptCheckStrictly"
						@change="handleCheckedTreeConnect($event, 'dept')"
					>
						父子联动
					</el-checkbox>
					<el-tree
						ref="deptRef"
						class="tree-border"
						:data="deptOptions"
						show-checkbox
						default-expand-all
						node-key="id"
						:check-strictly="!dataScopeDialogForm.deptCheckStrictly"
						empty-text="加载中，请稍候"
						:props="{ label: 'label', children: 'children' }"
					/>
				</ElFormItem>
			</ElForm>
			<template #footer>
				<el-button @click="dataScopeDialogClose">取消</el-button>
				<el-button
					type="primary"
					@click="dataScopeDialogSubmit"
				>
					确定
				</el-button>
			</template>
		</ElDialog>

		<!-- 新增|编辑弹窗 -->
		<ElDialog
			v-model="dialogVisible"
			:title="dialogId ? '修改角色' : '添加角色'"
			width="500px"
			:close-on-click-modal="false"
			@cancel="dialogCancel"
		>
			<FormGenerator
				ref="dialogFormGeneratorRef"
				v-model="dialogFormData"
				:config="dialogFormConfig"
			>
				<template #expandedSlot>
					<ElFormItem label="菜单权限">
						<div>
							<el-checkbox
								v-model="menuExpand"
								@change="handleCheckedTreeExpand($event, 'menu')"
							>
								展开/折叠
							</el-checkbox>
							<el-checkbox
								v-model="menuNodeAll"
								@change="handleCheckedTreeNodeAll($event, 'menu')"
							>
								全选/全不选
							</el-checkbox>
							<el-checkbox
								v-model="dialogFormData.menuCheckStrictly"
								@change="handleCheckedTreeConnect($event, 'menu')"
							>
								父子联动
							</el-checkbox>
							<el-tree
								ref="menuRef"
								class="tree-border"
								:data="menuOptions"
								show-checkbox
								node-key="id"
								:check-strictly="!dialogFormData.menuCheckStrictly"
								empty-text="加载中，请稍候"
								:props="{ label: 'label', children: 'children' }"
							/>
						</div>
					</ElFormItem>
				</template>
			</FormGenerator>

			<template #footer>
				<el-button @click="dialogCancel">取消</el-button>
				<el-button
					type="primary"
					@click="dialogSubmit"
				>
					确定
				</el-button>
			</template>
		</ElDialog>
	</div>
</template>
