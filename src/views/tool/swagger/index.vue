<script setup lang="ts">
import iFrame from '@/components/iFrame/index.vue'

const url = ref(import.meta.env.VITE_API_URL + '/swagger-ui/index.html')
</script>

<template>
	<iFrame v-model:src="url" />
</template>
