import type { CascaderOption, FormRules } from 'element-plus'

// 基础字段类型
export interface BaseField {
	type: string
	label: string
	prop: string
	defaultValue?: any
	rules?: any[]
	disabled?: boolean
	hidden?: boolean
	span?: number // 栅格布局，占多少列
	labelTip?: string
}

// 输入框
export interface InputField extends BaseField {
	type: 'input'
	placeholder?: string
	clearable?: boolean
	showPassword?: boolean
	prefixIcon?: string
	suffixIcon?: string
	maxlength?: number
	showWordLimit?: boolean
	readonly?: boolean
}

// 文本域
export interface TextAreaField extends BaseField {
	type: 'textarea'
	placeholder?: string
	clearable?: boolean
	maxlength?: number
	showWordLimit?: boolean
	readonly?: boolean
	rows?: number
}

// 数字输入框
export interface InputNumberField extends BaseField {
	type: 'input-number'
	min?: number
	max?: number
	step?: number
	stepStrictly?: boolean
	precision?: number
	controlsPosition?: 'right' | ''
	controls?: boolean
	placeholder?: string
}

// 单选框
export interface RadioField extends BaseField {
	type: 'radio'
	options: Array<{ label: string; value: any; disabled?: boolean }>
	border?: boolean
}

// 单选框按钮
export interface RadioButtonField extends BaseField {
	type: 'radio-button'
	options: Array<{ label: string; value: any; disabled?: boolean }>
	border?: boolean
}

// 复选框
export interface CheckboxField extends BaseField {
	type: 'checkbox'
	options: Array<{ label: string; value: any; disabled?: boolean }>
	border?: boolean
}

// 选择器
type ISelectOptions = { label: string; value: any; disabled?: boolean }
export interface SelectField extends BaseField {
	type: 'select'
	options: Array<ISelectOptions> // | globalThis.Ref<ISelectOptions[]>
	multiple?: boolean
	filterable?: boolean
	allowCreate?: boolean
	remote?: boolean
	remoteMethod?: (query: string) => Promise<any>
	loading?: boolean
	clearable?: boolean
	placeholder?: string
}

// 级联选择器
export interface CascaderField extends BaseField {
	type: 'cascader'
	options: CascaderOption[] // | globalThis.Ref<CascaderOption[]>
	props?: {
		value?: string
		label?: string
		children?: string
		/**是否全路径Array false最后一个节点String */
		emitPath?: boolean
		/**是否可以选择父节点 */
		checkStrictly?: boolean
	}
	showAllLevels?: boolean
	collapseTags?: boolean
	separator?: string
	filterable?: boolean
	clearable?: boolean
	placeholder?: string
}

// 开关
export interface SwitchField extends BaseField {
	type: 'switch'
	activeValue?: any
	inactiveValue?: any
	activeText?: string
	inactiveText?: string
}

// 滑块
export interface SliderField extends BaseField {
	type: 'slider'
	min?: number
	max?: number
	step?: number
	showStops?: boolean
	showInput?: boolean
	range?: boolean
	vertical?: boolean
	height?: string
	marks?: Record<number, any>
}

// 时间选择器
export interface TimePickerField extends BaseField {
	type: 'time-picker'
	isRange?: boolean
	arrowControl?: boolean
	clearable?: boolean
	editable?: boolean
	format?: string
	placeholder?: string
	rangeSeparator?: string
	startPlaceholder?: string
	endPlaceholder?: string
	valueFormat?: string
}

// 日期选择器
export interface DatePickerField extends BaseField {
	type: 'date-picker'
	dateType?: 'year' | 'month' | 'date' | 'dates' | 'week' | 'datetime' | 'datetimerange' | 'daterange'
	placeholder?: string
	startPlaceholder?: string
	endPlaceholder?: string
	rangeSeparator?: string
	format?: string
	valueFormat?: string
	clearable?: boolean
	editable?: boolean
	shortcuts?: Array<{ text: string; value: Date | [Date, Date] }>
}

// 日期时间选择器
export interface DateTimePickerField extends BaseField {
	type: 'datetime-picker'
	placeholder?: string
	format?: string
	valueFormat?: string
	clearable?: boolean
	editable?: boolean
}

// 上传组件
export interface UploadField extends BaseField {
	type: 'upload'
	action: string
	multiple?: boolean
	limit?: number
	accept?: string
	listType?: 'text' | 'picture' | 'picture-card'
	autoUpload?: boolean
	drag?: boolean
	beforeUpload?: (file: File) => boolean | Promise<any>
	onSuccess?: (response: any, file: File, fileList: File[]) => void
	onError?: (err: Error, file: File, fileList: File[]) => void
	onProgress?: (event: ProgressEvent, file: File, fileList: File[]) => void
	onChange?: (file: File, fileList: File[]) => void
	onRemove?: (file: File, fileList: File[]) => void
	onExceed?: (files: File[], fileList: File[]) => void
	showFileList?: boolean
	headers?: Record<string, string>
	data?: Record<string, any>
	buttonType?: string
	buttonText?: string
	tip?: string
}

// 评分
export interface RateField extends BaseField {
	type: 'rate'
	max?: number
	allowHalf?: boolean
	showScore?: boolean
	colors?: string[]
	voidColor?: string
	disabledVoidColor?: string
	icons?: string[]
	voidIcon?: string
	disabledVoidIcon?: string
	showText?: boolean
	texts?: string[]
	textColor?: string
}

// 颜色选择器
export interface ColorPickerField extends BaseField {
	type: 'color-picker'
	showAlpha?: boolean
	colorFormat?: 'hsl' | 'hsv' | 'hex' | 'rgb'
	predefine?: string[]
}

// 穿梭框
export interface TransferField extends BaseField {
	type: 'transfer'
	data: Array<{ key: any; label: string; disabled?: boolean }>
	filterable?: boolean
	filterPlaceholder?: string
	targetOrder?: 'original' | 'push' | 'unshift'
	titles?: [string, string]
	buttonTexts?: [string, string]
	renderContent?: (h: any, option: any) => any
	format?: { noChecked?: string; hasChecked?: string }
	props?: { key?: string; label?: string; disabled?: string }
	leftDefaultChecked?: any[]
	rightDefaultChecked?: any[]
}

// 富文本编辑器
export interface EditorField extends BaseField {
	type: 'editor'
	editorConfig?: Record<string, any>
}

// 自定义插槽
export interface SlotField extends BaseField {
	type: 'slot'
	slotName: string
}

// 表格字段
export interface TableField extends BaseField {
	type: 'table'
	columns: Array<{
		prop: string
		label: string
		width?: string | number
		minWidth?: string | number
		type?: string
		sortable?: boolean | 'custom'
		formatter?: (row: any, column: any, cellValue: any, index: number) => any
	}>
	data?: any[]
	border?: boolean
	stripe?: boolean
	size?: 'large' | 'default' | 'small'
	showHeader?: boolean
	highlightCurrentRow?: boolean
	maxHeight?: string | number
	height?: string | number
	rowKey?: string | ((row: any) => string)
	emptyText?: string
	defaultExpandAll?: boolean
	expandRowKeys?: any[]
	rowClassName?: (row: any, rowIndex: number) => string
	rowStyle?: (row: any, rowIndex: number) => any
	cellClassName?: (row: any, column: any, rowIndex: number, columnIndex: number) => string
	cellStyle?: (row: any, column: any, rowIndex: number, columnIndex: number) => any
	headerRowClassName?: (row: any, rowIndex: number) => string
	headerRowStyle?: (row: any, rowIndex: number) => any
	headerCellClassName?: (row: any, column: any, rowIndex: number, columnIndex: number) => string
	headerCellStyle?: (row: any, column: any, rowIndex: number, columnIndex: number) => any
	showSummary?: boolean
	sumText?: string
	summaryMethod?: (params: { columns: any[]; data: any[] }) => string[]
	spanMethod?: (params: {
		row: any
		column: any
		rowIndex: number
		columnIndex: number
	}) => number[] | { rowspan: number; colspan: number }
	selectOnIndeterminate?: boolean
	indent?: number
	lazy?: boolean
	load?: (row: any, treeNode: any, resolve: (data: any[]) => void) => void
	treeProps?: { hasChildren?: string; children?: string }
}

// 按钮配置
export interface FormButton {
	label: string
	type?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'text'
	icon?: string
	loading?: boolean
	disabled?: boolean
	event?: string
	handler?: (formData: any) => void
	plain?: boolean
	show?: boolean
}

// 表单配置
export interface FormConfig {
	modelValue?: {
		prop: ''
		order: ''
	}
	labelWidth?: string
	labelPosition?: 'left' | 'right' | 'top'
	size?: 'large' | 'default' | 'small'
	disabled?: boolean
	inline?: boolean
	span?: number // 栅格布局，占多少列

	api?: (v: any) => Promise<any>
	tableShow?: boolean
	// 是否隐藏默认搜索重置
	hideDefaultButton?: boolean
	/**初始不查询 */
	tableInitQueryRefuse?: boolean
	/**显示多选框 */
	tableShowSelection?: boolean
	tableSelection?: (row: any, index: number) => boolean
	/**显示序号 */
	tableShowIndex?: boolean
	tableHeader?: {
		prop: string
		label: string
		width?: string
		sortable?: string
		sortOrders?: ('ascending' | 'descending')[]
		showOverflowTooltip?: boolean
		custom?: boolean
		slotName?: string
		format?: (v: string) => string
		tableEditBtn?: {
			label?: string
			tip?: string
			show?: boolean | ((row: any) => boolean)
			type?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'text'
			link?: boolean
			icon?: string
			disabled?: boolean
			event: string
		}[]
	}[]

	fields: Array<
		| InputField
		| TextAreaField
		| InputNumberField
		| RadioField
		| RadioButtonField
		| CheckboxField
		| SelectField
		| CascaderField
		| SwitchField
		| SliderField
		| TimePickerField
		| DatePickerField
		| DateTimePickerField
		| UploadField
		| RateField
		| ColorPickerField
		| TransferField
		| EditorField
		| SlotField
		| TableField
	>
	buttons?: FormButton[]
	leftButtons?: FormButton[]
	/**是否自定义修改页面函数 */
	customPageChange?: boolean

	formRules?: FormRules
}

// 表格操作列
export interface TableActionColumn {
	label: string
	width?: string | number
	fixed?: 'left' | 'right'
	buttons: Array<{
		text: string
		type?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'text'
		icon?: string
		disabled?: boolean | ((row: any) => boolean)
		handler: (row: any, index: number) => void
	}>
}
