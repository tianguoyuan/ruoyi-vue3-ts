<script setup lang="ts">
import { Search, QuestionFilled } from '@element-plus/icons-vue'

import type { IDialogFlag } from '../index.vue'
import { getDicts } from '@/api/system/dict'
import { addMenu, getMenu, listMenu, updateMenu } from '@/api/system/menu'
import IconSelect from '@/components/IconSelect/index.vue'
import type { FormInstance } from 'element-plus'
const props = defineProps<{
	visible: boolean
	id?: number
	parentId: number
	flag: IDialogFlag
}>()
const emits = defineEmits<{
	'update:visible': [v: boolean]
	refresh: []
}>()

const title = computed(() => {
	if (props.flag === 'add' || props.flag === 'addChild') {
		return '添加菜单'
	} else if (props.flag === 'edit') {
		return '修改菜单'
	}
})
const sysNormalDisable = ref<API.IGetDictsRes>([])
const sysShowHide = ref<API.IGetDictsRes>([])
const menuOptions = ref<any[]>([])

const initForm = {
	menuId: undefined,
	parentId: 0,
	menuName: undefined,
	icon: undefined,
	menuType: 'M',
	orderNum: undefined,
	isFrame: '1',
	isCache: '0',
	visible: '0',
	status: '0'
}
const form = ref<Record<string, any>>({ ...initForm })
const rules = ref({
	menuName: [
		{
			required: true,
			message: '菜单名称不能为空',
			trigger: 'blur'
		}
	],
	orderNum: [
		{
			required: true,
			message: '菜单顺序不能为空',
			trigger: 'blur'
		}
	],
	path: [
		{
			required: true,
			message: '路由地址不能为空',
			trigger: 'blur'
		}
	]
})

const menuRef = ref<FormInstance | null>(null)
watch(
	() => props.flag,
	async flag => {
		if (!flag) return
		form.value = {
			...initForm,
			parentId: props.parentId,
			menuId: props.id
		}
		getListMenu()
		menuRef.value?.clearValidate()
		if (flag === 'add') {
			// 新增
		} else if (flag === 'addChild') {
			// 新增子菜单
		} else if (flag === 'edit') {
			// 编辑
			// props.id
			const { data } = await getMenu(props.id)
			form.value = { ...data }
		}
	}
)

async function submit() {
	await menuRef.value?.validate()
	if (['add', 'addChild'].includes(props.flag)) {
		// 新增
		await addMenu(form.value)
		ElMessage.success('新增成功')
	} else if (props.flag === 'edit') {
		// 修改
		await updateMenu(form.value)
		ElMessage.success('修改成功')
	}

	emits('update:visible', false)
	emits('refresh')
}

const iconSelectRef = ref<InstanceType<typeof IconSelect> | null>(null)
/** 展示下拉图标 */
function showSelectIcon() {
	iconSelectRef.value?.reset()
}
/** 选择图标 */
function selected(name) {
	form.value.icon = name
}

function getListMenu() {
	listMenu().then(({ rows }) => {
		const menu = [
			{
				menuId: 0,
				menuName: '主类目',
				children: rows
			}
		]
		menuOptions.value = menu
	})
}
function init() {
	getDicts('sys_normal_disable').then(data => {
		sysNormalDisable.value = data
	})
	getDicts('sys_show_hide').then(data => {
		sysShowHide.value = data
	})
}
init()
</script>

<template>
	<ElDialog
		:model-value="props.visible"
		:title="title"
		:close-on-click-modal="false"
		width="680px"
		@update:modelValue="v => emits('update:visible', v)"
	>
		<ElForm
			ref="menuRef"
			:model="form"
			:rules="rules"
			label-width="100px"
		>
			<ElRow>
				<ElCol :span="24">
					<ElFormItem label="上级菜单">
						<ElTreeSelect
							v-model="form.parentId"
							:data="menuOptions"
							:props="{ value: 'menuId', label: 'menuName', children: 'children' }"
							value-key="menuId"
							placeholder="选择上级菜单"
							check-strictly
						/>
					</ElFormItem>
				</ElCol>
				<ElCol :span="24">
					<ElFormItem
						label="菜单类型"
						prop="menuType"
					>
						<ElRadioGroup v-model="form.menuType">
							<ElRadio value="M">目录</ElRadio>
							<ElRadio value="C">菜单</ElRadio>
							<ElRadio value="F">按钮</ElRadio>
						</ElRadioGroup>
					</ElFormItem>
				</ElCol>
				<ElCol
					v-if="form.menuType != 'F'"
					:span="12"
				>
					<ElFormItem
						label="菜单图标"
						prop="icon"
					>
						<ElPopover
							placement="bottom-start"
							:width="540"
							trigger="click"
						>
							<template #reference>
								<ElInput
									v-model="form.icon"
									placeholder="点击选择图标"
									readonly
									@blur="showSelectIcon"
								>
									<template #prefix>
										<SvgIcon
											v-if="form.icon"
											:icon-class="form.icon"
											class="el-input__icon"
											style="width: 16px; height: 32px"
										/>
										<ElIcon
											v-else
											style="width: 16px; height: 32px"
										>
											<Search />
										</ElIcon>
									</template>
								</ElInput>
							</template>
							<IconSelect
								ref="iconSelectRef"
								:active-icon="form.icon"
								@selected="selected"
							/>
						</ElPopover>
					</ElFormItem>
				</ElCol>
				<ElCol :span="12">
					<ElFormItem
						label="显示排序"
						prop="orderNum"
					>
						<ElInputNumber
							v-model="form.orderNum"
							controls-position="right"
							:min="0"
						/>
					</ElFormItem>
				</ElCol>
				<ElCol :span="12">
					<ElFormItem
						label="菜单名称"
						prop="menuName"
					>
						<ElInput
							v-model="form.menuName"
							placeholder="请输入菜单名称"
						/>
					</ElFormItem>
				</ElCol>
				<ElCol
					v-if="form.menuType == 'C'"
					:span="12"
				>
					<ElFormItem prop="routeName">
						<template #label>
							<span>
								<ElTooltip
									content="默认不填则和路由地址相同：如地址为：`user`，则名称为`User`（注意：因为router会删除名称相同路由，为避免名字的冲突，特殊情况下请自定义，保证唯一性）"
									placement="top"
								>
									<ElIcon><QuestionFilled /></ElIcon>
								</ElTooltip>
								路由名称
							</span>
						</template>
						<ElInput
							v-model="form.routeName"
							placeholder="请输入路由名称"
						/>
					</ElFormItem>
				</ElCol>
				<ElCol
					v-if="form.menuType != 'F'"
					:span="12"
				>
					<ElFormItem>
						<template #label>
							<span>
								<ElTooltip
									content="选择是外链则路由地址需要以`http(s)://`开头"
									placement="top"
								>
									<ElIcon><QuestionFilled /></ElIcon> </ElTooltip
								>是否外链
							</span>
						</template>
						<ElRadioGroup v-model="form.isFrame">
							<ElRadio value="0">是</ElRadio>
							<ElRadio value="1">否</ElRadio>
						</ElRadioGroup>
					</ElFormItem>
				</ElCol>
				<ElCol
					v-if="form.menuType != 'F'"
					:span="12"
				>
					<ElFormItem prop="path">
						<template #label>
							<span>
								<ElTooltip
									content="访问的路由地址，如：`user`，如外网地址需内链访问则以`http(s)://`开头"
									placement="top"
								>
									<ElIcon><QuestionFilled /></ElIcon>
								</ElTooltip>
								路由地址
							</span>
						</template>
						<ElInput
							v-model="form.path"
							placeholder="请输入路由地址"
						/>
					</ElFormItem>
				</ElCol>
				<ElCol
					v-if="form.menuType == 'C'"
					:span="12"
				>
					<ElFormItem prop="component">
						<template #label>
							<span>
								<ElTooltip
									content="访问的组件路径，如：`system/user/index`，默认在`views`目录下"
									placement="top"
								>
									<ElIcon><QuestionFilled /></ElIcon>
								</ElTooltip>
								组件路径
							</span>
						</template>
						<ElInput
							v-model="form.component"
							placeholder="请输入组件路径"
						/>
					</ElFormItem>
				</ElCol>
				<ElCol
					v-if="form.menuType != 'M'"
					:span="12"
				>
					<ElFormItem>
						<ElInput
							v-model="form.perms"
							placeholder="请输入权限标识"
							maxlength="100"
						/>
						<template #label>
							<span>
								<ElTooltip
									content="控制器中定义的权限字符，如：@PreAuthorize(`@ss.hasPermi('system:user:list')`)"
									placement="top"
								>
									<ElIcon><QuestionFilled /></ElIcon>
								</ElTooltip>
								权限字符
							</span>
						</template>
					</ElFormItem>
				</ElCol>
				<ElCol
					v-if="form.menuType == 'C'"
					:span="12"
				>
					<ElFormItem>
						<ElInput
							v-model="form.query"
							placeholder="请输入路由参数"
							maxlength="255"
						/>
						<template #label>
							<span>
								<ElTooltip
									content="访问路由的默认传递参数，如：`{'id': 1, 'name': 'ry'}`"
									placement="top"
								>
									<ElIcon><QuestionFilled /></ElIcon>
								</ElTooltip>
								路由参数
							</span>
						</template>
					</ElFormItem>
				</ElCol>
				<ElCol
					v-if="form.menuType == 'C'"
					:span="12"
				>
					<ElFormItem>
						<template #label>
							<span>
								<ElTooltip
									content="选择是则会被`keep-alive`缓存，需要匹配组件的`name`和地址保持一致"
									placement="top"
								>
									<ElIcon><QuestionFilled /></ElIcon>
								</ElTooltip>
								是否缓存
							</span>
						</template>
						<ElRadioGroup v-model="form.isCache">
							<ElRadio value="0">缓存</ElRadio>
							<ElRadio value="1">不缓存</ElRadio>
						</ElRadioGroup>
					</ElFormItem>
				</ElCol>
				<ElCol
					v-if="form.menuType != 'F'"
					:span="12"
				>
					<ElFormItem>
						<template #label>
							<span>
								<ElTooltip
									content="选择隐藏则路由将不会出现在侧边栏，但仍然可以访问"
									placement="top"
								>
									<ElIcon><QuestionFilled /></ElIcon>
								</ElTooltip>
								显示状态
							</span>
						</template>
						<ElRadioGroup v-model="form.visible">
							<ElRadio
								v-for="dict in sysShowHide"
								:key="dict.value"
								:value="dict.value"
							>
								{{ dict.label }}
							</ElRadio>
						</ElRadioGroup>
					</ElFormItem>
				</ElCol>
				<ElCol :span="12">
					<ElFormItem>
						<template #label>
							<span>
								<ElTooltip
									content="选择停用则路由将不会出现在侧边栏，也不能被访问"
									placement="top"
								>
									<ElIcon><QuestionFilled /></ElIcon>
								</ElTooltip>
								菜单状态
							</span>
						</template>
						<ElRadioGroup v-model="form.status">
							<ElRadio
								v-for="dict in sysNormalDisable"
								:key="dict.value"
								:value="dict.value"
							>
								{{ dict.label }}
							</ElRadio>
						</ElRadioGroup>
					</ElFormItem>
				</ElCol>
			</ElRow>
		</ElForm>
		<template #footer>
			<ElButton @click="emits('update:visible', false)">取消</ElButton>
			<ElButton
				type="primary"
				@click="submit"
			>
				确定
			</ElButton>
		</template>
	</ElDialog>
</template>
