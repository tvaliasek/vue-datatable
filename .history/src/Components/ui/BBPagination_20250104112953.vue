<template>
    <ul
        class="pagination"
        role="menubar"
    >
        <li
            v-for="page in pages"
            :key="`page-${page.id}`"
        >
            <span
                v-if="page.id === FIRST_ELLIPSIS || page.id === LAST_ELLIPSIS"
                v-bind="ellipsisProps.span"
            >
                <slot name="ellipsis-text">
                    {{ props.ellipsisText || '...' }}
                </slot>
            </span>
        </li>
    </ul>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

const props = withDefaults(defineProps<{
    modelValue?: number
    total?: number
    perPage?: number
    ellipsisText?: string
}>(), {
    modelValue: 1,
    total: 0,
    perPage: 10,
    ellipsisText: '...'
})

const $emit = defineEmits([
    'update:modelValue'
])

</script>
