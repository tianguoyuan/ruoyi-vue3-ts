<script setup lang="ts"></script>

<template>
	<div />
</template>

<style lang="scss" scoped>
.header-search {
	font-size: 0 !important;
	display: flex;
	align-items: center;
	.search-icon {
		cursor: pointer;
		font-size: 18px;
	}

	.header-search-select {
		font-size: 18px;
		transition: width 0.2s;
		width: 0;
		overflow: hidden;
		background: transparent;
		border-radius: 0;
		display: inline-block;
		vertical-align: middle;

		::v-deep(.el-input__inner) {
			border-radius: 0;
			border: 0;
			padding-left: 0;
			padding-right: 0;
			box-shadow: none !important;
			border-bottom: 1px solid #d9d9d9;
			vertical-align: middle;
		}
	}

	&.show {
		.header-search-select {
			width: 210px;
			margin-left: 10px;
		}
	}
}
</style>
