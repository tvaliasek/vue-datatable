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
                v-if="page.isEllipsis"
                class=""
            >
                {{ ellipsisText }}
            </span>
            <button
                v-else
                class=""
                :aria-current="page.isCurrent ? 'page' : undefined"
                @click="() => $emit('update:modelValue', page.id)"
            >
                {{ page.id }}
            </button>
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

const pages = computed(() => {
    if (props.perPage <= 0) {
        return []
    }
    const pages = []
    const totalPages = Math.ceil(props.total / props.perPage)

    Array.from({ length: totalPages }, (_, index) => {
        const page = index + 1
        const isCurrent = page === props.modelValue
        const isEllipsis = page === 1 || page === totalPages || (page >= props.modelValue - 1 && page <= props.modelValue + 1)
        return {
            id: page,
            isCurrent,
            isEllipsis
        }
    })

    return pages
})

</script>
