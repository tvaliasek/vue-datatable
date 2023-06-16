<template>
    <b-button
        size="sm"
        :variant="(running) ? 'success' : 'primary'"
        @click.prevent="onClick"
    >
        <bs-icon-arrow-repeat v-show="!running" />
        <bs-icon-pause v-show="running" />
        {{ text }}
    </b-button>
</template>

<script>
import bsIconArrowRepeat from '../Icons/bsIconArrowRepeat.vue'
import bsIconPause from '../Icons/bsIconPause.vue'

export default {
    name: 'AutoUpdateCounter',
    components: {
        bsIconArrowRepeat,
        bsIconPause
    },
    data () {
        return {
            tm: null,
            running: false,
            counter: this.autoUpdateLimit
        }
    },
    props: {
        i18n: {
            type: Object,
            required: true
        },
        autoUpdateLimit: {
            type: Number,
            required: false,
            default: 30
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
            this.counter = this.autoUpdateLimit
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
                this.counter = this.autoUpdateLimit
            }
        }
    },
    beforeUnmount () {
        clearInterval(this.tm)
    }
}
</script>
