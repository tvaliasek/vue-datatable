<template>
    <p class="mb-0 alert alert-info text-center">
        <b-spinner variant="primary" /><br/>
        {{ i18n.loading }}
    </p>
</template>

<script>
export default {
    name: 'LoadingIndicator',
    props: {
        i18n: {
            type: Object,
            required: true
        }
    }
}
</script>
