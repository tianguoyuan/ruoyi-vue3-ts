<script setup lang="ts">
import IFrame from '@/components/IFrame/index.vue'

const url = ref(import.meta.env.VITE_API_URL + '/swagger-ui/index.html')
</script>

<template>
	<IFrame v-model:src="url" />
</template>
