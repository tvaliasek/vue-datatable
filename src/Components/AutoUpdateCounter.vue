<template>
    <button
        :class="[
            'btn btn-sm',
            (running) ? `btn-${buttonRunningVariant}` : `btn-${buttonVariant}`
        ]"
        @click.prevent="onClick"
    >
        <BsIconArrowRepeat v-show="!running" />
        <BsIconPause v-show="running" />
        {{ text }}
    </button>
</template>

<script setup lang="ts">
import { onBeforeUnmount, computed, ref } from 'vue'
import BsIconArrowRepeat from '../Icons/bsIconArrowRepeat.vue'
import BsIconPause from '../Icons/bsIconPause.vue'
import type { ButtonVariant } from '../interfaces'

const props = withDefaults(defineProps<{
    i18n: Record<string, string>
    autoUpdateLimit?: number
    buttonVariant?: ButtonVariant
    buttonRunningVariant?: ButtonVariant
}>(), {
    autoUpdateLimit: 30,
    buttonVariant: 'primary',
    buttonRunningVariant: 'success'
})

const $emit = defineEmits(['refresh'])

const tm = ref<any>(undefined)
const running = ref(false)
const counter = ref<number>(props.autoUpdateLimit)

const text = computed(() => {
    return (running.value) ? `${props.i18n.autorefreshAfter} ${counter.value}s` : props.i18n.autorefresh
})

function onClick (): void {
    clearInterval(tm.value)
    counter.value = props.autoUpdateLimit
    if (running.value) {
        running.value = false
    } else {
        running.value = true
        tm.value = setInterval(() => decrement(), 1000)
    }
}

function decrement (): void {
    counter.value--
    if (counter.value <= 0) {
        $emit('refresh')
        counter.value = props.autoUpdateLimit
    }
}

onBeforeUnmount(() => {
    clearInterval(tm.value)
})
</script>
