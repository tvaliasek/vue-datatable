<template>
    <td>
        Custom Cell: {{row.party}}
        Header definition: {{ dataIndex }}
    </td>
</template>

<script>
export default {
    name: 'CustomCell',
    props: {
        row: {
            type: Object,
            required: false,
            default: () => ({})
        },
        dataIndex: {
            type: String,
            required: false
        }
    }
}
</script>
