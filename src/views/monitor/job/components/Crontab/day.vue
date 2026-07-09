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
const cycle01 = ref(1)
const cycle02 = ref(2)
const average01 = ref(1)
const average02 = ref(1)
const workday = ref(1)
const checkboxList = ref<any[]>([])
const checkCopy = ref([1])
const cycleTotal = computed(() => {
	cycle01.value = props.check(cycle01.value, 1, 30)
	cycle02.value = props.check(cycle02.value, cycle01.value + 1, 31)
	return cycle01.value + '-' + cycle02.value
})
const averageTotal = computed(() => {
	average01.value = props.check(average01.value, 1, 30)
	average02.value = props.check(average02.value, 1, 31 - average01.value)
	return average01.value + '/' + average02.value
})
const workdayTotal = computed(() => {
	workday.value = props.check(workday.value, 1, 31)
	return workday.value + 'W'
})
const checkboxString = computed(() => {
	return checkboxList.value.join(',')
})
watch(
	() => props.cron.day,
	value => changeRadioValue(value)
)
watch([radioValue, cycleTotal, averageTotal, workdayTotal, checkboxString], () => onRadioChange())
function changeRadioValue(value) {
	if (value === '*') {
		radioValue.value = 1
	} else if (value === '?') {
		radioValue.value = 2
	} else if (value.indexOf('-') > -1) {
		const indexArr = value.split('-')
		cycle01.value = Number(indexArr[0])
		cycle02.value = Number(indexArr[1])
		radioValue.value = 3
	} else if (value.indexOf('/') > -1) {
		const indexArr = value.split('/')
		average01.value = Number(indexArr[0])
		average02.value = Number(indexArr[1])
		radioValue.value = 4
	} else if (value.indexOf('W') > -1) {
		const indexArr = value.split('W')
		workday.value = Number(indexArr[0])
		radioValue.value = 5
	} else if (value === 'L') {
		radioValue.value = 6
	} else {
		checkboxList.value = [...new Set(value.split(',').map(item => Number(item)))]
		radioValue.value = 7
	}
}
// 单选按钮值变化时
function onRadioChange() {
	if (radioValue.value === 2 && props.cron.week === '?') {
		emit('update', 'week', '*', 'day')
	}
	if (radioValue.value !== 2 && props.cron.week !== '?') {
		emit('update', 'week', '?', 'day')
	}
	switch (radioValue.value) {
		case 1:
			emit('update', 'day', '*', 'day')
			break
		case 2:
			emit('update', 'day', '?', 'day')
			break
		case 3:
			emit('update', 'day', cycleTotal.value, 'day')
			break
		case 4:
			emit('update', 'day', averageTotal.value, 'day')
			break
		case 5:
			emit('update', 'day', workdayTotal.value, 'day')
			break
		case 6:
			emit('update', 'day', 'L', 'day')
			break
		case 7:
			if (checkboxList.value.length === 0) {
				checkboxList.value.push(checkCopy.value[0])
			} else {
				checkCopy.value = checkboxList.value
			}
			emit('update', 'day', checkboxString.value, 'day')
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
				日，允许的通配符[, - * ? / L W]
			</ElRadio>
		</ElFormItem>

		<ElFormItem>
			<ElRadio
				v-model="radioValue"
				:value="2"
			>
				不指定
			</ElRadio>
		</ElFormItem>

		<ElFormItem>
			<ElRadio
				v-model="radioValue"
				:value="3"
			>
				周期从
				<ElInputNumber
					v-model="cycle01"
					:max="30"
					:min="1"
				/>
				-
				<ElInputNumber
					v-model="cycle02"
					:max="31"
					:min="cycle01 + 1"
				/>
				日
			</ElRadio>
		</ElFormItem>

		<ElFormItem>
			<ElRadio
				v-model="radioValue"
				:value="4"
			>
				从
				<ElInputNumber
					v-model="average01"
					:max="30"
					:min="1"
				/>
				号开始，每
				<ElInputNumber
					v-model="average02"
					:max="31 - average01"
					:min="1"
				/>
				日执行一次
			</ElRadio>
		</ElFormItem>

		<ElFormItem>
			<ElRadio
				v-model="radioValue"
				:value="5"
			>
				每月
				<ElInputNumber
					v-model="workday"
					:max="31"
					:min="1"
				/>
				号最近的那个工作日
			</ElRadio>
		</ElFormItem>

		<ElFormItem>
			<ElRadio
				v-model="radioValue"
				:value="6"
			>
				本月最后一天
			</ElRadio>
		</ElFormItem>

		<ElFormItem>
			<ElRadio
				v-model="radioValue"
				:value="7"
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
						v-for="item in 31"
						:key="item"
						:label="item"
						:value="item"
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
	width: 18.8rem;
}
</style>
