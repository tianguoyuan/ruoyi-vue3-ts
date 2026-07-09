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

const fullYear = Number(new Date().getFullYear())
const maxFullYear = fullYear + 10
const radioValue = ref(1)
const cycle01 = ref(fullYear)
const cycle02 = ref(fullYear + 1)
const average01 = ref(fullYear)
const average02 = ref(1)
const checkboxList = ref<any[]>([])
const checkCopy = ref([fullYear])

const cycleTotal = computed(() => {
	cycle01.value = props.check(cycle01.value, fullYear, maxFullYear - 1)
	cycle02.value = props.check(cycle02.value, cycle01.value + 1, maxFullYear)
	return cycle01.value + '-' + cycle02.value
})
const averageTotal = computed(() => {
	average01.value = props.check(average01.value, fullYear, maxFullYear - 1)
	average02.value = props.check(average02.value, 1, 10)
	return average01.value + '/' + average02.value
})
const checkboxString = computed(() => {
	return checkboxList.value.join(',')
})
watch(
	() => props.cron.year,
	value => changeRadioValue(value)
)
watch([radioValue, cycleTotal, averageTotal, checkboxString], () => onRadioChange())
function changeRadioValue(value) {
	if (value === '') {
		radioValue.value = 1
	} else if (value === '*') {
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
	} else {
		checkboxList.value = [...new Set(value.split(',').map(item => Number(item)))]
		radioValue.value = 5
	}
}
function onRadioChange() {
	switch (radioValue.value) {
		case 1:
			emit('update', 'year', '', 'year')
			break
		case 2:
			emit('update', 'year', '*', 'year')
			break
		case 3:
			emit('update', 'year', cycleTotal.value, 'year')
			break
		case 4:
			emit('update', 'year', averageTotal.value, 'year')
			break
		case 5:
			if (checkboxList.value.length === 0) {
				checkboxList.value.push(checkCopy.value[0])
			} else {
				checkCopy.value = checkboxList.value
			}
			emit('update', 'year', checkboxString.value, 'year')
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
				不填，允许的通配符[, - * /]
			</ElRadio>
		</ElFormItem>

		<ElFormItem>
			<ElRadio
				v-model="radioValue"
				:value="2"
			>
				每年
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
					:max="2098"
					:min="fullYear"
				/>
				-
				<ElInputNumber
					v-model="cycle02"
					:max="2099"
					:min="cycle01 ? cycle01 + 1 : fullYear + 1"
				/>
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
					:max="2098"
					:min="fullYear"
				/>
				年开始，每
				<ElInputNumber
					v-model="average02"
					:max="2099 - average01 || fullYear"
					:min="1"
				/>
				年执行一次
			</ElRadio>
		</ElFormItem>

		<ElFormItem>
			<ElRadio
				v-model="radioValue"
				:value="5"
			>
				指定
				<ElSelect
					v-model="checkboxList"
					clearable
					multiple
					:multipleLimit="8"
					placeholder="可多选"
				>
					<ElOption
						v-for="item in 9"
						:key="item"
						:label="item - 1 + fullYear"
						:value="item - 1 + fullYear"
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
