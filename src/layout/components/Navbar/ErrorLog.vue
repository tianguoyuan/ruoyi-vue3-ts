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
			:is-dot="errorLogs.length > 0"
			:offset="[0, 15]"
			@click="dialogVisible = !dialogVisible"
		>
			<SvgIcon icon-class="bug" />
		</ElBadge>
		<ElDialog
			v-model="dialogVisible"
			:append-to-body="true"
			title="错误日志"
			width="80%"
			:close-on-press-escape="false"
			:close-on-click-modal="false"
			destroy-on-close
		>
			<ElTable :data="errorLogs">
				<ElTableColumn
					prop="message"
					label="错误信息"
					align="center"
				/>

				<ElTableColumn
					label="错误详情"
					align="center"
				>
					<template #default="{ row }">
						<ElTag type="warning"> {{ row.vm?.$vnode?.tag }} error in {{ row.info }} </ElTag>
					</template>
				</ElTableColumn>

				<ElTableColumn
					label="错误地址"
					prop="url"
					align="center"
				/>
				<ElTableColumn
					prop="stack"
					label="错误堆栈"
					align="center"
				/>
			</ElTable>
		</ElDialog>
	</div>
</template>
