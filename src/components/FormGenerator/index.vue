<script lang="ts" setup>
import { ref, watch, onMounted } from 'vue'
import type { FormConfig } from './types'
import type { FormInstance, Sort } from 'element-plus'

const props = defineProps<{
	config: FormConfig
	modelValue: Record<string, any>
	defaultSort?: Sort
}>()

const emit = defineEmits<{
	'update:modelValue': [value: Record<string, any>]
	buttonClick: [event: string, value: any]
	tableEditClick: [row: any, index: any]
	selectionChange: [value: Record<string, any>[]]
	customPageChange: []
	sortChange: [value: any]
}>()

const formRef = ref<FormInstance | null>(null)
const formData = ref<Record<string, any>>({})

// 初始化表单数据
function initFormData() {
	const data: Record<string, any> = {}
	props.config.fields?.forEach(field => {
		data[field.prop] = field.defaultValue !== undefined ? field.defaultValue : ''

		if (!Object.prototype.hasOwnProperty.call(field, 'clearable')) {
			// @ts-ignore
			field.clearable = true
		}
	})
	formData.value = {
		...data,
		...props.modelValue
	}
}

function setFormData(value: Record<string, any>) {
	Object.keys(formData.value).forEach(key => {
		if (Object.prototype.hasOwnProperty.call(formData.value, key)) {
			formData.value[key] = value[key]
		}
	})
}

// 获取组件
function getComponent(item: any) {
	switch (item.type) {
		case 'input':
			return 'el-input'
		case 'input-number':
			return 'el-input-number'
		case 'radio':
			return 'el-radio-group'
		case 'checkbox':
			return 'el-checkbox-group'
		case 'select':
			return 'el-select'
		case 'cascader':
			return 'el-cascader'
		case 'switch':
			return 'el-switch'
		case 'slider':
			return 'el-slider'
		case 'time-picker':
			return 'el-time-picker'
		case 'date-picker':
			return 'el-date-picker'
		case 'datetime-picker':
			return 'el-date-picker'
		case 'upload':
			return 'el-upload'
		case 'rate':
			return 'el-rate'
		case 'color-picker':
			return 'el-color-picker'
		case 'transfer':
			return 'el-transfer'
		case 'editor':
			return 'editor'
		case 'table':
			return 'el-table'
		default:
			return 'div'
	}
}

// 表单验证
async function validate() {
	try {
		await formRef.value?.validate()
		return true
	} catch (error) {
		return false
	}
}

// 重置表单
function resetFields() {
	formRef.value?.resetFields()
}

// 清除验证
function clearValidate(props?: string | string[]) {
	if (props) {
		formRef.value?.clearValidate(props)
	} else {
		formRef.value?.clearValidate()
	}
}

// 按钮点击事件
function handleButtonClick(btn: any) {
	if (btn.handler) {
		btn.handler(formData.value)
	} else {
		emit('buttonClick', btn.event, formData.value)
	}
}

// 监听外部传入的modelValue变化
watch(
	() => props.modelValue,
	(newVal, oldVal) => {
		// 避免无意义的更新
		if (JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
			formData.value = {
				...formData.value,
				...newVal
			}
		}
	},
	{
		deep: true,
		immediate: true
	}
)

// 监听表单数据变化
watch(
	formData,
	(newVal, oldVal) => {
		emit('update:modelValue', newVal)
	},
	{ deep: true }
)

// // 监听外部传入的modelValue变化
// watch(
// 	() => props.modelValue,
// 	newVal => {
// 		formData.value = {
// 			...formData.value,
// 			...newVal
// 		}
// 	},
// 	{ deep: true }
// )

// // 监听表单数据变化
// watch(
// 	formData,
// 	newVal => {
// 		emit('update:modelValue', newVal)
// 	},
// 	{ deep: true }
// )

const tableData = ref([])
const total = ref(0)
const pageNum = ref(1)
const pageSize = ref(10)

async function queryTableData(otherParams: Record<string, any> = {}) {
	const isPass = await validate()
	if (!isPass) return
	const params = {
		...formData.value,
		pageNum: pageNum.value,
		pageSize: pageSize.value,
		...otherParams
	}
	if (!props.config.api) return
	const result = await props.config.api(params)

	tableData.value = result.rows || []
	total.value = result.total || 0
}
function pageChange() {
	if (props.config.customPageChange) {
		emit('customPageChange')
	} else {
		queryTableData()
	}
}

function handleSortChange(val) {
	formData.value.orderByColumn = val.prop
	formData.value.isAsc = val.order
	queryTableData()
}

function resetPage() {
	pageNum.value = 1
	pageSize.value = 10
}

// 初始化
onMounted(() => {
	initFormData()
	if (!props.config.tableInitQueryRefuse) {
		queryTableData()
	}
})

// 暴露方法
defineExpose({
	validate,
	resetFields,
	resetPage,
	clearValidate,
	getFormData: () => formData.value,
	queryTableData,

	setFormData,
	getPageParams: () => ({
		pageNum: pageNum.value,
		pageSize: pageSize.value
	})
})
</script>

<template>
	<div class="w-full">
		<el-form
			ref="formRef"
			:model="formData"
			:rules="config.formRules"
			:label-width="config.labelWidth || '120px'"
			:label-position="config.labelPosition || 'right'"
			:disabled="config.disabled"
			:inline="config.inline"
		>
			<el-row :gutter="20">
				<template
					v-for="(item, index) in config.fields"
					:key="index"
				>
					<!-- 隐藏字段 -->
					<template v-if="item.hidden">
						<el-form-item
							v-show="false"
							:prop="item.prop"
						>
							<component
								:is="getComponent(item)"
								v-model="formData[item.prop]"
							/>
						</el-form-item>
					</template>

					<!-- 显示字段 -->
					<template v-else>
						<el-col :span="item.span || config.span || 24">
							<!-- 输入框 -->
							<el-form-item
								v-if="item.type === 'input'"
								:label="item.label"
								:prop="item.prop"
								:rules="item.rules"
							>
								<template #label>
									<span>{{ item.label }}</span>
									<el-tooltip
										v-if="item.labelTip"
										:content="item.labelTip"
										placement="top"
									>
										<el-icon><question-filled /></el-icon>
									</el-tooltip>
								</template>
								<el-input
									v-model="formData[item.prop]"
									:placeholder="item.placeholder || `请输入${item.label}`"
									:clearable="item.clearable"
									:show-password="item.showPassword"
									:prefix-icon="item.prefixIcon"
									:suffix-icon="item.suffixIcon"
									:maxlength="item.maxlength"
									:show-word-limit="item.showWordLimit"
									:disabled="item.disabled"
									:readonly="item.readonly"
								/>
							</el-form-item>

							<!-- 文本域 -->
							<el-form-item
								v-if="item.type === 'textarea'"
								:label="item.label"
								:prop="item.prop"
								:rules="item.rules"
							>
								<template #label>
									<span>{{ item.label }}</span>
									<el-tooltip
										v-if="item.labelTip"
										:content="item.labelTip"
										placement="top"
									>
										<el-icon><question-filled /></el-icon>
									</el-tooltip>
								</template>
								<el-input
									v-model="formData[item.prop]"
									type="textarea"
									:placeholder="item.placeholder || `请输入${item.label}`"
									:rows="item.rows || 2"
									style="width: 100%"
									:clearable="item.clearable"
								/>
							</el-form-item>

							<!-- 数字输入框 -->
							<el-form-item
								v-if="item.type === 'input-number'"
								:label="item.label"
								:prop="item.prop"
								:rules="item.rules"
							>
								<template #label>
									<span>{{ item.label }}</span>
									<el-tooltip
										v-if="item.labelTip"
										:content="item.labelTip"
										placement="top"
									>
										<el-icon><question-filled /></el-icon>
									</el-tooltip>
								</template>
								<el-input-number
									v-model="formData[item.prop]"
									:min="item.min"
									:max="item.max"
									:step="item.step"
									:step-strictly="item.stepStrictly"
									:precision="item.precision"
									:controls-position="item.controlsPosition"
									:disabled="item.disabled"
									:controls="item.controls"
									:placeholder="item.placeholder || `请输入${item.label}`"
								/>
							</el-form-item>

							<!-- 单选框 -->
							<el-form-item
								v-if="item.type === 'radio'"
								:label="item.label"
								:prop="item.prop"
								:rules="item.rules"
							>
								<template #label>
									<span>{{ item.label }}</span>
									<el-tooltip
										v-if="item.labelTip"
										:content="item.labelTip"
										placement="top"
									>
										<el-icon><question-filled /></el-icon>
									</el-tooltip>
								</template>
								<el-radio-group v-model="formData[item.prop]">
									<el-radio
										v-for="option in item.options"
										:key="option.value"
										:value="option.value"
										:border="item.border"
										:disabled="option.disabled"
									>
										{{ option.label }}
									</el-radio>
								</el-radio-group>
							</el-form-item>

							<!-- 单选框按钮 -->
							<el-form-item
								v-if="item.type === 'radio-button'"
								:label="item.label"
								:prop="item.prop"
								:rules="item.rules"
							>
								<template #label>
									<span>{{ item.label }}</span>
									<el-tooltip
										v-if="item.labelTip"
										:content="item.labelTip"
										placement="top"
									>
										<el-icon><question-filled /></el-icon>
									</el-tooltip>
								</template>
								<el-radio-group v-model="formData[item.prop]">
									<el-radio-button
										v-for="option in item.options"
										:key="option.value"
										:value="option.value"
										:border="item.border"
										:disabled="option.disabled"
									>
										{{ option.label }}
									</el-radio-button>
								</el-radio-group>
							</el-form-item>

							<!-- 复选框 -->
							<el-form-item
								v-if="item.type === 'checkbox'"
								:label="item.label"
								:prop="item.prop"
								:rules="item.rules"
							>
								<template #label>
									<span>{{ item.label }}</span>
									<el-tooltip
										v-if="item.labelTip"
										:content="item.labelTip"
										placement="top"
									>
										<el-icon><question-filled /></el-icon>
									</el-tooltip>
								</template>
								<el-checkbox-group v-model="formData[item.prop]">
									<el-checkbox
										v-for="option in item.options"
										:key="option.value"
										:value="option.value"
										:border="item.border"
										:disabled="option.disabled"
									>
										{{ option.label }}
									</el-checkbox>
								</el-checkbox-group>
							</el-form-item>

							<!-- 选择器 -->
							<el-form-item
								v-if="item.type === 'select'"
								:label="item.label"
								:prop="item.prop"
								:rules="item.rules"
							>
								<template #label>
									<span>{{ item.label }}</span>
									<el-tooltip
										v-if="item.labelTip"
										:content="item.labelTip"
										placement="top"
									>
										<el-icon><question-filled /></el-icon>
									</el-tooltip>
								</template>
								<el-select
									v-model="formData[item.prop]"
									:multiple="item.multiple"
									:filterable="item.filterable"
									:allow-create="item.allowCreate"
									:remote="item.remote"
									:remote-method="item.remoteMethod"
									:loading="item.loading"
									:disabled="item.disabled"
									:clearable="item.clearable"
									:placeholder="item.placeholder || `请选择${item.label}`"
									style="width: 100%"
								>
									<el-option
										v-for="option in item.options"
										:key="option.value"
										:label="option.label"
										:value="option.value"
										:disabled="option.disabled"
									/>
								</el-select>
							</el-form-item>

							<!-- 级联选择器 -->
							<el-form-item
								v-if="item.type === 'cascader'"
								:label="item.label"
								:prop="item.prop"
								:rules="item.rules"
							>
								<template #label>
									<span>{{ item.label }}</span>
									<el-tooltip
										v-if="item.labelTip"
										:content="item.labelTip"
										placement="top"
									>
										<el-icon><question-filled /></el-icon>
									</el-tooltip>
								</template>
								<!-- @ts-nocheck -->
								<el-cascader
									v-model="formData[item.prop]"
									:options="item.options"
									:props="item.props"
									:show-all-levels="item.showAllLevels"
									:collapse-tags="item.collapseTags"
									:separator="item.separator"
									:filterable="item.filterable"
									:clearable="item.clearable"
									:disabled="item.disabled"
									:placeholder="item.placeholder || `请选择${item.label}`"
									style="width: 100%"
								/>
							</el-form-item>
							<!-- @ts-check -->
							<!-- 开关 -->
							<el-form-item
								v-if="item.type === 'switch'"
								:label="item.label"
								:prop="item.prop"
								:rules="item.rules"
							>
								<template #label>
									<span>{{ item.label }}</span>
									<el-tooltip
										v-if="item.labelTip"
										:content="item.labelTip"
										placement="top"
									>
										<el-icon><question-filled /></el-icon>
									</el-tooltip>
								</template>
								<el-switch
									v-model="formData[item.prop]"
									:active-value="item.activeValue || true"
									:inactive-value="item.inactiveValue || false"
									:active-text="item.activeText"
									:inactive-text="item.inactiveText"
									:disabled="item.disabled"
								/>
							</el-form-item>

							<!-- 滑块 -->
							<el-form-item
								v-if="item.type === 'slider'"
								:label="item.label"
								:prop="item.prop"
								:rules="item.rules"
							>
								<template #label>
									<span>{{ item.label }}</span>
									<el-tooltip
										v-if="item.labelTip"
										:content="item.labelTip"
										placement="top"
									>
										<el-icon><question-filled /></el-icon>
									</el-tooltip>
								</template>
								<el-slider
									v-model="formData[item.prop]"
									:min="item.min"
									:max="item.max"
									:step="item.step"
									:show-stops="item.showStops"
									:show-input="item.showInput"
									:range="item.range"
									:vertical="item.vertical"
									:height="item.height"
									:marks="item.marks"
									:disabled="item.disabled"
								/>
							</el-form-item>

							<!-- 时间选择器 -->
							<el-form-item
								v-if="item.type === 'time-picker'"
								:label="item.label"
								:prop="item.prop"
								:rules="item.rules"
							>
								<template #label>
									<span>{{ item.label }}</span>
									<el-tooltip
										v-if="item.labelTip"
										:content="item.labelTip"
										placement="top"
									>
										<el-icon><question-filled /></el-icon>
									</el-tooltip>
								</template>
								<el-time-picker
									v-model="formData[item.prop]"
									:is-range="item.isRange"
									:arrow-control="item.arrowControl"
									:clearable="item.clearable"
									:disabled="item.disabled"
									:editable="item.editable"
									:format="item.format"
									:placeholder="item.placeholder || `请选择${item.label}`"
									:range-separator="item.rangeSeparator || '至'"
									:start-placeholder="item.startPlaceholder || '开始时间'"
									:end-placeholder="item.endPlaceholder || '结束时间'"
									:value-format="item.valueFormat"
									style="width: 100%"
								/>
							</el-form-item>

							<!-- 日期选择器 -->
							<el-form-item
								v-if="item.type === 'date-picker'"
								:label="item.label"
								:prop="item.prop"
								:rules="item.rules"
							>
								<template #label>
									<span>{{ item.label }}</span>
									<el-tooltip
										v-if="item.labelTip"
										:content="item.labelTip"
										placement="top"
									>
										<el-icon><question-filled /></el-icon>
									</el-tooltip>
								</template>
								<el-date-picker
									v-model="formData[item.prop]"
									:type="item.dateType || 'date'"
									:placeholder="item.placeholder || `请选择${item.label}`"
									:start-placeholder="item.startPlaceholder || '开始日期'"
									:end-placeholder="item.endPlaceholder || '结束日期'"
									:range-separator="item.rangeSeparator || '至'"
									:format="item.format || 'YYYY-MM-DD'"
									:value-format="item.valueFormat || 'YYYY-MM-DD'"
									:clearable="item.clearable"
									:disabled="item.disabled"
									:editable="item.editable"
									:shortcuts="item.shortcuts"
									style="width: 100%"
								/>
							</el-form-item>

							<!-- 日期时间选择器 -->
							<el-form-item
								v-if="item.type === 'datetime-picker'"
								:label="item.label"
								:prop="item.prop"
								:rules="item.rules"
							>
								<template #label>
									<span>{{ item.label }}</span>
									<el-tooltip
										v-if="item.labelTip"
										:content="item.labelTip"
										placement="top"
									>
										<el-icon><question-filled /></el-icon>
									</el-tooltip>
								</template>
								<el-date-picker
									v-model="formData[item.prop]"
									type="datetime"
									:placeholder="item.placeholder || `请选择${item.label}`"
									:format="item.format"
									:value-format="item.valueFormat"
									:clearable="item.clearable"
									:disabled="item.disabled"
									:editable="item.editable"
									style="width: 100%"
								/>
							</el-form-item>
							<!-- 评分 -->
							<el-form-item
								v-if="item.type === 'rate'"
								:label="item.label"
								:prop="item.prop"
								:rules="item.rules"
							>
								<template #label>
									<span>{{ item.label }}</span>
									<el-tooltip
										v-if="item.labelTip"
										:content="item.labelTip"
										placement="top"
									>
										<el-icon><question-filled /></el-icon>
									</el-tooltip>
								</template>
								<el-rate
									v-model="formData[item.prop]"
									:max="item.max || 5"
									:allow-half="item.allowHalf"
									:show-score="item.showScore"
									:disabled="item.disabled"
									:colors="item.colors"
									:void-color="item.voidColor"
									:disabled-void-color="item.disabledVoidColor"
									:icons="item.icons"
									:void-icon="item.voidIcon"
									:disabled-void-icon="item.disabledVoidIcon"
									:show-text="item.showText"
									:texts="item.texts"
									:text-color="item.textColor"
								/>
							</el-form-item>

							<!-- 颜色选择器 -->
							<el-form-item
								v-if="item.type === 'color-picker'"
								:label="item.label"
								:prop="item.prop"
								:rules="item.rules"
							>
								<template #label>
									<span>{{ item.label }}</span>
									<el-tooltip
										v-if="item.labelTip"
										:content="item.labelTip"
										placement="top"
									>
										<el-icon><question-filled /></el-icon>
									</el-tooltip>
								</template>
								<el-color-picker
									v-model="formData[item.prop]"
									:show-alpha="item.showAlpha"
									:color-format="item.colorFormat"
									:disabled="item.disabled"
									:predefine="item.predefine"
								/>
							</el-form-item>

							<!-- 穿梭框 -->
							<el-form-item
								v-if="item.type === 'transfer'"
								:label="item.label"
								:prop="item.prop"
								:rules="item.rules"
							>
								<template #label>
									<span>{{ item.label }}</span>
									<el-tooltip
										v-if="item.labelTip"
										:content="item.labelTip"
										placement="top"
									>
										<el-icon><question-filled /></el-icon>
									</el-tooltip>
								</template>
								<el-transfer
									v-model="formData[item.prop]"
									:data="item.data"
									:filterable="item.filterable"
									:filter-placeholder="item.filterPlaceholder || '请输入搜索内容'"
									:target-order="item.targetOrder"
									:titles="item.titles || ['列表1', '列表2']"
									:button-texts="item.buttonTexts"
									:render-content="item.renderContent"
									:format="item.format"
									:props="item.props"
									:left-default-checked="item.leftDefaultChecked"
									:right-default-checked="item.rightDefaultChecked"
									:disabled="item.disabled"
								/>
							</el-form-item>

							<!-- 自定义插槽 -->
							<slot
								v-if="item.type === 'slot'"
								:name="item.slotName"
								:data="formData"
								:item="item"
							/>
							<!-- <el-form-item
								v-if="item.type === 'slot'"
								:label="item.label"
								:prop="item.prop"
								:rules="item.rules"
							>
								<slot
									:name="item.slotName"
									:data="formData"
									:item="item"
								/>
							</el-form-item> -->
						</el-col>
					</template>
				</template>
			</el-row>
			<div class="flex justify-between formButtons">
				<!-- 表单左侧操作按钮 -->
				<div>
					<div
						v-if="config.leftButtons && config.leftButtons.length > 0"
						class="flex justify-end w-full"
					>
						<el-button
							v-for="(btn, idx) in config.leftButtons"
							v-show="btn.show === false ? false : true"
							:key="idx"
							:type="btn.type || ''"
							:icon="btn.icon"
							:loading="btn.loading"
							:disabled="btn.disabled"
							:plain="btn.plain"
							@click="handleButtonClick(btn)"
						>
							{{ btn.label }}
						</el-button>
					</div>
				</div>

				<!-- 表单操作按钮 -->
				<div v-if="config.buttons && config.buttons.length > 0">
					<div class="flex justify-end w-full">
						<el-button
							v-for="(btn, idx) in config.buttons"
							v-show="btn.show === false ? false : true"
							:key="idx"
							:type="btn.type || ''"
							:icon="btn.icon"
							:loading="btn.loading"
							:disabled="btn.disabled"
							:plain="btn.plain"
							@click="handleButtonClick(btn)"
						>
							{{ btn.label }}
						</el-button>
					</div>
				</div>
				<div v-else-if="!config.buttons && !config.hideDefaultButton">
					<div class="flex justify-end w-full">
						<el-button
							type="primary"
							icon="Search"
							@click="queryTableData()"
						>
							搜索
						</el-button>

						<el-button
							icon="Refresh"
							@click="
								() => {
									resetFields()
									queryTableData()
								}
							"
						>
							重置
						</el-button>
					</div>
				</div>
			</div>
		</el-form>

		<div v-if="config.tableShow">
			<el-table
				ref="tableRef"
				:data="tableData"
				class="mt-3"
				:max-height="500"
				center
				:default-sort="defaultSort"
				@selectionChange="selectList => emit('selectionChange', selectList)"
				@sortChange="handleSortChange"
			>
				<el-table-column
					v-if="config.tableShowSelection"
					type="selection"
					:selectable="config.tableSelection"
					:width="55"
					align="center"
				/>
				<el-table-column
					v-if="config.tableShowIndex"
					type="index"
					label="序号"
					:width="55"
					align="center"
				/>
				<el-table-column
					v-for="(item, index) in config.tableHeader"
					:key="index"
					:prop="item.prop"
					:label="item.label"
					:width="item.width || undefined"
					:sortable="item.sortable"
					:sort-orders="item.sortOrders || ['ascending', 'descending']"
					:show-overflow-tooltip="item.showOverflowTooltip"
					align="center"
				>
					<template #default="{ row }">
						<span v-if="item.format">{{ item.format(row[item.prop]) }}</span>

						<slot
							v-if="item.slotName"
							:name="item.slotName"
							:row="row"
							:value="row[item.prop]"
						/>

						<template v-if="item.custom">
							<span
								v-for="(btn, btnIndex) in item.tableEditBtn"
								:key="btnIndex"
							>
								<el-tooltip
									v-if="btn.tip"
									:content="btn.tip"
									placement="top"
								>
									<el-button
										v-show="btn.show === false ? false : true"
										:type="btn.type"
										:link="btn.link"
										:icon="btn.icon"
										:disabled="btn.disabled"
										@click="emit('tableEditClick', row, btn)"
									>
										{{ btn.label }}
									</el-button>
								</el-tooltip>
								<el-button
									v-else
									v-show="btn.show === false ? false : true"
									:type="btn.type"
									:link="btn.link"
									:icon="btn.icon"
									:disabled="btn.disabled"
									@click="emit('tableEditClick', row, btn)"
								>
									{{ btn.label }}
								</el-button>
							</span>
						</template>
					</template>
				</el-table-column>
			</el-table>
			<div
				v-if="total > 0"
				class="flex justify-end mt-3"
			>
				<el-pagination
					v-model:current-page="pageNum"
					v-model:page-size="pageSize"
					background
					layout="total, sizes, prev, pager, next, jumper"
					:total="total"
					@change="pageChange"
				/>
			</div>
		</div>
	</div>
</template>
<style lang="scss" scoped>
:deep(.el-form-item__label) {
	font-weight: 700;
}
</style>
