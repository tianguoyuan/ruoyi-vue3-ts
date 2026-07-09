<script setup name="CacheList" lang="ts">
import { ElMessage } from 'element-plus'

import { listCacheName, listCacheKey, getCacheValue, clearCacheName, clearCacheKey, clearCacheAll } from '@/api/monitor/cache'

const cacheNames = ref([])
const cacheKeys = ref([])
const cacheForm = ref({
	cacheKey: '',
	cacheName: '',
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
							icon="Refresh"
							link
							style="float: right; padding: 3px 0"
							type="primary"
							@click="refreshCacheNames()"
						/>
					</template>
					<ElTable
						v-loading="loading"
						:data="cacheNames"
						:height="tableHeight"
						highlightCurrentRow
						style="width: 100%"
						@rowClick="getCacheKeys"
					>
						<ElTableColumn
							label="序号"
							type="index"
							width="60"
						/>

						<ElTableColumn
							align="center"
							:formatter="nameFormatter"
							label="缓存名称"
							prop="cacheName"
							:showOverflowTooltip="true"
						/>

						<ElTableColumn
							align="center"
							label="备注"
							prop="remark"
							:showOverflowTooltip="true"
						/>
						<ElTableColumn
							align="center"
							className="small-padding fixed-width"
							label="操作"
							width="60"
						>
							<template #default="scope">
								<ElButton
									icon="Delete"
									link
									type="primary"
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
							icon="Refresh"
							link
							style="float: right; padding: 3px 0"
							type="primary"
							@click="refreshCacheKeys()"
						/>
					</template>
					<ElTable
						v-loading="subLoading"
						:data="cacheKeys"
						:height="tableHeight"
						highlightCurrentRow
						style="width: 100%"
						@rowClick="handleCacheValue"
					>
						<ElTableColumn
							label="序号"
							type="index"
							width="60"
						/>
						<ElTableColumn
							align="center"
							:formatter="keyFormatter"
							label="缓存键名"
							:showOverflowTooltip="true"
						/>
						<ElTableColumn
							align="center"
							className="small-padding fixed-width"
							label="操作"
							width="60"
						>
							<template #default="scope">
								<ElButton
									icon="Delete"
									link
									type="primary"
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
							icon="Refresh"
							link
							style="float: right; padding: 3px 0"
							type="primary"
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
										:readOnly="true"
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
										:readOnly="true"
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
										:readOnly="true"
										:rows="8"
										type="textarea"
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
