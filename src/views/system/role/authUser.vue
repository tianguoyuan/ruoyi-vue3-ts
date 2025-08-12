<script setup lang="ts">
import type { FormConfig } from '@/components/FormGenerator/types'
import FormGenerator from '@/components/FormGenerator/index.vue'
import dayjs from 'dayjs'
import { allocatedUserList, authUserCancelAll, authUserSelectAll, unallocatedUserList } from '@/api/system/role'
import { checkPermission } from '@/utils/permission'
import { useTagsViewStore } from '@/store/tagsView'
import { getDicts } from '@/api/system/dict'

const router = useRouter()
const route = useRoute()
const sysNormalDisable = ref<API.IGetDictsRes>([])
const tagsViewStore = useTagsViewStore()

const formGeneratorRef = ref<InstanceType<typeof FormGenerator> | null>(null)
const formData = ref({
	roleId: route.params.roleId
})
const selectList = ref([])
function selectionChange(v) {
	selectList.value = v.map(item => item.userId)
}

const multiple = computed(() => !(selectList.value.length > 0))
const formConfig = ref<FormConfig>({
	labelWidth: '80px',
	span: 6,
	fields: [
		{
			type: 'input',
			label: '用户名称',
			prop: 'userName',
			placeholder: '请输入用户名称'
		},

		{
			type: 'input',
			label: '手机号码',
			prop: 'phonenumber',
			placeholder: '请输入手机号码'
		}
	],
	leftButtons: [
		{
			label: '添加用户',
			type: 'primary',
			event: 'openSelectUser',
			plain: true,
			icon: 'Plus',
			show: checkPermission(['system:role:add'])
		},
		{
			label: '批量取消授权',
			type: 'danger',
			event: 'cancelAuthUserAll',
			plain: true,
			icon: 'CircleClose',
			disabled: multiple as any,
			show: checkPermission(['system:role:remove'])
		},
		{
			label: '关闭',
			type: 'warning',
			event: 'handleClose',
			plain: true,
			icon: 'Close'
		}
	],

	tableShow: true,
	api: allocatedUserList,
	tableShowSelection: true,
	tableHeader: [
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
			label: '邮箱',
			prop: 'email',
			showOverflowTooltip: true
		},
		{
			label: '手机',
			prop: 'phonenumber',
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
					icon: 'CircleClose',
					label: '取消授权',
					event: 'cancelAuthUser',
					show: checkPermission(['system:role:remove'])
				}
			]
		}
	]
})

const visible = ref(false)
const dialogSelectList = ref([])
function dialogSelectionChange(v) {
	dialogSelectList.value = v.map(item => item.userId)
}
const dialogFormData = ref({
	roleId: route.params.roleId
})
const dialogFormConfig = ref<FormConfig>({
	labelWidth: '80px',
	span: 8,
	fields: [
		{
			type: 'input',
			label: '用户名称',
			prop: 'userName',
			placeholder: '请输入用户名称'
		},

		{
			type: 'input',
			label: '手机号码',
			prop: 'phonenumber',
			placeholder: '请输入手机号码'
		}
	],
	tableShow: true,
	api: unallocatedUserList,
	tableShowSelection: true,
	tableHeader: [
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
			label: '邮箱',
			prop: 'email',
			showOverflowTooltip: true
		},
		{
			label: '手机',
			prop: 'phonenumber',
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
			width: '180px',
			format: v => dayjs(v).format('YYYY-MM-DD hh:mm:ss')
		}
	]
})

async function dialogSubmit() {
	const roleId = route.params.roleId as string
	const userIds = dialogSelectList.value.join(',')
	await authUserSelectAll({
		roleId,
		userIds
	})
	ElMessage.success('操作成功')
	visible.value = false
	formGeneratorRef.value?.queryTableData()
}
function dialogCancel() {
	visible.value = false
}

function handleButtonClick(event: string) {
	if (event === 'openSelectUser') {
		// 添加用户
		visible.value = true
	} else if (event === 'cancelAuthUserAll') {
		// 批量取消授权
		const userIds = selectList.value.join(',')
		cancelAuthUser(userIds)
	} else if (event === 'handleClose') {
		// 关闭页面
		tagsViewStore.delView({
			path: route.path,
			name: route.name as string
		})
		router.replace('/system/role')
	}
}
function tableEditClick(row, btn) {
	const { event } = btn
	if (event === 'cancelAuthUser') {
		cancelAuthUser(row.userId)
	}
}

async function cancelAuthUser(userIds: string) {
	const roleId = route.params.roleId as string
	await ElMessageBox({
		type: 'warning',
		title: '提示',
		message: '是否取消选中用户授权数据项?',
		showCancelButton: true,
		cancelButtonText: '取消',
		confirmButtonText: '确定'
	})

	await authUserCancelAll({
		roleId,
		userIds
	})

	ElMessage.success('取消授权成功')
	formGeneratorRef.value?.queryTableData()
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
			<!-- table-状态 -->
			<template #statusSlot="{ row }">
				<DictTag
					:value="row.status"
					:options="sysNormalDisable"
				/>
			</template>
		</FormGenerator>
		<ElDialog
			v-model="visible"
			title="选择用户"
			:close-on-click-modal="false"
			@cancel="dialogCancel"
		>
			<FormGenerator
				ref="dialogFormGeneratorRef"
				v-model="dialogFormData"
				:config="dialogFormConfig"
				@selectionChange="dialogSelectionChange"
			>
				<!-- table-状态 -->
				<template #statusSlot="{ row }">
					<DictTag
						:value="row.status"
						:options="sysNormalDisable"
					/>
				</template>
			</FormGenerator>

			<template #footer>
				<el-button @click="dialogCancel">取消</el-button>
				<el-button
					type="primary"
					:disabled="!dialogSelectList.length"
					@click="dialogSubmit"
				>
					确定
				</el-button>
			</template>
		</ElDialog>
	</div>
</template>

<style scoped></style>
