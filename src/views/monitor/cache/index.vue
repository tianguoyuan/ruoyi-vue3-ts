<script setup lang="ts" name="Cache">
import * as echarts from 'echarts'

import { getCache } from '@/api/monitor/cache'

const cache = ref<any>({
	commandStats: [],
	dbSize: '',
	info: {}
})
const commandstats = ref<HTMLElement | null>(null)
const usedmemory = ref<HTMLElement | null>(null)

function getList() {
	getCache().then(response => {
		cache.value = response.data

		const commandstatsIntance = echarts.init(commandstats.value, 'macarons')
		commandstatsIntance.setOption({
			series: [
				{
					animationDuration: 1000,
					animationEasing: 'cubicInOut',
					center: ['50%', '38%'],
					data: response.data.commandStats,
					name: '命令',
					radius: [15, 95],
					roseType: 'radius',
					type: 'pie'
				}
			],
			tooltip: {
				formatter: '{a} <br/>{b} : {c} ({d}%)',
				trigger: 'item'
			}
		})
		const usedmemoryInstance = echarts.init(usedmemory.value, 'macarons')
		usedmemoryInstance.setOption({
			series: [
				{
					data: [
						{
							name: '内存消耗',
							value: parseFloat(cache.value.info.used_memory_human)
						}
					],
					detail: {
						formatter: cache.value.info.used_memory_human
					},
					max: 1000,
					min: 0,
					name: '峰值',
					type: 'gauge'
				}
			],
			tooltip: {
				formatter: '{b} <br/>{a} : ' + cache.value.info.used_memory_human
			}
		})
		window.addEventListener('resize', () => {
			commandstatsIntance.resize()
			usedmemoryInstance.resize()
		})
	})
}

getList()
</script>

<template>
	<div class="app-container">
		<ElRow :gutter="10">
			<ElCol
				class="card-box"
				:span="24"
			>
				<ElCard>
					<template #header>
						<Monitor style="width: 1em; height: 1em; vertical-align: middle" />
						<span style="vertical-align: middle">基本信息</span>
					</template>
					<div class="el-table el-table--enable-row-hover el-table--medium">
						<table
							cellspacing="0"
							style="width: 100%"
						>
							<tbody>
								<tr>
									<td class="el-table__cell is-leaf"><div class="cell">Redis版本</div></td>
									<td class="el-table__cell is-leaf">
										<div
											v-if="cache.info"
											class="cell"
										>
											{{ cache.info.redis_version }}
										</div>
									</td>
									<td class="el-table__cell is-leaf"><div class="cell">运行模式</div></td>
									<td class="el-table__cell is-leaf">
										<div
											v-if="cache.info"
											class="cell"
										>
											{{ cache.info.redis_mode == 'standalone' ? '单机' : '集群' }}
										</div>
									</td>
									<td class="el-table__cell is-leaf"><div class="cell">端口</div></td>
									<td class="el-table__cell is-leaf">
										<div
											v-if="cache.info"
											class="cell"
										>
											{{ cache.info.tcp_port }}
										</div>
									</td>
									<td class="el-table__cell is-leaf"><div class="cell">客户端数</div></td>
									<td class="el-table__cell is-leaf">
										<div
											v-if="cache.info"
											class="cell"
										>
											{{ cache.info.connected_clients }}
										</div>
									</td>
								</tr>
								<tr>
									<td class="el-table__cell is-leaf"><div class="cell">运行时间(天)</div></td>
									<td class="el-table__cell is-leaf">
										<div
											v-if="cache.info"
											class="cell"
										>
											{{ cache.info.uptime_in_days }}
										</div>
									</td>
									<td class="el-table__cell is-leaf"><div class="cell">使用内存</div></td>
									<td class="el-table__cell is-leaf">
										<div
											v-if="cache.info"
											class="cell"
										>
											{{ cache.info.used_memory_human }}
										</div>
									</td>
									<td class="el-table__cell is-leaf"><div class="cell">使用CPU</div></td>
									<td class="el-table__cell is-leaf">
										<div
											v-if="cache.info"
											class="cell"
										>
											{{ parseFloat(cache.info.used_cpu_user_children).toFixed(2) }}
										</div>
									</td>
									<td class="el-table__cell is-leaf"><div class="cell">内存配置</div></td>
									<td class="el-table__cell is-leaf">
										<div
											v-if="cache.info"
											class="cell"
										>
											{{ cache.info.maxmemory_human }}
										</div>
									</td>
								</tr>
								<tr>
									<td class="el-table__cell is-leaf"><div class="cell">AOF是否开启</div></td>
									<td class="el-table__cell is-leaf">
										<div
											v-if="cache.info"
											class="cell"
										>
											{{ cache.info.aof_enabled == '0' ? '否' : '是' }}
										</div>
									</td>
									<td class="el-table__cell is-leaf"><div class="cell">RDB是否成功</div></td>
									<td class="el-table__cell is-leaf">
										<div
											v-if="cache.info"
											class="cell"
										>
											{{ cache.info.rdb_last_bgsave_status }}
										</div>
									</td>
									<td class="el-table__cell is-leaf"><div class="cell">Key数量</div></td>
									<td class="el-table__cell is-leaf">
										<div
											v-if="cache.dbSize"
											class="cell"
										>
											{{ cache.dbSize }}
										</div>
									</td>
									<td class="el-table__cell is-leaf"><div class="cell">网络入口/出口</div></td>
									<td class="el-table__cell is-leaf">
										<div
											v-if="cache.info"
											class="cell"
										>
											{{ cache.info.instantaneous_input_kbps }}kps/{{ cache.info.instantaneous_output_kbps }}kps
										</div>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				</ElCard>
			</ElCol>

			<ElCol
				class="card-box mt-2.5"
				:span="12"
			>
				<ElCard>
					<template #header>
						<PieChart style="width: 1em; height: 1em; vertical-align: middle" />
						<span style="vertical-align: middle">命令统计</span>
					</template>
					<div class="el-table el-table--enable-row-hover el-table--medium">
						<div
							ref="commandstats"
							style="height: 420px"
						/>
					</div>
				</ElCard>
			</ElCol>

			<ElCol
				class="card-box mt-2.5"
				:span="12"
			>
				<ElCard>
					<template #header>
						<Odometer style="width: 1em; height: 1em; vertical-align: middle" />
						<span style="vertical-align: middle">内存信息</span>
					</template>
					<div class="el-table el-table--enable-row-hover el-table--medium">
						<div
							ref="usedmemory"
							style="height: 420px"
						/>
					</div>
				</ElCard>
			</ElCol>
		</ElRow>
	</div>
</template>
