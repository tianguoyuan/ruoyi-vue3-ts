<script lang="ts" setup>
import { ref, watch, onMounted } from 'vue'
import type { FormConfig } from './types'

const props = defineProps<{
	config: FormConfig
	modelValue: Record<string, any>
}>()

const emit = defineEmits<{
	'update:modelValue': [value: Record<string, any>]
	buttonClick: [value: string, value: any]
	tableEditClick: [value: any, index: any]
	selectionChange: [value: Record<string, any>[]]
}>()

const formRef = ref<any>(null)
const formData = ref<Record<string, any>>({})
const formRules = ref<Record<string, any>>({})

// 初始化表单数据
const initFormData = () => {
	const data: Record<string, any> = {}
	props.config.fields?.forEach(field => {
		data[field.prop] = field.defaultValue !== undefined ? field.defaultValue : ''
	})
	formData.value = { ...data, ...props.modelValue }
}

// 获取组件
const getComponent = (item: any) => {
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
const validate = async () => {
	try {
		await formRef.value.validate()
		return true
	} catch (error) {
		return false
	}
}

// 重置表单
const resetFields = () => {
	formRef.value.resetFields()
}

// 清除验证
const clearValidate = (props: string | string[]) => {
	formRef.value.clearValidate(props)
}

// 按钮点击事件
const handleButtonClick = (btn: any) => {
	if (btn.handler) {
		btn.handler(formData.value)
	} else {
		emit('buttonClick', btn.event, formData.value)
	}
}

// 监听外部传入的modelValue变化
watch(
	() => props.modelValue,
	newVal => {
		formData.value = { ...formData.value, ...newVal }
	},
	{ deep: true }
)

// 监听表单数据变化
watch(
	formData,
	newVal => {
		emit('update:modelValue', newVal)
	},
	{ deep: true }
)

const tableData = ref([])
const total = ref(0)
const pageNum = ref(1)
const pageSize = ref(10)

async function queryTableData(otherParams: Record<string, any> = {}) {
	const isPass = await validate()
	if (!isPass) return
	const params = { ...formData.value, pageNum: pageNum.value, pageSize: pageSize.value, ...otherParams }
	if (!props.config.api) return
	const result = await props.config.api(params)

	tableData.value = result.rows || []
	total.value = result.total || 0
}
function pageChange() {
	queryTableData()
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
	clearValidate,
	getFormData: () => formData.value,
	queryTableData
})
</script>

<template>
	<div class="w-full">
		<el-form
			ref="formRef"
			:model="formData"
			:rules="formRules"
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

							<!-- 数字输入框 -->
							<el-form-item
								v-if="item.type === 'input-number'"
								:label="item.label"
								:prop="item.prop"
								:rules="item.rules"
							>
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
								<el-radio-group v-model="formData[item.prop]">
									<el-radio
										v-for="option in item.options"
										:key="option.value"
										:label="option.value"
										:border="item.border"
										:disabled="option.disabled"
									>
										{{ option.label }}
									</el-radio>
								</el-radio-group>
							</el-form-item>

							<!-- 复选框 -->
							<el-form-item
								v-if="item.type === 'checkbox'"
								:label="item.label"
								:prop="item.prop"
								:rules="item.rules"
							>
								<el-checkbox-group v-model="formData[item.prop]">
									<el-checkbox
										v-for="option in item.options"
										:key="option.value"
										:label="option.value"
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

							<!-- 开关 -->
							<el-form-item
								v-if="item.type === 'switch'"
								:label="item.label"
								:prop="item.prop"
								:rules="item.rules"
							>
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
								<el-date-picker
									v-model="formData[item.prop]"
									:type="item.dateType || 'date'"
									:placeholder="item.placeholder || `请选择${item.label}`"
									:start-placeholder="item.startPlaceholder || '开始日期'"
									:end-placeholder="item.endPlaceholder || '结束日期'"
									:range-separator="item.rangeSeparator || '至'"
									:format="item.format"
									:value-format="item.valueFormat"
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
							<el-form-item
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
							</el-form-item>
						</el-col>
					</template>
				</template>
			</el-row>

			<!-- 表单操作按钮 -->
			<el-form-item v-if="config.buttons && config.buttons.length > 0">
				<div class="flex justify-end w-full">
					<el-button
						v-for="(btn, idx) in config.buttons"
						:key="idx"
						:type="btn.type || 'primary'"
						:icon="btn.icon"
						:loading="btn.loading"
						:disabled="btn.disabled"
						@click="handleButtonClick(btn)"
					>
						{{ btn.label }}
					</el-button>
				</div>
			</el-form-item>
		</el-form>

		<div v-if="config.tableShow">
			<el-table
				ref="tableRef"
				:data="tableData"
				class="mt-3"
				:max-height="500"
				center
				border
				@selectionChange="selectList => emit('selectionChange', selectList)"
			>
				<el-table-column
					v-if="config.tableShowSelection"
					type="selection"
					:selectable="config.tableSelection"
				/>
				<el-table-column
					v-if="config.tableShowIndex"
					type="index"
				/>
				<el-table-column
					v-for="(item, index) in config.tableHeader"
					:key="index"
					:prop="item.prop"
					:label="item.label"
					:width="item.width || undefined"
				>
					<template
						v-if="item.custom"
						#default="{ row }"
					>
						<el-button
							v-for="(btn, btnIndex) in item.tableEditBtn"
							:key="btnIndex"
							:type="btn.type"
							@click="emit('tableEditClick', row, btn)"
						>
							{{ btn.label }}
						</el-button>
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
					layout="prev, pager, next, sizes, total"
					:total="total"
					@change="pageChange"
				/>
			</div>
		</div>
	</div>
</template>
