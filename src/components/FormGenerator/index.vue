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
	clearValidate,
	getPageParams: () => ({
		pageNum: pageNum.value,
		pageSize: pageSize.value
	}),
	getTableData() {
		return tableData.value
	},
	queryTableData,
	resetFields,
	resetPage,
	validate
})
</script>

<template>
	<div class="w-full">
		<ElForm
			ref="formRef"
			:disabled="config.disabled"
			:inline="config.inline"
			:labelPosition="config.labelPosition || 'right'"
			:labelWidth="config.labelWidth || '120px'"
			:model="formData"
			:rules="config.formRules"
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
									:autocomplete="item.showPassword ? 'new-password' : undefined"
									:clearable="item.clearable"
									:disabled="item.disabled"
									:maxlength="item.maxlength"
									:placeholder="item.placeholder || `请输入${item.label}`"
									:prefixIcon="item.prefixIcon"
									:readonly="item.readonly"
									:showPassword="item.showPassword"
									:showWordLimit="item.showWordLimit"
									:suffixIcon="item.suffixIcon"
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
									:clearable="item.clearable"
									:placeholder="item.placeholder || `请输入${item.label}`"
									:rows="item.rows || 2"
									style="width: 100%"
									type="textarea"
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
									:controls="item.controls"
									:controlsPosition="item.controlsPosition"
									:disabled="item.disabled"
									:max="item.max"
									:min="item.min"
									:placeholder="item.placeholder || `请输入${item.label}`"
									:precision="item.precision"
									:step="item.step"
									:stepStrictly="item.stepStrictly"
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
										:border="item.border"
										:disabled="option.disabled"
										:value="option.value"
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
										:border="item.border"
										:disabled="option.disabled"
										:value="option.value"
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
										:border="item.border"
										:disabled="option.disabled"
										:value="option.value"
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
									:allowCreate="item.allowCreate"
									:clearable="item.clearable"
									:disabled="item.disabled"
									:filterable="item.filterable"
									:loading="item.loading"
									:multiple="item.multiple"
									:placeholder="item.placeholder || `请选择${item.label}`"
									:remote="item.remote"
									:remoteMethod="item.remoteMethod"
									style="width: 100%"
								>
									<ElOption
										v-for="option in item.options"
										:key="option.value"
										:disabled="option.disabled"
										:label="option.label"
										:value="option.value"
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
									:clearable="item.clearable"
									:collapseTags="item.collapseTags"
									:disabled="item.disabled"
									:filterable="item.filterable"
									:options="item.options"
									:placeholder="item.placeholder || `请选择${item.label}`"
									:props="item.props"
									:separator="item.separator"
									:showAllLevels="item.showAllLevels"
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
									:activeText="item.activeText"
									:activeValue="item.activeValue || true"
									:disabled="item.disabled"
									:inactiveText="item.inactiveText"
									:inactiveValue="item.inactiveValue || false"
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
									:disabled="item.disabled"
									:height="item.height"
									:marks="item.marks"
									:max="item.max"
									:min="item.min"
									:range="item.range"
									:showInput="item.showInput"
									:showStops="item.showStops"
									:step="item.step"
									:vertical="item.vertical"
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
									:arrowControl="item.arrowControl"
									:clearable="item.clearable"
									:defaultTime="item.defaultTime"
									:disabled="item.disabled"
									:editable="item.editable"
									:endPlaceholder="item.endPlaceholder || '结束时间'"
									:format="item.format"
									:isRange="item.isRange"
									:placeholder="item.placeholder || `请选择${item.label}`"
									:rangeSeparator="item.rangeSeparator || '至'"
									:startPlaceholder="item.startPlaceholder || '开始时间'"
									style="width: 100%"
									:valueFormat="item.valueFormat"
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
									:clearable="item.clearable"
									:disabled="item.disabled"
									:editable="item.editable"
									:endPlaceholder="item.endPlaceholder || '结束日期'"
									:format="item.format || 'YYYY-MM-DD'"
									:placeholder="item.placeholder || `请选择${item.label}`"
									:rangeSeparator="item.rangeSeparator || '至'"
									:shortcuts="item.shortcuts"
									:startPlaceholder="item.startPlaceholder || '开始日期'"
									style="width: 100%"
									:type="item.dateType || 'date'"
									:valueFormat="item.valueFormat || 'YYYY-MM-DD'"
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
									:clearable="item.clearable"
									:disabled="item.disabled"
									:editable="item.editable"
									:format="item.format"
									:placeholder="item.placeholder || `请选择${item.label}`"
									style="width: 100%"
									type="datetime"
									:valueFormat="item.valueFormat"
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
									:allowHalf="item.allowHalf"
									:colors="item.colors"
									:disabled="item.disabled"
									:disabledVoidColor="item.disabledVoidColor"
									:disabledVoidIcon="item.disabledVoidIcon"
									:icons="item.icons"
									:max="item.max || 5"
									:showScore="item.showScore"
									:showText="item.showText"
									:textColor="item.textColor"
									:texts="item.texts"
									:voidColor="item.voidColor"
									:voidIcon="item.voidIcon"
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
									:colorFormat="item.colorFormat"
									:disabled="item.disabled"
									:predefine="item.predefine"
									:showAlpha="item.showAlpha"
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
									:buttonTexts="item.buttonTexts"
									:data="item.data"
									:disabled="item.disabled"
									:filterPlaceholder="item.filterPlaceholder || '请输入搜索内容'"
									:filterable="item.filterable"
									:format="item.format"
									:leftDefaultChecked="item.leftDefaultChecked"
									:props="item.props"
									:renderContent="item.renderContent"
									:rightDefaultChecked="item.rightDefaultChecked"
									:targetOrder="item.targetOrder"
									:titles="item.titles || ['列表1', '列表2']"
								/>
							</ElFormItem>

							<!-- 自定义插槽 -->
							<slot
								v-if="item.type === 'slot'"
								:data="formData"
								:item="item"
								:name="item.slotName"
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
							:disabled="btn.disabled"
							:icon="btn.icon"
							:loading="btn.loading"
							:plain="btn.plain"
							:type="btn.type || ''"
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
							:disabled="btn.disabled"
							:icon="btn.icon"
							:loading="btn.loading"
							:plain="btn.plain"
							:type="btn.type || ''"
							@click="handleButtonClick(btn)"
						>
							{{ btn.label }}
						</ElButton>
					</div>
				</div>
				<div v-else-if="!config.buttons && !config.hideDefaultButton">
					<div class="flex justify-end w-full">
						<ElButton
							icon="Search"
							type="primary"
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
				class="mt-3"
				:data="tableData"
				:defaultExpandAll="config.tableExpandAll"
				:defaultSort="defaultSort"
				:rowKey="config.tableTreeRowKey"
				:treeProps="config.tableTreeProps"
				@selectionChange="selectList => emit('selectionChange', selectList)"
				@sortChange="handleSortChange"
			>
				<ElTableColumn
					v-if="config.tableShowSelection"
					align="center"
					:selectable="config.tableSelection"
					type="selection"
					:width="55"
				/>
				<ElTableColumn
					v-if="config.tableShowIndex"
					align="center"
					label="序号"
					type="index"
					:width="55"
				/>
				<ElTableColumn
					v-for="(item, index) in config.tableHeader"
					:key="index"
					:align="item.align || 'center'"
					:label="item.label"
					:prop="item.prop"
					:showOverflowTooltip="item.showOverflowTooltip"
					:sortOrders="item.sortOrders || ['ascending', 'descending']"
					:sortable="item.sortable"
					:width="item.width || undefined"
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
										:disabled="btn.disabled"
										:icon="btn.icon"
										:link="btn.link"
										:type="btn.type"
										@click="emit('tableEditClick', row, btn)"
									>
										{{ btn.label }}
									</ElButton>
								</ElTooltip>
								<ElButton
									v-else
									v-show="typeof btn.show === 'function' ? btn.show(row) : typeof btn.show === 'boolean' ? btn.show : true"
									:disabled="btn.disabled"
									:icon="btn.icon"
									:link="btn.link"
									:type="btn.type"
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
					v-model:currentPage="pageNum"
					v-model:pageSize="pageSize"
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
