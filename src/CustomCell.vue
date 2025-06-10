<template>
    <td>
        Custom Cell: {{row.party}}
        Header definition: {{ dataIndex }}
    </td>
</template>

<script lang="ts" setup>

withDefaults(defineProps<{
    row?: Record<string, any>
    dataIndex?: string
}>(),
{
    row: () => ({}),
    dataIndex: ''
})
</script>
