<script setup name="CacheList" lang="ts">
import { ElMessage } from 'element-plus'

import { listCacheName, listCacheKey, getCacheValue, clearCacheName, clearCacheKey, clearCacheAll } from '@/api/monitor/cache'

const cacheNames = ref([])
const cacheKeys = ref([])
const cacheForm = ref({
	cacheName: '',
	cacheKey: '',
	cacheValue: ''
})
const loading = ref(true)
const subLoading = ref(false)
const nowCacheName = ref('')
const tableHeight = ref(window.innerHeight - 200)

/** 查询缓存名称列表 */
function getCacheNames() {
	loading.value = true
	listCacheName().then(response => {
		cacheNames.value = response.data
		loading.value = false
	})
}

/** 刷新缓存名称列表 */
function refreshCacheNames() {
	getCacheNames()
	ElMessage.success('刷新缓存列表成功')
}

/** 清理指定名称缓存 */
function handleClearCacheName(row) {
	clearCacheName(row.cacheName).then(() => {
		ElMessage.success('清理缓存名称[' + row.cacheName + ']成功')
		getCacheKeys()
	})
}

/** 查询缓存键名列表 */
function getCacheKeys(row?: any) {
	const cacheName = row !== undefined ? row.cacheName : nowCacheName.value
	if (cacheName === '') {
		return
	}
	subLoading.value = true
	listCacheKey(cacheName).then(response => {
		cacheKeys.value = response.data
		subLoading.value = false
		nowCacheName.value = cacheName
	})
}

/** 刷新缓存键名列表 */
function refreshCacheKeys() {
	getCacheKeys()
	ElMessage.success('刷新键名列表成功')
}

/** 清理指定键名缓存 */
function handleClearCacheKey(cacheKey) {
	clearCacheKey(cacheKey).then(response => {
		ElMessage.success('清理缓存键名[' + cacheKey + ']成功')
		getCacheKeys()
	})
}

/** 列表前缀去除 */
function nameFormatter(row) {
	return row.cacheName.replace(':', '')
}

/** 键名前缀去除 */
function keyFormatter(cacheKey) {
	return cacheKey.replace(nowCacheName.value, '')
}

/** 查询缓存内容详细 */
function handleCacheValue(cacheKey) {
	getCacheValue(nowCacheName.value, cacheKey).then(response => {
		cacheForm.value = response.data
	})
}

/** 清理全部缓存 */
function handleClearCacheAll() {
	clearCacheAll().then(response => {
		ElMessage.success('清理全部缓存成功')
	})
}

getCacheNames()
</script>

<template>
	<div class="app-container">
		<ElRow :gutter="10">
			<ElCol :span="8">
				<ElCard style="height: calc(100vh - 125px)">
					<template #header>
						<Collection style="width: 1em; height: 1em; vertical-align: middle" />
						<span style="vertical-align: middle">缓存列表</span>
						<ElButton
							style="float: right; padding: 3px 0"
							link
							type="primary"
							icon="Refresh"
							@click="refreshCacheNames()"
						/>
					</template>
					<ElTable
						v-loading="loading"
						:data="cacheNames"
						:height="tableHeight"
						highlight-current-row
						style="width: 100%"
						@rowClick="getCacheKeys"
					>
						<ElTableColumn
							label="序号"
							width="60"
							type="index"
						/>

						<ElTableColumn
							label="缓存名称"
							align="center"
							prop="cacheName"
							:show-overflow-tooltip="true"
							:formatter="nameFormatter"
						/>

						<ElTableColumn
							label="备注"
							align="center"
							prop="remark"
							:show-overflow-tooltip="true"
						/>
						<ElTableColumn
							label="操作"
							width="60"
							align="center"
							class-name="small-padding fixed-width"
						>
							<template #default="scope">
								<ElButton
									link
									type="primary"
									icon="Delete"
									@click="handleClearCacheName(scope.row)"
								/>
							</template>
						</ElTableColumn>
					</ElTable>
				</ElCard>
			</ElCol>

			<ElCol :span="8">
				<ElCard style="height: calc(100vh - 125px)">
					<template #header>
						<Key style="width: 1em; height: 1em; vertical-align: middle" /> <span style="vertical-align: middle">键名列表</span>
						<ElButton
							style="float: right; padding: 3px 0"
							link
							type="primary"
							icon="Refresh"
							@click="refreshCacheKeys()"
						/>
					</template>
					<ElTable
						v-loading="subLoading"
						:data="cacheKeys"
						:height="tableHeight"
						highlight-current-row
						style="width: 100%"
						@rowClick="handleCacheValue"
					>
						<ElTableColumn
							label="序号"
							width="60"
							type="index"
						/>
						<ElTableColumn
							label="缓存键名"
							align="center"
							:show-overflow-tooltip="true"
							:formatter="keyFormatter"
						/>
						<ElTableColumn
							label="操作"
							width="60"
							align="center"
							class-name="small-padding fixed-width"
						>
							<template #default="scope">
								<ElButton
									link
									type="primary"
									icon="Delete"
									@click="handleClearCacheKey(scope.row)"
								/>
							</template>
						</ElTableColumn>
					</ElTable>
				</ElCard>
			</ElCol>

			<ElCol :span="8">
				<ElCard
					:bordered="false"
					style="height: calc(100vh - 125px)"
				>
					<template #header>
						<Document style="width: 1em; height: 1em; vertical-align: middle" />
						<span style="vertical-align: middle">缓存内容</span>
						<ElButton
							style="float: right; padding: 3px 0"
							link
							type="primary"
							icon="Refresh"
							@click="handleClearCacheAll()"
						>
							清理全部
						</ElButton>
					</template>
					<ElForm :model="cacheForm">
						<ElRow :gutter="32">
							<ElCol
								:offset="1"
								:span="22"
							>
								<ElFormItem
									label="缓存名称:"
									prop="cacheName"
								>
									<ElInput
										v-model="cacheForm.cacheName"
										:read-only="true"
									/>
								</ElFormItem>
							</ElCol>
							<ElCol
								:offset="1"
								:span="22"
							>
								<ElFormItem
									label="缓存键名:"
									prop="cacheKey"
								>
									<ElInput
										v-model="cacheForm.cacheKey"
										:read-only="true"
									/>
								</ElFormItem>
							</ElCol>
							<ElCol
								:offset="1"
								:span="22"
							>
								<ElFormItem
									label="缓存内容:"
									prop="cacheValue"
								>
									<ElInput
										v-model="cacheForm.cacheValue"
										type="textarea"
										:rows="8"
										:read-only="true"
									/>
								</ElFormItem>
							</ElCol>
						</ElRow>
					</ElForm>
				</ElCard>
			</ElCol>
		</ElRow>
	</div>
</template>
