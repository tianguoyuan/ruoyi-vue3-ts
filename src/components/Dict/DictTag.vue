<script setup lang="ts">
// 记录未匹配的项
const unmatchArray = ref<any[]>([])

interface Option {
	value: string
	label: string
	// 根据你的实际数据结构添加其他属性
}

interface IOption extends Option {
	elTagType?: any
	elTagClass?: string
}

interface Props {
	// 数据
	options: IOption[] | null
	// 当前的值
	value: number | string | (number | string)[]
	// 当未找到匹配的数据时，显示value
	showValue: boolean
	separator: string
}

const props = withDefaults(defineProps<Props>(), {
	options: null,
	value: '',
	showValue: true,
	separator: ','
})

const values = computed(() => {
	if (props.value === null || typeof props.value === 'undefined' || props.value === '') return []
	return Array.isArray(props.value) ? props.value.map(item => '' + item) : String(props.value).split(props.separator)
})

const unmatch = computed(() => {
	unmatchArray.value = []
	// 没有value不显示
	if (
		props.value === null ||
		typeof props.value === 'undefined' ||
		props.value === '' ||
		!Array.isArray(props.options) ||
		props.options.length === 0
	)
		return false
	// 传入值为数组
	let unmatch = false // 添加一个标志来判断是否有未匹配项
	values.value.forEach(item => {
		if (!props.options) return
		if (!props.options.some(v => v.value === item)) {
			unmatchArray.value.push(item)
			unmatch = true // 如果有未匹配项，将标志设置为true
		}
	})
	return unmatch // 返回标志的值
})

function handleArray(array) {
	if (array.length === 0) return ''
	return array.reduce((pre, cur) => {
		return pre + ' ' + cur
	})
}
</script>

<template>
	<div>
		<template v-for="(item, index) in options">
			<template v-if="values.includes(item.value)">
				<span
					v-if="(item.elTagType == 'default' || item.elTagType == '') && (item.elTagClass == '' || item.elTagClass == null)"
					:key="item.value"
					:index="index"
					:class="item.elTagClass"
					>{{ item.label + ' ' }}</span
				>
				<el-tag
					v-else
					:key="item.value + ''"
					:disable-transitions="true"
					:index="index"
					:type="item.elTagType"
					:class="item.elTagClass"
				>
					{{ item.label + ' ' }}
				</el-tag>
			</template>
		</template>
		<template v-if="unmatch && showValue">
			{{ handleArray(unmatchArray) }}
		</template>
	</div>
</template>

<style scoped>
.el-tag + .el-tag {
	margin-left: 10px;
}
</style>
