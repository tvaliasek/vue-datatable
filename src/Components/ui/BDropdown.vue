<template>
    <div
        :id="computedId"
        ref="dropdown"
        :class="[
            'dropdown',
            {
                'cui-dropdown-open': isShown
            }
        ]"
        :style="style"
    >
        <button
            role="button"
            ref="dropdownToggle"
            data-bs-toggle="dropdown"
            :data-bs-auto-close="autoClose"
            :aria-expanded="isShown"
            :class="[
                'btn dropdown-toggle d-inline-flex align-items-center',
                `btn-${buttonVariant}`,
                {
                    [`btn-${size}`]: !!size,
                }
            ]"
            @click="onMenuClick"
        >
            <slot name="toggleContent">
                <span>{{ text }}</span>
            </slot>
        </button>
        <div
            class="dropdown-menu"
            ref="dropdownMenu"
            :class="[
                `dropdown-menu-${alignment}`,
                {
                    [`${alignment}-0`]: alignment,
                    show: isShown
                }
            ]"
        >
            <slot></slot>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch, nextTick, onBeforeUnmount } from 'vue'
import type { ButtonVariant } from '../../interfaces'

enum DROPDOWN_AUTO_CLOSE {
    INSIDE = 'inside',
    OUTSIDE = 'outside'
}

export interface BDropdownProps {
    id?: string
    alignment?: 'start' | 'end'
    menuMinWidth?: string
    text?: string
    buttonVariant?: ButtonVariant
    icon?: string
    size?: 'sm' | 'lg'
    autoClose?: DROPDOWN_AUTO_CLOSE | boolean
}

const props = withDefaults(defineProps<BDropdownProps>(), {
    id: () => Math.random().toString(36).slice(2, 4),
    alignment: 'start',
    buttonVariant: 'primary',
    autoClose: true
})

const style = computed(() => ({
    '--bs-dropdown-min-width': props?.menuMinWidth ?? 0
}))

const isShown = ref(false)
const computedId = computed(() => `dropdown-${props.id}`)

const dropdown = ref<HTMLElement | null>(null)
const dropdownToggle = ref<HTMLElement | null>(null)
const dropdownMenu = ref<HTMLElement | null>(null)

const ac = new AbortController()
onMounted(() => {
    registerClickHandler()
})

onBeforeUnmount(() => {
    ac.abort()
})

watch(computed(() => props.autoClose), () => {
    ac.abort()
    void nextTick(() => registerClickHandler())
})

function onMenuClick (): void {
    isShown.value = !isShown.value
}

function registerClickHandler (): void {
    window.addEventListener('click', (event) => {
        if (event.target === null || event.target === dropdownToggle.value || dropdownToggle.value?.contains(event.target as Node) === true) {
            return
        }
        const isClickedIgnoredEl = event.target === dropdownMenu.value || dropdownMenu.value?.contains(event.target as Node) === true
        if (
            props.autoClose === true ||
            (props.autoClose === DROPDOWN_AUTO_CLOSE.INSIDE && isClickedIgnoredEl) ||
            (props.autoClose === DROPDOWN_AUTO_CLOSE.OUTSIDE && !isClickedIgnoredEl)
        ) {
            isShown.value = false
        }
    }, { signal: ac.signal })
}
</script>
