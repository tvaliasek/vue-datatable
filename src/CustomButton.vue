<template>
    <span class="font-weight-bold me-2">{{row?.row?.description}}</span>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
    row: any
}>(), {
    row: () => ({ row: {} })
})
</script>
