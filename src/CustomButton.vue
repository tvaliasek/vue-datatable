<template>
    <span class="font-weight-bold ml-2">{{row.row.description}}</span>
</template>

<script>
export default {
    name: 'CustomButton',
    props: {
        row: {
            type: Object,
            required: true
        }
    }
}
</script>
