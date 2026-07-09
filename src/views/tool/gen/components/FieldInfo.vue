<script setup lang="ts">
import { optionselect } from '@/api/system/dict'

const props = defineProps<{
	columns: any[]
}>()

const dictOptions = ref<API.IOptionselect['data']>([])

function init() {
	/** 查询字典下拉列表 */
	optionselect().then(response => {
		dictOptions.value = response.data
	})
}

init()
</script>

<template>
	<ElTable
		ref="dragTable"
		:data="props.columns"
		rowKey="columnId"
	>
		<ElTableColumn
			className="allowDrag"
			label="序号"
			minWidth="5%"
			type="index"
		/>
		<ElTableColumn
			className="allowDrag"
			label="字段列名"
			minWidth="10%"
			prop="columnName"
			:showOverflowTooltip="true"
		/>
		<ElTableColumn
			label="字段描述"
			minWidth="10%"
		>
			<template #default="scope">
				<ElInput v-model="scope.row.columnComment" />
			</template>
		</ElTableColumn>
		<ElTableColumn
			label="物理类型"
			minWidth="10%"
			prop="columnType"
			:showOverflowTooltip="true"
		/>
		<ElTableColumn
			label="Java类型"
			minWidth="11%"
		>
			<template #default="scope">
				<ElSelect v-model="scope.row.javaType">
					<ElOption
						label="Long"
						value="Long"
					/>
					<ElOption
						label="String"
						value="String"
					/>
					<ElOption
						label="Integer"
						value="Integer"
					/>
					<ElOption
						label="Double"
						value="Double"
					/>
					<ElOption
						label="BigDecimal"
						value="BigDecimal"
					/>
					<ElOption
						label="Date"
						value="Date"
					/>
					<ElOption
						label="Boolean"
						value="Boolean"
					/>
				</ElSelect>
			</template>
		</ElTableColumn>
		<ElTableColumn
			label="java属性"
			minWidth="10%"
		>
			<template #default="scope">
				<ElInput v-model="scope.row.javaField" />
			</template>
		</ElTableColumn>

		<ElTableColumn
			label="插入"
			minWidth="5%"
		>
			<template #default="scope">
				<ElCheckbox
					v-model="scope.row.isInsert"
					falseValue="0"
					trueValue="1"
				/>
			</template>
		</ElTableColumn>
		<ElTableColumn
			label="编辑"
			minWidth="5%"
		>
			<template #default="scope">
				<ElCheckbox
					v-model="scope.row.isEdit"
					falseValue="0"
					trueValue="1"
				/>
			</template>
		</ElTableColumn>
		<ElTableColumn
			label="列表"
			minWidth="5%"
		>
			<template #default="scope">
				<ElCheckbox
					v-model="scope.row.isList"
					falseValue="0"
					trueValue="1"
				/>
			</template>
		</ElTableColumn>
		<ElTableColumn
			label="查询"
			minWidth="5%"
		>
			<template #default="scope">
				<ElCheckbox
					v-model="scope.row.isQuery"
					falseValue="0"
					trueValue="1"
				/>
			</template>
		</ElTableColumn>
		<ElTableColumn
			label="查询方式"
			minWidth="10%"
		>
			<template #default="scope">
				<ElSelect v-model="scope.row.queryType">
					<ElOption
						label="="
						value="EQ"
					/>
					<ElOption
						label="!="
						value="NE"
					/>
					<ElOption
						label=">"
						value="GT"
					/>
					<ElOption
						label=">="
						value="GTE"
					/>
					<ElOption
						label="<"
						value="LT"
					/>
					<ElOption
						label="<="
						value="LTE"
					/>
					<ElOption
						label="LIKE"
						value="LIKE"
					/>
					<ElOption
						label="BETWEEN"
						value="BETWEEN"
					/>
				</ElSelect>
			</template>
		</ElTableColumn>
		<ElTableColumn
			label="必填"
			minWidth="5%"
		>
			<template #default="scope">
				<ElCheckbox
					v-model="scope.row.isRequired"
					falseValue="0"
					trueValue="1"
				/>
			</template>
		</ElTableColumn>
		<ElTableColumn
			label="显示类型"
			minWidth="12%"
		>
			<template #default="scope">
				<ElSelect v-model="scope.row.htmlType">
					<ElOption
						label="文本框"
						value="input"
					/>
					<ElOption
						label="文本域"
						value="textarea"
					/>
					<ElOption
						label="下拉框"
						value="select"
					/>
					<ElOption
						label="单选框"
						value="radio"
					/>
					<ElOption
						label="复选框"
						value="checkbox"
					/>
					<ElOption
						label="日期控件"
						value="datetime"
					/>
					<ElOption
						label="图片上传"
						value="imageUpload"
					/>
					<ElOption
						label="文件上传"
						value="fileUpload"
					/>
					<ElOption
						label="富文本控件"
						value="editor"
					/>
				</ElSelect>
			</template>
		</ElTableColumn>
		<ElTableColumn
			label="字典类型"
			minWidth="12%"
		>
			<template #default="scope">
				<ElSelect
					v-model="scope.row.dictType"
					clearable
					filterable
					placeholder="请选择"
				>
					<ElOption
						v-for="dict in dictOptions"
						:key="dict.dictType"
						:label="dict.dictName"
						:value="dict.dictType"
					>
						<span style="float: left">{{ dict.dictName }}</span>
						<span style="float: right; font-size: 13px; color: #8492a6">{{ dict.dictType }}</span>
					</ElOption>
				</ElSelect>
			</template>
		</ElTableColumn>
	</ElTable>
</template>

<style scoped></style>
