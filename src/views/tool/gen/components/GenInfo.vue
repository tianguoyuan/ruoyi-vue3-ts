<script setup lang="ts">
import { QuestionFilled } from '@element-plus/icons-vue'

import { listMenu } from '@/api/tool/genEdit'
import FormGenerator from '@/components/FormGenerator/index.vue'
import type { FormConfig } from '@/components/FormGenerator/types'
import { useUserStore } from '@/store/user'
import { buildTree } from '@/utils'

type IColumns = {
	columnName: string
	columnComment: string
}[]

const props = defineProps<{
	info: API.IGetGenTableRes['data']['info']
	tables: API.IGetGenTableRes['data']['tables']
}>()

const router = useRouter()

const menuTreeSelect = ref([])
const formGeneratorRef = ref<InstanceType<typeof FormGenerator> | null>(null)
const formData = ref({
	businessName: '',
	columns: [] as IColumns,
	functionName: '',
	genPath: '',
	genType: '0',
	moduleName: '',
	packageName: '',
	parentMenuId: '',
	subTableFkName: '',
	subTableName: '',
	tplCategory: '',
	tplWebType: '',
	treeCode: '',
	treeName: '',
	treeParentCode: ''
})

watch(
	() => props.info,
	value => {
		const obj = { ...value }
		if (!obj.tplWebType) {
			obj.tplWebType = 'element-plus'
		}

		Object.keys(formData.value).forEach(key => {
			if (Object.prototype.hasOwnProperty.call(obj, key)) {
				formData.value[key] = obj[key]
			}
		})
	},
	{ immediate: true }
)

const formConfig = ref<FormConfig>({
	fields: [
		{
			label: '生成模板',
			options: [
				{
					label: '单表（增删改查）',
					value: 'crud'
				},
				{
					label: '树表（增删改查）',
					value: 'tree'
				},
				{
					label: '主子表（增删改查）',
					value: 'sub'
				}
			],
			placeholder: '请选择生成模板',
			prop: 'tplCategory',
			span: 12,
			type: 'select'
		},
		{
			label: '前端类型',
			options: [
				{
					label: 'Vue2 Element UI 模版',
					value: 'element-ui'
				},
				{
					label: 'Vue3 Element Plus 模版',
					value: 'element-plus'
				}
			],
			placeholder: '请选择前端类型',
			prop: 'tplWebType',
			span: 12,
			type: 'select'
		},
		{
			label: '生成包路径',
			labelTip: '生成在哪个java包下，例如 com.ruoyi.system',
			placeholder: '请输入生成包路径',
			prop: 'packageName',
			span: 12,
			type: 'input'
		},

		{
			label: '生成模块名',
			labelTip: '可理解为子系统名，例如 system',
			placeholder: '请输入生成模块名',
			prop: 'moduleName',
			span: 12,
			type: 'input'
		},

		{
			label: '生成业务名',
			labelTip: '可理解为功能英文名，例如 user',
			placeholder: '请输入生成业务名',
			prop: 'businessName',
			span: 12,
			type: 'input'
		},

		{
			label: '生成功能名',
			labelTip: '用作类描述，例如 用户',
			placeholder: '请输入生成功能名',
			prop: 'functionName',
			span: 12,
			type: 'input'
		},

		{
			defaultValue: '0',
			label: '生成代码方式',
			labelTip: '默认为zip压缩包下载，也可以自定义生成路径',
			options: [
				{
					label: 'zip压缩包',
					value: '0'
				},
				{
					label: '自定义路径',
					value: '1'
				}
			],
			prop: 'genType',
			span: 12,
			type: 'radio'
		},
		{
			label: '上级菜单',
			labelTip: '分配到指定菜单下，例如 系统管理',
			options: menuTreeSelect as any,
			prop: 'parentMenuId',
			props: {
				checkStrictly: true,
				children: 'children',
				emitPath: false,
				label: 'menuName',
				value: 'menuId'
			},
			span: 12,
			type: 'cascader'
		},
		{
			label: '自定义路径',
			prop: 'genPath',
			slotName: 'slotGenPath',
			span: 24,
			type: 'slot'
		},
		{
			label: '其他信息',
			prop: '',
			slotName: 'slotTplCategory',
			span: 24,
			type: 'slot'
		}
	],
	formRules: {
		businessName: [
			{
				message: '请输入生成业务名',
				required: true
			}
		],
		functionName: [
			{
				message: '请输入生成功能名',
				required: true
			}
		],
		moduleName: [
			{
				message: '请输入生成模块名',
				required: true
			}
		],
		packageName: [
			{
				message: '请输入生成包路径',
				required: true
			}
		],
		tableName: [
			{
				message: '请选择生成模板',
				required: true,
				trigger: 'blur'
			}
		]
	},
	hideDefaultButton: true,
	labelWidth: '150px',
	span: 6,
	tableInitQueryRefuse: true,
	tableShow: false
})

async function handleButtonClick(event: string) {
	if (event === 'submit') {
		await formGeneratorRef.value?.validate()
	} else if (event === 'back') {
		router.back()
	}
}

/** 查询菜单下拉树结构 */
async function getMenuTreeSelect() {
	const { data } = await listMenu()
	menuTreeSelect.value = buildTree(data)
}

getMenuTreeSelect()

watch(
	() => formData.value.tplCategory,
	value => {
		if (value !== 'sub') {
			formData.value.subTableName = ''
			formData.value.subTableFkName = ''
		}
	}
)

const subColumns = ref<IColumns>([])
watch(
	() => formData.value.subTableName,
	val => {
		setSubTableColumns(val)
	}
)
function setSubTableColumns(value) {
	for (let item in props.tables) {
		const name = props.tables[item].tableName
		if (value === name) {
			subColumns.value = props.tables[item].columns
			break
		}
	}
}

function validate() {
	return formGeneratorRef.value?.validate()
}
function getData() {
	return formData.value
}

defineExpose({
	getData,
	validate
})
</script>

<template>
	<FormGenerator
		ref="formGeneratorRef"
		v-model="formData"
		:config="formConfig"
		@buttonClick="handleButtonClick"
	>
		<template
			v-if="formData.genType === '1'"
			#slotGenPath
		>
			<ElFormItem prop="genPath">
				<template #label>
					自定义路径
					<ElTooltip
						content="填写磁盘绝对路径，若不填写，则生成到当前Web项目下"
						placement="top"
					>
						<ElIcon><QuestionFilled /></ElIcon>
					</ElTooltip>
				</template>
				<ElInput v-model="formData.genPath">
					<template #append>
						<ElDropdown>
							<ElButton type="primary">
								最近路径快速选择
								<i class="el-icon-arrow-down el-icon--right" />
							</ElButton>
							<template #dropdown>
								<ElDropdownMenu>
									<ElDropdownItem @click="formData.genPath = '/'">恢复默认的生成基础路径</ElDropdownItem>
								</ElDropdownMenu>
							</template>
						</ElDropdown>
					</template>
				</ElInput>
			</ElFormItem>
		</template>

		<template
			v-if="['tree', 'sub'].includes(formData.tplCategory)"
			#slotTplCategory
		>
			<template v-if="formData.tplCategory === 'tree'">
				<div class="mx-5 text-4 border-b border-solid border-gray color-#6379bb">其它信息</div>
				<ElRow class="pt-5">
					<ElCol :span="12">
						<ElFormItem>
							<template #label>
								树编码字段
								<ElTooltip
									content="树显示的编码字段名， 如：dept_id"
									placement="top"
								>
									<ElIcon><QuestionFilled /></ElIcon>
								</ElTooltip>
							</template>
							<ElSelect
								v-model="formData.treeCode"
								placeholder="请选择"
							>
								<ElOption
									v-for="(column, index) in formData.columns"
									:key="index"
									:label="column.columnName + '：' + column.columnComment"
									:value="column.columnName"
								/>
							</ElSelect>
						</ElFormItem>
					</ElCol>
					<ElCol :span="12">
						<ElFormItem>
							<template #label>
								树父编码字段
								<ElTooltip
									content="树显示的父编码字段名， 如：parent_Id"
									placement="top"
								>
									<ElIcon><QuestionFilled /></ElIcon>
								</ElTooltip>
							</template>
							<ElSelect
								v-model="formData.treeParentCode"
								placeholder="请选择"
							>
								<ElOption
									v-for="(column, index) in formData.columns"
									:key="index"
									:label="column.columnName + '：' + column.columnComment"
									:value="column.columnName"
								/>
							</ElSelect>
						</ElFormItem>
					</ElCol>
				</ElRow>
				<ElRow>
					<ElCol :span="12">
						<ElFormItem>
							<template #label>
								树名称字段
								<ElTooltip
									content="树节点的显示名称字段名， 如：dept_name"
									placement="top"
								>
									<ElIcon><QuestionFilled /></ElIcon>
								</ElTooltip>
							</template>
							<ElSelect
								v-model="formData.treeName"
								placeholder="请选择"
							>
								<ElOption
									v-for="(column, index) in formData.columns"
									:key="index"
									:label="column.columnName + '：' + column.columnComment"
									:value="column.columnName"
								/>
							</ElSelect>
						</ElFormItem>
					</ElCol>
				</ElRow>
			</template>

			<template v-if="formData.tplCategory === 'sub'">
				<div class="mx-5 text-4 border-b border-solid border-gray color-#6379bb">关联信息</div>
				<ElRow class="pt-5">
					<ElCol :span="12">
						<ElFormItem>
							<template #label>
								关联子表的表名
								<ElTooltip
									content="关联子表的表名， 如：sys_user"
									placement="top"
								>
									<ElIcon><QuestionFilled /></ElIcon>
								</ElTooltip>
							</template>
							<ElSelect
								v-model="formData.subTableName"
								placeholder="请选择"
								@change="() => (formData.subTableFkName = '')"
							>
								<ElOption
									v-for="(table, index) in tables"
									:key="index"
									:label="table.tableName + '：' + table.tableComment"
									:value="table.tableName"
								/>
							</ElSelect>
						</ElFormItem>
					</ElCol>
					<ElCol :span="12">
						<ElFormItem>
							<template #label>
								子表关联的外键名
								<ElTooltip
									content="子表关联的外键名， 如：user_id"
									placement="top"
								>
									<ElIcon><QuestionFilled /></ElIcon>
								</ElTooltip>
							</template>
							<ElSelect
								v-model="formData.subTableFkName"
								placeholder="请选择"
							>
								<ElOption
									v-for="(column, index) in subColumns"
									:key="index"
									:label="column.columnName + '：' + column.columnComment"
									:value="column.columnName"
								/>
							</ElSelect>
						</ElFormItem>
					</ElCol>
				</ElRow>
			</template>
		</template>
	</FormGenerator>
</template>

<style scoped lang="scss">
:deep(.formButtons) {
	justify-content: center;
}
</style>
