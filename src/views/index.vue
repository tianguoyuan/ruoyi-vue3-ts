<script setup lang="ts" name="Index">
import { useUserStore } from '@/store/user'
import { checkPermission } from '@/utils/permission'

const userStore = useUserStore()
const msg = ref('')
</script>

<template>
	<div class="p-3">
		<div>dashboard</div>

		<el-button
			v-if="checkPermission(['system:user:resetPwd'])"
			type="primary"
		>
			system:user:resetPwd
		</el-button>

		<el-button
			v-else
			type="danger"
		>
			没有['system:user:resetPwd']权限
		</el-button>

		<el-input v-model="msg" />
	</div>
</template>

<style scoped></style>
