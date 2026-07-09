<script setup lang="ts" name="Index">
import { useUserStore } from '@/store/user'
import { checkPermission } from '@/utils/permission'

const userStore = useUserStore()
const msg = ref('')
</script>
<template>
	<div class="p-3">
		<div>dashboard</div>

		<ElButton
			v-if="checkPermission(['system:user:resetPwd'])"
			type="primary"
		>
			system:user:resetPwd
		</ElButton>

		<ElButton
			v-else
			type="danger"
		>
			没有['system:user:resetPwd']权限
		</ElButton>

		<ElInput v-model="msg" />
	</div>
</template>
<style scoped></style>
