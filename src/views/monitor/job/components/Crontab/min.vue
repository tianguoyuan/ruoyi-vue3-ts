<script setup lang="ts">
const emit = defineEmits(['update'])
const props = defineProps({
	check: {
		default: () => {},
		type: Function
	},
	cron: {
		default: () => ({
			day: '*',
			hour: '*',
			min: '*',
			month: '*',
			second: '*',
			week: '?',
			year: ''
		}),
		type: Object
	}
})
const radioValue = ref(1)
const cycle01 = ref(0)
const cycle02 = ref(1)
const average01 = ref(0)
const average02 = ref(1)
const checkboxList = ref<any[]>([])
const checkCopy = ref([0])
const cycleTotal = computed(() => {
	cycle01.value = props.check(cycle01.value, 0, 58)
	cycle02.value = props.check(cycle02.value, cycle01.value + 1, 59)
	return cycle01.value + '-' + cycle02.value
})
const averageTotal = computed(() => {
	average01.value = props.check(average01.value, 0, 58)
	average02.value = props.check(average02.value, 1, 59 - average01.value)
	return average01.value + '/' + average02.value
})
const checkboxString = computed(() => {
	return checkboxList.value.join(',')
})
watch(
	() => props.cron.min,
	value => changeRadioValue(value)
)
watch([radioValue, cycleTotal, averageTotal, checkboxString], () => onRadioChange())
function changeRadioValue(value) {
	if (value === '*') {
		radioValue.value = 1
	} else if (value.indexOf('-') > -1) {
		const indexArr = value.split('-')
		cycle01.value = Number(indexArr[0])
		cycle02.value = Number(indexArr[1])
		radioValue.value = 2
	} else if (value.indexOf('/') > -1) {
		const indexArr = value.split('/')
		average01.value = Number(indexArr[0])
		average02.value = Number(indexArr[1])
		radioValue.value = 3
	} else {
		checkboxList.value = [...new Set(value.split(',').map(item => Number(item)))]
		radioValue.value = 4
	}
}
function onRadioChange() {
	switch (radioValue.value) {
		case 1:
			emit('update', 'min', '*', 'min')
			break
		case 2:
			emit('update', 'min', cycleTotal.value, 'min')
			break
		case 3:
			emit('update', 'min', averageTotal.value, 'min')
			break
		case 4:
			if (checkboxList.value.length === 0) {
				checkboxList.value.push(checkCopy.value[0])
			} else {
				checkCopy.value = checkboxList.value
			}
			emit('update', 'min', checkboxString.value, 'min')
			break
	}
}
</script>
<template>
	<ElForm>
		<ElFormItem>
			<ElRadio
				v-model="radioValue"
				:value="1"
			>
				分钟，允许的通配符[, - * /]
			</ElRadio>
		</ElFormItem>

		<ElFormItem>
			<ElRadio
				v-model="radioValue"
				:value="2"
			>
				周期从
				<ElInputNumber
					v-model="cycle01"
					:max="58"
					:min="0"
				/>
				-
				<ElInputNumber
					v-model="cycle02"
					:max="59"
					:min="cycle01 + 1"
				/>
				分钟
			</ElRadio>
		</ElFormItem>

		<ElFormItem>
			<ElRadio
				v-model="radioValue"
				:value="3"
			>
				从
				<ElInputNumber
					v-model="average01"
					:max="58"
					:min="0"
				/>
				分钟开始， 每
				<ElInputNumber
					v-model="average02"
					:max="59 - average01"
					:min="1"
				/>
				分钟执行一次
			</ElRadio>
		</ElFormItem>

		<ElFormItem>
			<ElRadio
				v-model="radioValue"
				:value="4"
			>
				指定
				<ElSelect
					v-model="checkboxList"
					clearable
					multiple
					:multipleLimit="10"
					placeholder="可多选"
				>
					<ElOption
						v-for="item in 60"
						:key="item"
						:label="item - 1"
						:value="item - 1"
					/>
				</ElSelect>
			</ElRadio>
		</ElFormItem>
	</ElForm>
</template>

<style lang="scss" scoped>
.el-input-number--small,
.el-select,
.el-select--small {
	margin: 0 0.2rem;
}
.el-select,
.el-select--small {
	width: 19.8rem;
}
</style>
