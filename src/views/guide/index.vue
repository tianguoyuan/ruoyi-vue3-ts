<script setup lang="ts" name="Guide">
const msg = ref('')
</script>

<template>
	<div class="app-container">
		guide指南

		<ElInput v-model="msg" />
	</div>
</template>

<style scoped></style>
