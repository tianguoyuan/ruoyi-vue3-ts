<script setup lang="ts" name="Druid">
const url = ref(import.meta.env.VITE_API_URL + '/druid/login.html')
</script>

<template>
	<IFrame v-model:src="url" />
</template>

<style scoped></style>
