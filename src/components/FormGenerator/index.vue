<script lang="ts" setup>
import { QuestionFilled } from '@element-plus/icons-vue'
import { ref, watch, onMounted } from 'vue'

import type { FormConfig } from './types'
import type { FormInstance, Sort, TableInstance } from 'element-plus'

const tableRef = ref<null | TableInstance>(null)
const props = defineProps<{
	config: FormConfig
	modelValue: Record<string, any>
	defaultSort?: Sort
}>()

const emit = defineEmits<{
	'update:modelValue': [value: Record<string, any>]
	buttonClick: [event: string, value: any]
	tableEditClick: [row: any, btn: any]
	selectionChange: [value: Record<string, any>[]]
	customPageChange: []
	sortChange: [value: any]
}>()

const formRef = ref<FormInstance | null>(null)

const formData = computed({
	get() {
		return props.modelValue
	},
	set(val) {
		emit('update:modelValue', val)
	}
})

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
function validate() {
	return formRef.value?.validate()
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

const tableData = ref([])
const total = ref(0)
const pageNum = ref(1)
const pageSize = ref(10)

async function queryTableData(otherParams: Record<string, any> = {}) {
	await validate()

	const params = {
		...formData.value,
		...otherParams
	}

	if (!props.config.removePageParams) {
		params.pageNum = pageNum.value
		params.pageSize = pageSize.value
	}

	if (!props.config.api) return
	const result = await props.config.api(params)

	tableData.value = result[props.config.tableApiResultKey || 'rows'] || []
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

function resetPage(obj?: { pageNum?: number; pageSize?: number }) {
	pageNum.value = obj?.pageNum ? obj?.pageNum : 1
	pageSize.value = obj?.pageSize ? obj?.pageSize : 10
}

const refreshTable = ref(true)
watch(
	() => props.config.tableExpandAll,
	v => {
		refreshTable.value = false
		nextTick(() => {
			refreshTable.value = true
		})
	}
)

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
	queryTableData,
	getPageParams: () => ({
		pageNum: pageNum.value,
		pageSize: pageSize.value
	}),
	getTableData() {
		return tableData.value
	}
})
</script>

<template>
	<div class="w-full">
		<ElForm
			ref="formRef"
			:model="formData"
			:rules="config.formRules"
			:label-width="config.labelWidth || '120px'"
			:label-position="config.labelPosition || 'right'"
			:disabled="config.disabled"
			:inline="config.inline"
		>
			<ElRow :gutter="20">
				<template
					v-for="(item, index) in config.fields"
					:key="index"
				>
					<!-- 隐藏字段 -->
					<template v-if="item.hidden">
						<ElFormItem
							v-show="false"
							:prop="item.prop"
						>
							<component
								:is="getComponent(item)"
								v-model="formData[item.prop]"
							/>
						</ElFormItem>
					</template>

					<!-- 显示字段 -->
					<template v-else>
						<ElCol :span="item.span || config.span || 24">
							<!-- 输入框 -->
							<ElFormItem
								v-if="item.type === 'input'"
								:label="item.label"
								:prop="item.prop"
								:rules="item.rules"
							>
								<template #label>
									<span>{{ item.label }}</span>
									<ElTooltip
										v-if="item.labelTip"
										:content="item.labelTip"
										placement="top"
									>
										<ElIcon><QuestionFilled /></ElIcon>
									</ElTooltip>
								</template>
								<ElInput
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
									:autocomplete="item.showPassword ? 'new-password' : undefined"
								/>
							</ElFormItem>

							<!-- 文本域 -->
							<ElFormItem
								v-if="item.type === 'textarea'"
								:label="item.label"
								:prop="item.prop"
								:rules="item.rules"
							>
								<template #label>
									<span>{{ item.label }}</span>
									<ElTooltip
										v-if="item.labelTip"
										:content="item.labelTip"
										placement="top"
									>
										<ElIcon><QuestionFilled /></ElIcon>
									</ElTooltip>
								</template>
								<ElInput
									v-model="formData[item.prop]"
									type="textarea"
									:placeholder="item.placeholder || `请输入${item.label}`"
									:rows="item.rows || 2"
									style="width: 100%"
									:clearable="item.clearable"
								/>
							</ElFormItem>

							<!-- 数字输入框 -->
							<ElFormItem
								v-if="item.type === 'input-number'"
								:label="item.label"
								:prop="item.prop"
								:rules="item.rules"
							>
								<template #label>
									<span>{{ item.label }}</span>
									<ElTooltip
										v-if="item.labelTip"
										:content="item.labelTip"
										placement="top"
									>
										<ElIcon><QuestionFilled /></ElIcon>
									</ElTooltip>
								</template>
								<ElInputNumber
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
							</ElFormItem>

							<!-- 单选框 -->
							<ElFormItem
								v-if="item.type === 'radio'"
								:label="item.label"
								:prop="item.prop"
								:rules="item.rules"
							>
								<template #label>
									<span>{{ item.label }}</span>
									<ElTooltip
										v-if="item.labelTip"
										:content="item.labelTip"
										placement="top"
									>
										<ElIcon><QuestionFilled /></ElIcon>
									</ElTooltip>
								</template>
								<ElRadioGroup v-model="formData[item.prop]">
									<ElRadio
										v-for="option in item.options"
										:key="option.value"
										:value="option.value"
										:border="item.border"
										:disabled="option.disabled"
									>
										{{ option.label }}
									</ElRadio>
								</ElRadioGroup>
							</ElFormItem>

							<!-- 单选框按钮 -->
							<ElFormItem
								v-if="item.type === 'radio-button'"
								:label="item.label"
								:prop="item.prop"
								:rules="item.rules"
							>
								<template #label>
									<span>{{ item.label }}</span>
									<ElTooltip
										v-if="item.labelTip"
										:content="item.labelTip"
										placement="top"
									>
										<ElIcon><QuestionFilled /></ElIcon>
									</ElTooltip>
								</template>
								<ElRadioGroup v-model="formData[item.prop]">
									<ElRadioButton
										v-for="option in item.options"
										:key="option.value"
										:value="option.value"
										:border="item.border"
										:disabled="option.disabled"
									>
										{{ option.label }}
									</ElRadioButton>
								</ElRadioGroup>
							</ElFormItem>

							<!-- 复选框 -->
							<ElFormItem
								v-if="item.type === 'checkbox'"
								:label="item.label"
								:prop="item.prop"
								:rules="item.rules"
							>
								<template #label>
									<span>{{ item.label }}</span>
									<ElTooltip
										v-if="item.labelTip"
										:content="item.labelTip"
										placement="top"
									>
										<ElIcon><QuestionFilled /></ElIcon>
									</ElTooltip>
								</template>
								<ElCheckboxGroup v-model="formData[item.prop]">
									<ElCheckbox
										v-for="option in item.options"
										:key="option.value"
										:value="option.value"
										:border="item.border"
										:disabled="option.disabled"
									>
										{{ option.label }}
									</ElCheckbox>
								</ElCheckboxGroup>
							</ElFormItem>

							<!-- 选择器 -->
							<ElFormItem
								v-if="item.type === 'select'"
								:label="item.label"
								:prop="item.prop"
								:rules="item.rules"
							>
								<template #label>
									<span>{{ item.label }}</span>
									<ElTooltip
										v-if="item.labelTip"
										:content="item.labelTip"
										placement="top"
									>
										<ElIcon><QuestionFilled /></ElIcon>
									</ElTooltip>
								</template>
								<ElSelect
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
									<ElOption
										v-for="option in item.options"
										:key="option.value"
										:label="option.label"
										:value="option.value"
										:disabled="option.disabled"
									/>
								</ElSelect>
							</ElFormItem>

							<!-- 级联选择器 -->
							<ElFormItem
								v-if="item.type === 'cascader'"
								:label="item.label"
								:prop="item.prop"
								:rules="item.rules"
							>
								<template #label>
									<span>{{ item.label }}</span>
									<ElTooltip
										v-if="item.labelTip"
										:content="item.labelTip"
										placement="top"
									>
										<ElIcon><QuestionFilled /></ElIcon>
									</ElTooltip>
								</template>
								<!-- @ts-nocheck -->
								<ElCascader
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
							</ElFormItem>
							<!-- @ts-check -->
							<!-- 开关 -->
							<ElFormItem
								v-if="item.type === 'switch'"
								:label="item.label"
								:prop="item.prop"
								:rules="item.rules"
							>
								<template #label>
									<span>{{ item.label }}</span>
									<ElTooltip
										v-if="item.labelTip"
										:content="item.labelTip"
										placement="top"
									>
										<ElIcon><QuestionFilled /></ElIcon>
									</ElTooltip>
								</template>
								<ElSwitch
									v-model="formData[item.prop]"
									:active-value="item.activeValue || true"
									:inactive-value="item.inactiveValue || false"
									:active-text="item.activeText"
									:inactive-text="item.inactiveText"
									:disabled="item.disabled"
								/>
							</ElFormItem>

							<!-- 滑块 -->
							<ElFormItem
								v-if="item.type === 'slider'"
								:label="item.label"
								:prop="item.prop"
								:rules="item.rules"
							>
								<template #label>
									<span>{{ item.label }}</span>
									<ElTooltip
										v-if="item.labelTip"
										:content="item.labelTip"
										placement="top"
									>
										<ElIcon><QuestionFilled /></ElIcon>
									</ElTooltip>
								</template>
								<ElSlider
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
							</ElFormItem>

							<!-- 时间选择器 -->
							<ElFormItem
								v-if="item.type === 'time-picker'"
								:label="item.label"
								:prop="item.prop"
								:rules="item.rules"
							>
								<template #label>
									<span>{{ item.label }}</span>
									<ElTooltip
										v-if="item.labelTip"
										:content="item.labelTip"
										placement="top"
									>
										<ElIcon><QuestionFilled /></ElIcon>
									</ElTooltip>
								</template>
								<ElTimePicker
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
									:default-time="item.defaultTime"
									style="width: 100%"
								/>
							</ElFormItem>

							<!-- 日期选择器 -->
							<ElFormItem
								v-if="item.type === 'date-picker'"
								:label="item.label"
								:prop="item.prop"
								:rules="item.rules"
							>
								<template #label>
									<span>{{ item.label }}</span>
									<ElTooltip
										v-if="item.labelTip"
										:content="item.labelTip"
										placement="top"
									>
										<ElIcon><QuestionFilled /></ElIcon>
									</ElTooltip>
								</template>
								<ElDatePicker
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
							</ElFormItem>

							<!-- 日期时间选择器 -->
							<ElFormItem
								v-if="item.type === 'datetime-picker'"
								:label="item.label"
								:prop="item.prop"
								:rules="item.rules"
							>
								<template #label>
									<span>{{ item.label }}</span>
									<ElTooltip
										v-if="item.labelTip"
										:content="item.labelTip"
										placement="top"
									>
										<ElIcon><QuestionFilled /></ElIcon>
									</ElTooltip>
								</template>
								<ElDatePicker
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
							</ElFormItem>
							<!-- 评分 -->
							<ElFormItem
								v-if="item.type === 'rate'"
								:label="item.label"
								:prop="item.prop"
								:rules="item.rules"
							>
								<template #label>
									<span>{{ item.label }}</span>
									<ElTooltip
										v-if="item.labelTip"
										:content="item.labelTip"
										placement="top"
									>
										<ElIcon><QuestionFilled /></ElIcon>
									</ElTooltip>
								</template>
								<ElRate
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
							</ElFormItem>

							<!-- 颜色选择器 -->
							<ElFormItem
								v-if="item.type === 'color-picker'"
								:label="item.label"
								:prop="item.prop"
								:rules="item.rules"
							>
								<template #label>
									<span>{{ item.label }}</span>
									<ElTooltip
										v-if="item.labelTip"
										:content="item.labelTip"
										placement="top"
									>
										<ElIcon><QuestionFilled /></ElIcon>
									</ElTooltip>
								</template>
								<ElColorPicker
									v-model="formData[item.prop]"
									:show-alpha="item.showAlpha"
									:color-format="item.colorFormat"
									:disabled="item.disabled"
									:predefine="item.predefine"
								/>
							</ElFormItem>

							<!-- 穿梭框 -->
							<ElFormItem
								v-if="item.type === 'transfer'"
								:label="item.label"
								:prop="item.prop"
								:rules="item.rules"
							>
								<template #label>
									<span>{{ item.label }}</span>
									<ElTooltip
										v-if="item.labelTip"
										:content="item.labelTip"
										placement="top"
									>
										<ElIcon><QuestionFilled /></ElIcon>
									</ElTooltip>
								</template>
								<ElTransfer
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
							</ElFormItem>

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
						</ElCol>
					</template>
				</template>
			</ElRow>
			<div class="flex justify-between formButtons">
				<!-- 表单左侧操作按钮 -->
				<div>
					<div
						v-if="config.leftButtons && config.leftButtons.length > 0"
						class="flex justify-end w-full"
					>
						<ElButton
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
						</ElButton>
					</div>
				</div>

				<!-- 表单操作按钮 -->
				<div v-if="config.buttons && config.buttons.length > 0">
					<div class="flex justify-end w-full">
						<ElButton
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
						</ElButton>
					</div>
				</div>
				<div v-else-if="!config.buttons && !config.hideDefaultButton">
					<div class="flex justify-end w-full">
						<ElButton
							type="primary"
							icon="Search"
							@click="queryTableData()"
						>
							搜索
						</ElButton>

						<ElButton
							icon="Refresh"
							@click="
								() => {
									resetFields()
									queryTableData()
								}
							"
						>
							重置
						</ElButton>
					</div>
				</div>
			</div>
		</ElForm>

		<div v-if="config.tableShow">
			<ElTable
				v-if="refreshTable"
				ref="tableRef"
				:data="tableData"
				class="mt-3"
				:default-sort="defaultSort"
				:tree-props="config.tableTreeProps"
				:row-key="config.tableTreeRowKey"
				:default-expand-all="config.tableExpandAll"
				@selectionChange="selectList => emit('selectionChange', selectList)"
				@sortChange="handleSortChange"
			>
				<ElTableColumn
					v-if="config.tableShowSelection"
					type="selection"
					:selectable="config.tableSelection"
					:width="55"
					align="center"
				/>
				<ElTableColumn
					v-if="config.tableShowIndex"
					type="index"
					label="序号"
					:width="55"
					align="center"
				/>
				<ElTableColumn
					v-for="(item, index) in config.tableHeader"
					:key="index"
					:prop="item.prop"
					:label="item.label"
					:width="item.width || undefined"
					:sortable="item.sortable"
					:sort-orders="item.sortOrders || ['ascending', 'descending']"
					:show-overflow-tooltip="item.showOverflowTooltip"
					:align="item.align || 'center'"
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
								<ElTooltip
									v-if="btn.tip"
									:content="btn.tip"
									placement="top"
								>
									<ElButton
										v-show="typeof btn.show === 'function' ? btn.show(row) : typeof btn.show === 'boolean' ? btn.show : true"
										:type="btn.type"
										:link="btn.link"
										:icon="btn.icon"
										:disabled="btn.disabled"
										@click="emit('tableEditClick', row, btn)"
									>
										{{ btn.label }}
									</ElButton>
								</ElTooltip>
								<ElButton
									v-else
									v-show="typeof btn.show === 'function' ? btn.show(row) : typeof btn.show === 'boolean' ? btn.show : true"
									:type="btn.type"
									:link="btn.link"
									:icon="btn.icon"
									:disabled="btn.disabled"
									@click="emit('tableEditClick', row, btn)"
								>
									{{ btn.label }}
								</ElButton>
							</span>
						</template>
					</template>
				</ElTableColumn>
			</ElTable>
			<div
				v-if="total > 0"
				class="flex justify-end mt-3"
			>
				<ElPagination
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
