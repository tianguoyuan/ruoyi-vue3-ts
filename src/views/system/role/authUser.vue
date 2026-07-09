<script setup lang="ts">
import dayjs from 'dayjs'

import { getDicts } from '@/api/system/dict'
import { allocatedUserList, authUserCancelAll, authUserSelectAll, unallocatedUserList } from '@/api/system/role'
import FormGenerator from '@/components/FormGenerator/index.vue'
import type { FormConfig } from '@/components/FormGenerator/types'
import { useTagsViewStore } from '@/store/tagsView'
import { checkPermission } from '@/utils/permission'

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
	api: allocatedUserList,
	fields: [
		{
			label: '用户名称',
			placeholder: '请输入用户名称',
			prop: 'userName',
			type: 'input'
		},

		{
			label: '手机号码',
			placeholder: '请输入手机号码',
			prop: 'phonenumber',
			type: 'input'
		}
	],
	labelWidth: '80px',
	leftButtons: [
		{
			event: 'openSelectUser',
			icon: 'Plus',
			label: '添加用户',
			plain: true,
			show: checkPermission(['system:role:add']),
			type: 'primary'
		},
		{
			disabled: multiple as any,
			event: 'cancelAuthUserAll',
			icon: 'CircleClose',
			label: '批量取消授权',
			plain: true,
			show: checkPermission(['system:role:remove']),
			type: 'danger'
		},
		{
			event: 'handleClose',
			icon: 'Close',
			label: '关闭',
			plain: true,
			type: 'warning'
		}
	],

	span: 6,
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
			format: v => dayjs(v).format('YYYY-MM-DD hh:mm:ss'),
			label: '创建时间',
			prop: 'createTime'
		},
		{
			custom: true,
			label: '操作',
			prop: '',
			tableEditBtn: [
				{
					event: 'cancelAuthUser',
					icon: 'CircleClose',
					label: '取消授权',
					link: true,
					show: checkPermission(['system:role:remove']),
					type: 'primary'
				}
			],
			width: '140px'
		}
	],
	tableShow: true,
	tableShowSelection: true
})

const visible = ref(false)
const dialogFormGeneratorRef = ref<InstanceType<typeof FormGenerator> | null>(null)
const dialogSelectList = ref([])
function dialogSelectionChange(v) {
	dialogSelectList.value = v.map(item => item.userId)
}
const dialogFormData = ref({
	roleId: route.params.roleId
})
const dialogFormConfig = ref<FormConfig>({
	api: unallocatedUserList,
	fields: [
		{
			label: '用户名称',
			placeholder: '请输入用户名称',
			prop: 'userName',
			type: 'input'
		},

		{
			label: '手机号码',
			placeholder: '请输入手机号码',
			prop: 'phonenumber',
			type: 'input'
		}
	],
	labelWidth: '80px',
	span: 8,
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
			format: v => dayjs(v).format('YYYY-MM-DD hh:mm:ss'),
			label: '创建时间',
			prop: 'createTime',
			width: '180px'
		}
	],
	tableShow: true,
	tableShowSelection: true
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
		nextTick(() => {
			dialogFormGeneratorRef.value?.queryTableData()
		})
	} else if (event === 'cancelAuthUserAll') {
		// 批量取消授权
		const userIds = selectList.value.join(',')
		cancelAuthUser(userIds)
	} else if (event === 'handleClose') {
		// 关闭页面
		tagsViewStore.delView({
			name: route.name as string,
			path: route.path
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
		cancelButtonText: '取消',
		confirmButtonText: '确定',
		message: '是否取消选中用户授权数据项?',
		showCancelButton: true,
		title: '提示',
		type: 'warning'
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
			@selectionChange="selectionChange"
			@tableEditClick="tableEditClick"
		>
			<!-- table-状态 -->
			<template #statusSlot="{ row }">
				<DictTag
					:options="sysNormalDisable"
					:value="row.status"
				/>
			</template>
		</FormGenerator>
		<ElDialog
			v-model="visible"
			:closeOnClickModal="false"
			title="选择用户"
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
						:options="sysNormalDisable"
						:value="row.status"
					/>
				</template>
			</FormGenerator>

			<template #footer>
				<ElButton @click="dialogCancel">取消</ElButton>
				<ElButton
					:disabled="!dialogSelectList.length"
					type="primary"
					@click="dialogSubmit"
				>
					确定
				</ElButton>
			</template>
		</ElDialog>
	</div>
</template>

<style scoped></style>
