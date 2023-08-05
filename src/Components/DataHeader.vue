<template>
    <thead class="__datatable-header">
        <tr>
            <th v-if="selectableRows && selectableRowsCheckboxes" class="vue-datatable-vertical-align-middle">
                <div class="custom-control custom-checkbox">
                    <label class="d-flex align-items-center align-content-center gap-1">
                        <input type="checkbox" class="custom-control-input" v-model="selectAllState">
                        <span>{{ selectedCount }}</span>
                    </label>
                </div>
            </th>
            <th v-if="actions && actionsOnLeft"></th>
            <DataHeaderCell
                v-for="(cell, index) in header"
                :key="`header-${index}`"
                :text="cell.text"
                :data-field="cell.data"
                :sort="sort"
                :sort-direction="sortDirection"
                :filterable="cell.filterable"
                :filter="filter"
                :sortable="cell.sortable"
                @filter="onFilter"
                @sort="onSort"
                :i18n="i18n"
            />
            <th v-if="actions && !actionsOnLeft"></th>
        </tr>
        <tr v-if="header.filter(item => item.filterable === true)">
            <th v-if="selectableRows && selectableRowsCheckboxes"></th>
            <th v-if="actions && actionsOnLeft"></th>
            <th
                v-for="(cell, index) in header"
                :key="`header-filter-${index}`"
            >
                <DataHeaderCellFilter
                    v-if="cell.filterable"
                    :data-field="cell.data"
                    :filter="filter"
                    @filter="onFilter"
                    :i18n="i18n"
                />
            </th>
            <th v-if="actions && !actionsOnLeft"></th>
        </tr>
    </thead>
</template>

<script setup lang="ts">
import type { ColumnDefinition } from '@/interfaces'
import DataHeaderCell from './DataHeaderCell.vue'
import DataHeaderCellFilter from './DataHeaderCellFilter.vue'
import { computed, ref } from 'vue'

withDefaults(defineProps<{
    selectableRows: boolean
    selectableRowsCheckboxes: boolean
    header: ColumnDefinition[]
    actionsOnLeft: boolean
    actions: boolean
    sort?: string | null
    sortDirection?: string | null
    filter?: Record<string, string>
    i18n: Record<string, string>
    selectedCount?: number
}>(), {
    selectableRows: false,
    selectableRowsCheckboxes: false,
    actionsOnLeft: false,
    sort: null,
    sortDirection: null,
    filter: () => ({}),
    selectedCount: 0
})

const selectAll = ref(false)

const selectAllState = computed({
    get () {
        return selectAll.value
    },
    set (value) {
        selectAll.value = value
        $emit((selectAll.value) ? 'selectAll' : 'selectNone')
    }
})

const $emit = defineEmits(['filter', 'sort', 'selectAll', 'selectNone'])

function onFilter (data: Record<string, string>): void {
    $emit('filter', data)
}

function onSort (data: string): void {
    $emit('sort', data)
}
</script>
