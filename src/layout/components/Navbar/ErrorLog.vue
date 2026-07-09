<script setup lang="ts">
import { useErrorStore } from '@/store/error'
const errorStore = useErrorStore()
const dialogVisible = ref(false)
const errorLogs = computed(() => errorStore.logs)
</script>

<template>
	<div>
		<ElBadge
			class="item"
			:isDot="errorLogs.length > 0"
			:offset="[0, 15]"
			@click="dialogVisible = !dialogVisible"
		>
			<SvgIcon
				iconClass="bug"
				size="18px"
			/>
		</ElBadge>
		<ElDialog
			v-model="dialogVisible"
			:appendToBody="true"
			:closeOnClickModal="false"
			:closeOnPressEscape="false"
			destroyOnClose
			title="错误日志"
			width="80%"
		>
			<ElTable :data="errorLogs">
				<ElTableColumn
					align="center"
					label="错误信息"
					prop="message"
				/>

				<ElTableColumn
					align="center"
					label="错误详情"
				>
					<template #default="{ row }">
						<ElTag type="warning"> {{ row.vm?.$vnode?.tag }} error in {{ row.info }} </ElTag>
					</template>
				</ElTableColumn>

				<ElTableColumn
					align="center"
					label="错误地址"
					prop="url"
				/>
				<ElTableColumn
					align="center"
					label="错误堆栈"
					prop="stack"
				/>
			</ElTable>
		</ElDialog>
	</div>
</template>
