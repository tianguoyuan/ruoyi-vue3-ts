<script setup lang="ts" name="Navbar">
import { useAppStore } from '@/store/app'
import Breadcrumb from './Breadcrumb.vue'
import ErrorLog from './ErrorLog.vue'
import Hamburger from './Hamburger.vue'
import HeaderSearch from './HeaderSearch.vue'
import Screenfull from './Screenfull.vue'
import SizeSelect from './SizeSelect.vue'
import { computed, ref } from 'vue'
import { useUserStore } from '@/store/user'
import { useRoute, useRouter } from 'vue-router'

const appStore = useAppStore()
const userStore = useUserStore()
const router = useRouter()
const route = useRoute()
const sidebarOpened = computed(() => appStore.sidebarOpened)
const avatar = computed(() => userStore.userInfo.avatar)

console.log('import.meta.env', import.meta.env)

const username = computed(() => userStore.userInfo.name)
const device = computed(() => appStore.device)

function toggleSideBar() {
	appStore.toggleSideBar()
}

async function logout() {
	await userStore.logout()
	router.push(`/login?redirect=${route.fullPath}`)
}
</script>

<template>
	<div class="navbar">
		<Hamburger
			id="hamburger-container"
			class="hamburger-container"
			:is-active="sidebarOpened"
			@toggleClick="toggleSideBar"
		/>
		<Breadcrumb
			id="breadcrumb-container"
			class="breadcrumb-container"
		/>

		<div class="right-menu">
			<template v-if="device !== 'mobile'">
				<HeaderSearch class="right-menu-item hover-effect" />
				<Screenfull
					id="screenfull"
					class="right-menu-item hover-effect"
				/>
				<ElTooltip
					content="布局大小"
					effect="dark"
					placement="bottom"
				>
					<SizeSelect
						id="size-select"
						class="right-menu-item hover-effect"
					/>
				</ElTooltip>
				<ErrorLog class="errorLog-container right-menu-item hover-effect" />
			</template>

			<ElDropdown
				class="avatar-container right-menu-item hover-effect"
				trigger="hover"
			>
				<div class="avatar-wrapper">
					<div class="flex items-center">
						<img
							:src="avatar"
							class="w-7 h-7 rounded-full"
						/>
						<span class="pl-2 text-3.5">{{ username }}</span>
					</div>
					<!-- <el-icon class="ml-1"><CaretBottom /></el-icon> -->
				</div>
				<template #dropdown>
					<ElDropdownMenu>
						<RouterLink to="/system/user/profile">
							<ElDropdownItem>个人中心</ElDropdownItem>
						</RouterLink>
						<ElDropdownItem
							divided
							@click="logout"
						>
							退出登录
						</ElDropdownItem>
					</ElDropdownMenu>
				</template>
			</ElDropdown>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.navbar {
	position: relative;
	height: 50px;
	overflow: hidden;
	background: #ffffff;
	box-shadow: 0 1px 4px rgb(0 21 41 / 8%);
	.hamburger-container {
		display: flex;
		align-items: center;
		float: left;
		height: 100%;
		cursor: pointer;
		transition: background 0.3s;
		-webkit-tap-highlight-color: transparent;
		&:hover {
			background: rgb(0 0 0 / 2.5%);
		}
	}
	.breadcrumb-container {
		float: left;
	}
	.errLog-container {
		display: inline-block;
		vertical-align: top;
	}
	.right-menu {
		display: flex;
		align-items: center;
		float: right;
		height: 100%;
		line-height: 50px;
		&:focus {
			outline: none;
		}
		.right-menu-item {
			display: inline-block;
			display: flex;
			align-items: center;
			height: 100%;
			padding: 0 8px;
			font-size: 18px;
			color: #5a5e66;
			vertical-align: text-bottom;
			&.hover-effect {
				cursor: pointer;
				transition: background 0.3s;
				&:hover {
					background: rgb(0 0 0 / 2.5%);
				}
			}
		}
		.avatar-container {
			margin-right: 30px;
			.avatar-wrapper {
				position: relative;
				display: flex;
				align-items: baseline;
				.user-avatar {
					width: 40px;
					height: 40px;
					cursor: pointer;
					border-radius: 10px;
				}
				.el-icon-caret-bottom {
					position: absolute;
					top: 25px;
					right: -20px;
					font-size: 12px;
					cursor: pointer;
				}
			}
		}
	}
}
</style>
