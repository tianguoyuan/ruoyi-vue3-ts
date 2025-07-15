<script setup lang="ts">
import defaultSettings from '@/settings'

const props = defineProps<{
	collapse: boolean
}>()
const title = defaultSettings.title
const logo = 'https://wpimg.wallstcn.com/69a1c46c-eb1c-4b46-8bd4-e9e686ef5251.png'
</script>

<template>
	<div class="sidebar-logo-container">
		<Transition name="sidebarLogoFade">
			<RouterLink
				v-if="props.collapse"
				key="collapse"
				class="sidebar-logo-link"
				to="/"
			>
				<img
					v-if="logo"
					:src="logo"
					alt=""
					class="sidebar-logo"
				/>
				<h1
					v-else
					class="sidebar-title"
				>
					{{ title }}
				</h1>
			</RouterLink>

			<RouterLink
				v-else
				key="expand"
				class="sidebar-logo-link"
				to="/"
			>
				<img
					:src="logo"
					class="sidebar-logo"
					alt=""
				/>
				<h1 class="sidebar-title">{{ title }}</h1>
			</RouterLink>
		</Transition>
	</div>
</template>

<style lang="scss" scoped>
.sidebarLogoFade-enter-active {
	transition: opacity 1.5s;
}
.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
	opacity: 0;
}
.sidebar-logo-container {
	position: relative;
	width: 100%;
	height: 50px;
	overflow: hidden;
	line-height: 50px;
	text-align: center;
	background: #2b2f3a;
	& .sidebar-logo-link {
		width: 100%;
		height: 100%;
		& .sidebar-logo {
			width: 32px;
			height: 32px;
		}
		& .sidebar-title {
			max-width: 140px;
			margin-left: 12px;
			overflow: hidden;
			font-family: Avenir, 'Helvetica Neue', Arial, Helvetica, sans-serif;
			font-size: 14px;
			font-weight: 600;
			line-height: 50px;
			color: #ffffff;
			text-overflow: ellipsis;
			white-space: nowrap;
			vertical-align: middle;
		}
	}
	&.collapse {
		.sidebar-logo {
			margin-right: 0;
		}
	}
}
</style>
