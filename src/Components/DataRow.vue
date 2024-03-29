<template>
    <tr :class="rowClassnames">
        <td v-if="selectableRows && selectableRowsCheckboxes" class="vue-datatable-vertical-align-middle">
            <div class="custom-control custom-checkbox">
                <input type="checkbox" class="custom-control-input" :id="`${tableUniqueKey}_rowCheckbox-${rowIndex}`" v-model="selectedModel">
            </div>
        </td>
        <DataRowButtons
            v-if="actions && actionsOnLeft"
            :actions-on-left="actionsOnLeft"
            :row="row"
            :buttons="buttons"
            :i18n="i18n"
            :disable-buttons="disableButtons"
            :running-actions="runningActions"
            @action="onAction"
        />
        <template
            v-for="(item, index) in row.cells"
            :key="`rw-${index}`"
        >
            <component
                v-if="item.customComponent"
                :is="item.customComponent"
                :row="row.row"
                :data-index="item.index"
                @action="onAction"
                @click="onCellClick(item)"
            />
            <td
                v-else
                :style="(item.cellStyle) ? item.cellStyle : undefined"
                :class="(Array.isArray(item.cellClassnames)) ? item.cellClassnames.join(' ') : undefined"
                @action="onAction"
                @click="onCellClick(item)"
            >
                {{ item.content }}
            </td>
        </template>
        <DataRowButtons
            v-if="actions && !actionsOnLeft"
            :actions-on-left="actionsOnLeft"
            :row="row"
            :buttons="buttons"
            :i18n="i18n"
            :disable-buttons="disableButtons"
            :running-actions="runningActions"
            @action="onAction"
        />
    </tr>
</template>

<script setup lang="ts">
import DataRowButtons from './DataRowButtons.vue'
import type { ProcessedRowData, ActionButtonDefinition, ColumnDefinition, ProcessedCell } from '../interfaces'
import { computed } from 'vue'

const props = withDefaults(defineProps<{
    actionsOnLeft?: boolean
    header: ColumnDefinition[]
    row: ProcessedRowData
    actions?: boolean
    buttons?: ActionButtonDefinition[]
    i18n: Record<string, string>
    disableButtons?: boolean
    filter?: Record<string, string>
    runningActions?: string[]
    selectableRows?: boolean
    selectableRowsCheckboxes?: boolean
    selectableRowsTrackBy?: string
    selectableRowsClass?: string
    rowIndex: number
    tableUniqueKey: string
    rowClass?: string | ((row: Record<string, any>) => null | string)
}>(), {
    actionsOnLeft: false,
    actions: true,
    buttons: () => [],
    disableButtons: false,
    runningActions: () => [],
    selectableRows: false,
    selectableRowsCheckboxes: false,
    selectableRowsTrackBy: 'id',
    selectableRowsClass: 'vue-datatable-selected-row'
})

const $emit = defineEmits(['action', 'rowSelectToggle'])

const selected = computed(() => {
    return props.row.isSelected
})

const selectedModel = computed({
    get () {
        return selected.value
    },
    set (value) {
        $emit('rowSelectToggle', props.row.row)
    }
})

const rowClassnames = computed(() => {
    const classnames: Record<string, boolean> = { 'highlight-row': true }
    if (props.selectableRows && selected.value) {
        classnames[`${props.selectableRowsClass}`] = true
    }
    if (typeof props.rowClass === 'string' && props.rowClass.length > 0) {
        classnames[props.rowClass] = true
    } else if (typeof props.rowClass === 'function') {
        try {
            const computedClass = props.rowClass(props.row.row)
            if (typeof computedClass === 'string' && computedClass.length > 0) {
                classnames[computedClass] = true
            }
        } catch (error) {
            console.error('Error during execution of rowClass callback function', error)
        }
    }
    return classnames
})

function onAction (data: { event: string, row: Record<string, any>}): void {
    $emit('action', data)
}

function onCellClick (item: ProcessedCell): void {
    if (item.clickToSelect === true && props.selectableRows && !props.selectableRowsCheckboxes) {
        selectedModel.value = !selectedModel.value
    }
}
</script>

<style lang="scss" scoped>
.highlight-row {
    &:hover, &:focus {
        td, th {
            color: black;
            background-color: rgba(255,127,39, .4)
        }
    }
}

.__data-row-selected {
    td, th {
        color: black !important;
        background-color: rgb(58, 216, 255) !important;
    }
}

.whitespace-nowrap {
    white-space: nowrap;
}
</style>
