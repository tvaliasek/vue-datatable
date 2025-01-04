<template>
    <ul
        class="pagination justify-content-start pagination-sm"
        role="menubar"
    >
        <li class="page-item">
            <button
                class="page-link"
                @click.prevent="onPageClick(props.modelValue - 1)"
                :disabled="props.modelValue <= 1"
                :class="{ 'disabled': props.modelValue <= 1 }"
            >
                <span aria-hidden="true">&laquo;</span>
            </button>
        </li>
        <li
            v-for="page in pagesShown"
            :key="`page-${page.id}`"
            class="page-item"
            :class="{ 'disabled': page.isEllipsis, 'active': page.isCurrent }"
        >
            <span
                v-if="page.isEllipsis"
                class="page-link"
            >
                {{ ellipsisText }}
            </span>
            <button
                v-else
                class="page-link"
                @click.prevent="onPageClick(page.id)"
            >
                {{ page.id }}
            </button>
        </li>
        <li class="page-item">
            <button
                class="page-link"
                @click.prevent="onPageClick(props.modelValue + 1)"
                :disabled="props.modelValue >= pages.length"
                :class="{ 'disabled': props.modelValue >= pages.length }"
            >
                <span aria-hidden="true">&raquo;</span>
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
    const totalPages = Math.ceil(props.total / props.perPage)

    const pages = Array.from({ length: totalPages }, (_, index) => {
        const page = index + 1
        const isCurrent = page === props.modelValue
        let isEllipsis = false
        if (totalPages > 7) {
            if (page > 1 && page < totalPages) {
                isEllipsis = Math.abs(page - props.modelValue) > 2
            } else if (page === totalPages) {
                isEllipsis = props.modelValue < totalPages - 3
            } else if (page === 1) {
                isEllipsis = props.modelValue > 4
            }
        }
        return {
            id: page,
            isCurrent,
            isEllipsis
        }
    })

    return pages
})

const pagesShown = computed(() => {
    const maxShownPages = 7
    if (pages.value.length <= maxShownPages) {
        return pages.value
    }
    const start = Math.max(0, props.modelValue - 3)
    const end = Math.min(pages.value.length, start + maxShownPages)
    return pages.value.slice(start, end)
})

function onPageClick (page: number): void {
    $emit('update:modelValue', page)
}

</script>
