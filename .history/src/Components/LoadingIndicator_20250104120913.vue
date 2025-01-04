<template>
    <div class="mb-0 alert alert-info gap-3 flex-wrap d-flex justify-content-center align-items-center align-content-center">
        <div class="spinner-border text-primary"></div>
        <span>{{ i18n.loading }}</span>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    i18n: Record<string, string>
}>()
</script>
