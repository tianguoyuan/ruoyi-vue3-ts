<script setup lang="ts">
import type { FormConfig } from '@/components/FormGenerator/types'
import FormGenerator from '@/components/FormGenerator/index.vue'
import { useUserStore } from '@/store/user'
import { listMenu } from '@/api/tool/genEdit'
import { buildTree } from '@/utils'
import { QuestionFilled } from '@element-plus/icons-vue'

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
	tplCategory: '',
	tplWebType: '',
	packageName: '',
	moduleName: '',
	businessName: '',
	functionName: '',
	genType: '0',
	parentMenuId: '',
	genPath: '',
	treeCode: '',
	columns: [] as IColumns,
	treeParentCode: '',
	treeName: '',
	subTableName: '',
	subTableFkName: ''
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
	labelWidth: '150px',
	span: 6,
	fields: [
		{
			type: 'select',
			label: '生成模板',
			prop: 'tplCategory',
			placeholder: '请选择生成模板',
			span: 12,
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
			]
		},
		{
			type: 'select',
			label: '前端类型',
			prop: 'tplWebType',
			placeholder: '请选择前端类型',
			span: 12,
			options: [
				{
					label: 'Vue2 Element UI 模版',
					value: 'element-ui'
				},
				{
					label: 'Vue3 Element Plus 模版',
					value: 'element-plus'
				}
			]
		},
		{
			type: 'input',
			label: '生成包路径',
			prop: 'packageName',
			placeholder: '请输入生成包路径',
			span: 12,
			labelTip: '生成在哪个java包下，例如 com.ruoyi.system'
		},

		{
			type: 'input',
			label: '生成模块名',
			prop: 'moduleName',
			placeholder: '请输入生成模块名',
			span: 12,
			labelTip: '可理解为子系统名，例如 system'
		},

		{
			type: 'input',
			label: '生成业务名',
			prop: 'businessName',
			placeholder: '请输入生成业务名',
			span: 12,
			labelTip: '可理解为功能英文名，例如 user'
		},

		{
			type: 'input',
			label: '生成功能名',
			prop: 'functionName',
			placeholder: '请输入生成功能名',
			span: 12,
			labelTip: '用作类描述，例如 用户'
		},

		{
			type: 'radio',
			label: '生成代码方式',
			prop: 'genType',
			span: 12,
			labelTip: '默认为zip压缩包下载，也可以自定义生成路径',
			defaultValue: '0',
			options: [
				{
					label: 'zip压缩包',
					value: '0'
				},
				{
					label: '自定义路径',
					value: '1'
				}
			]
		},
		{
			type: 'cascader',
			label: '上级菜单',
			prop: 'parentMenuId',
			props: {
				value: 'menuId',
				label: 'menuName',
				children: 'children',
				emitPath: false,
				checkStrictly: true
			},
			span: 12,
			labelTip: '分配到指定菜单下，例如 系统管理',
			options: menuTreeSelect as any
		},
		{
			type: 'slot',
			label: '自定义路径',
			prop: 'genPath',
			slotName: 'slotGenPath',
			span: 24
		},
		{
			type: 'slot',
			label: '其他信息',
			prop: '',
			slotName: 'slotTplCategory',
			span: 24
		}
	],
	formRules: {
		tableName: [
			{
				required: true,
				message: '请选择生成模板',
				trigger: 'blur'
			}
		],
		packageName: [
			{
				required: true,
				message: '请输入生成包路径'
			}
		],
		moduleName: [
			{
				required: true,
				message: '请输入生成模块名'
			}
		],
		businessName: [
			{
				required: true,
				message: '请输入生成业务名'
			}
		],
		functionName: [
			{
				required: true,
				message: '请输入生成功能名'
			}
		]
	},
	tableShow: false,
	tableInitQueryRefuse: true,
	hideDefaultButton: true
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
	validate,
	getData
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
			<el-form-item prop="genPath">
				<template #label>
					自定义路径
					<el-tooltip
						content="填写磁盘绝对路径，若不填写，则生成到当前Web项目下"
						placement="top"
					>
						<el-icon><QuestionFilled /></el-icon>
					</el-tooltip>
				</template>
				<el-input v-model="formData.genPath">
					<template #append>
						<el-dropdown>
							<el-button type="primary">
								最近路径快速选择
								<i class="el-icon-arrow-down el-icon--right" />
							</el-button>
							<template #dropdown>
								<el-dropdown-menu>
									<el-dropdown-item @click="formData.genPath = '/'">恢复默认的生成基础路径</el-dropdown-item>
								</el-dropdown-menu>
							</template>
						</el-dropdown>
					</template>
				</el-input>
			</el-form-item>
		</template>

		<template
			v-if="['tree', 'sub'].includes(formData.tplCategory)"
			#slotTplCategory
		>
			<template v-if="formData.tplCategory === 'tree'">
				<div class="mx-5 text-4 border-b border-solid border-gray color-#6379bb">其它信息</div>
				<el-row class="pt-5">
					<el-col :span="12">
						<el-form-item>
							<template #label>
								树编码字段
								<el-tooltip
									content="树显示的编码字段名， 如：dept_id"
									placement="top"
								>
									<el-icon><QuestionFilled /></el-icon>
								</el-tooltip>
							</template>
							<el-select
								v-model="formData.treeCode"
								placeholder="请选择"
							>
								<el-option
									v-for="(column, index) in formData.columns"
									:key="index"
									:label="column.columnName + '：' + column.columnComment"
									:value="column.columnName"
								/>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item>
							<template #label>
								树父编码字段
								<el-tooltip
									content="树显示的父编码字段名， 如：parent_Id"
									placement="top"
								>
									<el-icon><QuestionFilled /></el-icon>
								</el-tooltip>
							</template>
							<el-select
								v-model="formData.treeParentCode"
								placeholder="请选择"
							>
								<el-option
									v-for="(column, index) in formData.columns"
									:key="index"
									:label="column.columnName + '：' + column.columnComment"
									:value="column.columnName"
								/>
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item>
							<template #label>
								树名称字段
								<el-tooltip
									content="树节点的显示名称字段名， 如：dept_name"
									placement="top"
								>
									<el-icon><QuestionFilled /></el-icon>
								</el-tooltip>
							</template>
							<el-select
								v-model="formData.treeName"
								placeholder="请选择"
							>
								<el-option
									v-for="(column, index) in formData.columns"
									:key="index"
									:label="column.columnName + '：' + column.columnComment"
									:value="column.columnName"
								/>
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>
			</template>

			<template v-if="formData.tplCategory === 'sub'">
				<div class="mx-5 text-4 border-b border-solid border-gray color-#6379bb">关联信息</div>
				<el-row class="pt-5">
					<el-col :span="12">
						<el-form-item>
							<template #label>
								关联子表的表名
								<el-tooltip
									content="关联子表的表名， 如：sys_user"
									placement="top"
								>
									<el-icon><QuestionFilled /></el-icon>
								</el-tooltip>
							</template>
							<el-select
								v-model="formData.subTableName"
								placeholder="请选择"
								@change="() => (formData.subTableFkName = '')"
							>
								<el-option
									v-for="(table, index) in tables"
									:key="index"
									:label="table.tableName + '：' + table.tableComment"
									:value="table.tableName"
								/>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item>
							<template #label>
								子表关联的外键名
								<el-tooltip
									content="子表关联的外键名， 如：user_id"
									placement="top"
								>
									<el-icon><QuestionFilled /></el-icon>
								</el-tooltip>
							</template>
							<el-select
								v-model="formData.subTableFkName"
								placeholder="请选择"
							>
								<el-option
									v-for="(column, index) in subColumns"
									:key="index"
									:label="column.columnName + '：' + column.columnComment"
									:value="column.columnName"
								/>
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>
			</template>
		</template>
	</FormGenerator>
</template>

<style scoped lang="scss">
:deep(.formButtons) {
	justify-content: center;
}
</style>
