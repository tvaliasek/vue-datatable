<template>
    <td>Custom Cell: {{row.party}}</td>
</template>

<script>
export default {
    name: 'CustomCell',
    props: {
        row: {
            type: Object,
            required: false,
            default: () => ({})
        }
    }
}
</script>
