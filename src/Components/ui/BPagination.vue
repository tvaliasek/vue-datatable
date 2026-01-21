<template>
    <ul
        class="pagination justify-content-start pagination-sm"
        role="menubar"
    >
        <li v-if="firstNumber" class="page-item">
            <button
                class="page-link"
                :disabled="props.modelValue <= 1"
                :class="{ 'disabled': props.modelValue <= 1 }"
                @click.prevent="onPageClick(1)"
            >
                <span aria-hidden="true">&laquo;</span>
            </button>
        </li>
        <li class="page-item">
            <button
                class="page-link"
                @click.prevent="onPageClick(props.modelValue - 1)"
                :disabled="props.modelValue <= 1"
                :class="{ 'disabled': props.modelValue <= 1 }"
            >
                <span aria-hidden="true">
                    &lsaquo;
                </span>
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
                <span aria-hidden="true">
                    &rsaquo;
                </span>
            </button>
        </li>
        <li v-if="lastNumber" class="page-item">
            <button
                class="page-link"
                :disabled="props.modelValue >= pages.length"
                :class="{ 'disabled': props.modelValue >= pages.length }"
                @click.prevent="onPageClick(pages.length)"
            >
                <span aria-hidden="true">&raquo;</span>
            </button>
        </li>
    </ul>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
    modelValue?: number
    total?: number
    perPage?: number
    ellipsisText?: string
    firstNumber?: boolean
    lastNumber?: boolean
}>(), {
    modelValue: 1,
    total: 0,
    perPage: 10,
    ellipsisText: '...',
    firstNumber: false,
    lastNumber: false
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
        return {
            id: page,
            isCurrent,
            isEllipsis: false
        }
    })

    return pages
})

const pagesShown = computed(() => {
    const maxShownPages = 6
    if (pages.value.length <= maxShownPages) {
        return pages.value
    }
    let start = Math.max(0, props.modelValue - 3)
    if (start + maxShownPages > pages.value.length) {
        start = pages.value.length - maxShownPages
    }
    const end = Math.min(pages.value.length, start + maxShownPages)
    const result = pages.value.slice(start, end)

    if (start > 0) {
        result[0]!.isEllipsis = true
    }
    if (end < pages.value.length) {
        result[result.length - 1]!.isEllipsis = true
    }
    return result
})

function onPageClick (page: number): void {
    $emit('update:modelValue', page)
}

</script>
