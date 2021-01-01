<template>
    <b-btn
        size="sm"
        :variant="(running) ? 'success' : 'primary'"
        @click.prevent="onClick"
    >
        <b-icon-arrow-repeat v-show="!running" />
        <b-icon-pause v-show="running" />
        {{ text }}
    </b-btn>
</template>

<script>
export default {
    name: 'AutoUpdateCounter',
    data () {
        return {
            tm: null,
            running: false,
            counter: 30
        }
    },
    props: {
        i18n: {
            type: Object,
            required: true
        }
    },
    computed: {
        text () {
            return (this.running) ? `${this.i18n.autorefreshAfter} ${this.counter}s` : this.i18n.autorefresh
        }
    },
    methods: {
        onClick () {
            clearInterval(this.tm)
            this.counter = 30
            if (this.running) {
                this.running = false
            } else {
                this.running = true
                this.tm = setInterval(this.decrement, 1000)
            }
        },
        decrement () {
            this.counter--
            if (this.counter <= 0) {
                this.$emit('refresh')
                this.counter = 30
            }
        }
    },
    beforeDestroy () {
        clearInterval(this.tm)
    }
}
</script>
