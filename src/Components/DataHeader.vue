<template>
    <thead class="__datatable-header">
        <tr>
            <th v-if="actions && actionsOnLeft"></th>
            <data-header-cell
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
    </thead>
</template>

<script>
import DataHeaderCell from './DataHeaderCell.vue'
export default {
    name: 'DataHeader',
    components: {
        DataHeaderCell
    },
    props: {
        header: {
            type: Array,
            required: true
        },
        actionsOnLeft: {
            type: Boolean,
            required: false,
            default: false
        },
        actions: {
            type: Boolean,
            required: false,
            default: true
        },
        sort: {
            type: String,
            required: false
        },
        sortDirection: {
            type: String,
            required: false
        },
        filter: {
            type: Object,
            required: false
        },
        i18n: {
            type: Object,
            required: true
        }
    },
    methods: {
        onFilter (data) {
            this.$emit('filter', data)
        },
        onSort (data) {
            this.$emit('sort', data)
        }
    }
}
</script>
