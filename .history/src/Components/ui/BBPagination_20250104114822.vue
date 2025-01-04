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
            v-for="page in pages"
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
        const isEllipsis = page === 1 || page === totalPages || (page >= props.modelValue - 1 && page <= props.modelValue + 1)
        return {
            id: page,
            isCurrent,
            isEllipsis
        }
    })

    return pages
})

function onPageClick (page: number): void {
    $emit('update:modelValue', page)
}

</script>
