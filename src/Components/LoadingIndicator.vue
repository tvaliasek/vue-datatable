<template>
    <p class="mb-0 alert alert-info text-center">
        <BSpinner variant="primary" /><br/>
        {{ i18n.loading }}
    </p>
</template>

<script setup lang="ts">
defineProps<{
    i18n: Record<string, string>
}>()
</script>
