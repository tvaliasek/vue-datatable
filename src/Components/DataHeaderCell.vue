<template>
    <th>
        <a @click.prevent="onSort" href="javascript:void(0);" class="d-block mb-1">
            <BsIcon v-show="sortable" :icon="sortIconName"/> {{ text }}
        </a>
    </th>
</template>

<script setup lang="ts">
import BsIcon from '../Icons/bsIcon.vue'
import { computed } from 'vue'

const props = withDefaults(defineProps<{
    i18n: Record<string, string>
    text: string
    dataField: string
    sort?: string | null
    sortable?: boolean
    sortDirection?: string | null
}>(), {
    sort: null,
    sortable: false,
    sortDirection: null
})

const $emit = defineEmits(['sort'])

const sortIconName = computed(() => {
    if (props.sort === props.dataField) {
        return (props.sortDirection === 'ASC') ? 'arrow-down' : 'arrow-up'
    }
    return 'arrows-expand'
})

function onSort (): void {
    if (props.sortable) {
        $emit('sort', `${props.dataField}`)
    }
}
</script>
