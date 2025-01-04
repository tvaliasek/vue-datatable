<template>
    <div :class="{ '__datatable-sm': size === 'sm' }">
        <div class="row align-items-end mb-1 px-2">
            <div class="col-12 col-md-6 mb-1">
                <slot name="left"></slot>
            </div>
            <div class="col-12 col-md-6 mb-1 text-end">
                <slot name="right"></slot>
                <AutoUpdateCounter
                    v-if="autoUpdate"
                    @refresh="onRefresh"
                    :i18n="i18nStrings"
                    :auto-update-limit="autoUpdateLimit"
                />
            </div>
        </div>
        <slot name="beforeTable"></slot>
        <div :class="responsiveClass">
            <table :class="tableClassnames">
                <DataHeader
                    :actions="actions"
                    :header="header"
                    :filter="filter"
                    :sort="sortBy"
                    :sort-direction="sortDirection"
                    :i18n="i18nStrings"
                    :actions-on-left="actionsOnLeft"
                    :selectable-rows="selectableRows"
                    :selectable-rows-checkboxes="selectableRowsCheckboxes"
                    :selected-count="selectedRows.length"
                    @filter="onFilter"
                    @sort="onSort"
                    @select-all="onSelectAll"
                    @select-none="onSelectNone"
                />
                <tbody v-if="loading || data.length === 0">
                    <slot name="firstRow"></slot>
                    <tr>
                        <td class="text-center" :colspan="(header.length + ((actions) ? 1 : 0)) + ((selectableRows && selectableRowsCheckboxes) ? 1 : 0)">
                            <p class="mb-0" v-if="!loading">
                                {{ i18nStrings.noData }}
                            </p>
                            <LoadingIndicator
                                v-else
                                :i18n="i18nStrings"
                            />
                        </td>
                    </tr>
                    <slot name="lastRow"></slot>
                </tbody>
                <tbody v-else>
                    <slot name="firstRow"></slot>
                    <DataRow
                        v-for="(row, index) in processedData"
                        :key="`row-${index}`"
                        :row="row"
                        :header="header"
                        :filter="filter"
                        :actions="actions"
                        :buttons="buttons"
                        @action="onAction"
                        :i18n="i18nStrings"
                        :disable-buttons="disableButtons"
                        :running-actions="runningActions"
                        :actions-on-left="actionsOnLeft"
                        :selectable-rows="selectableRows"
                        :selectable-rows-checkboxes="selectableRowsCheckboxes"
                        :selectable-rows-track-by="selectableRowsTrackBy"
                        :selectable-rows-class="selectableRowsClass"
                        @rowSelectToggle="onRowSelectToggle"
                        :row-index="index"
                        :table-unique-key="uniqueKey"
                        :row-class="rowClass"
                    />
                    <tr v-if="Object.keys(aggregateFunctions).length > 0">
                        <td v-if="selectableRows && selectableRowsCheckboxes">
                        </td>
                        <th v-for="(cell, index) of header" :key="`aggregator-${cell.data}-${index}`" >
                            <span v-if="aggregateTexts[cell.data]">
                                {{aggregateTexts[cell.data]}}<br/>
                            </span>
                            <span v-if="typeof aggregateFunctions[cell.data] === 'function'">
                                {{filteredData.reduce(aggregateFunctions[cell.data], aggregateInitialValues[cell.data])}}
                            </span>
                        </th>
                        <th v-if="actions"></th>
                    </tr>
                    <slot name="lastRow"></slot>
                </tbody>
            </table>
        </div>
        <slot name="afterTable"></slot>
        <div class="d-flex justify-content-between flex-wrap my-1">
            <div class="mb-1">
                <slot name="bottomLeft"></slot>
                <BPagination
                    v-if="paging"
                    size="sm"
                    v-model="currentPage"
                    :total-rows="(props.remoteDataMode) ? props.remoteDataTotalRows : filteredData.length"
                    :per-page="currentPageLimit"
                    :first-number="true"
                    :last-number="((props.remoteDataMode) ? props.remoteDataTotalRows : filteredData.length) > currentPageLimit"
                />
            </div>
            <div class="mb-1 text-md-end">
                <slot name="bottomRight"></slot>
                <BDropdown
                    v-if="paging"
                    variant="primary"
                    :text="`${i18nStrings.perPage} ${currentPageLimit}`"
                    size="sm"
                >
                    <BDropdownItem
                        v-for="item in pagingOptions"
                        :key="`item-${item}`"
                        @click="currentPageLimit = item"
                    >
                        <button class="btn btn-link cursor-pointer">{{item}}</button>
                    </BDropdownItem>
                </BDropdown>

                <button
                    class="btn btn-primary btn-sm ms-2"
                    v-if="exportable"
                    @click.prevent="onExport"
                >
                    {{i18nStrings.exportButtonText}}
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
// eslint-disable @typescript-eslint/restrict-template-expressions
import DataHeader from './Components/DataHeader.vue'
import DataRow from './Components/DataRow.vue'
import LoadingIndicator from './Components/LoadingIndicator.vue'
import AutoUpdateCounter from './Components/AutoUpdateCounter.vue'
import langs from './Langs/index'
import naturalSort from './Sorters/naturalSort'
import { flatten, unflatten } from 'flat'
import { generateString } from './randomString'
import { onBeforeMount, ref, computed, watch, toValue, nextTick } from 'vue'
import type { ProcessedRowData, ColumnDefinition, ActionButtonDefinition, ProcessedCell } from './interfaces'
import BDropdown from './Components/ui/BDropdown.vue'
import BDropdownItem from './Components/ui/BDropdownItem.vue'

const $emit = defineEmits([
    'update:modelValue',
    'action',
    'remote-data-refresh',
    'refresh',
    'export'
])

const props = withDefaults(
    defineProps<{
        remoteDataMode?: boolean
        remoteDataTotalRows?: number
        actionsOnLeft?: boolean
        lang?: string
        i18n?: Record<string, string>
        autoUpdate?: boolean
        loading?: boolean
        header?: ColumnDefinition[]
        data?: Array<Record<string, any>>
        actions?: boolean
        buttons?: ActionButtonDefinition[]
        disableButtons?: boolean
        paging?: boolean
        pagingOptions?: number[]
        runningActions?: string[]
        responsive?: boolean | string
        selectableRows?: boolean
        selectableRowsCheckboxes?: boolean
        selectableRowsTrackBy?: string
        selectableRowsClass?: string
        modelValue?: Array<Record<string, any>>
        exportable?: boolean
        stateSaving?: boolean
        stateSavingUniqueKey?: string
        tableUniqueKey?: string | null
        tableClass?: string | null
        size?: string
        autoUpdateLimit?: number
        rowClass?: string | ((row: Record<string, any>) => null | string)
    }>(),
    {
        remoteDataMode: false,
        remoteDataTotalRows: 0,
        actionsOnLeft: false,
        lang: 'en_US',
        i18n: () => ({}),
        autoUpdate: false,
        loading: false,
        header: () => [],
        data: () => [],
        actions: true,
        buttons: () => [],
        disableButtons: false,
        paging: false,
        pagingOptions: () => [10, 15, 30, 60, 100],
        runningActions: () => [],
        responsive: false,
        selectableRows: false,
        selectableRowsCheckboxes: false,
        selectableRowsTrackBy: 'id',
        selectableRowsClass: 'vue-datatable-selected-row',
        modelValue: () => [],
        exportable: false,
        stateSaving: false,
        stateSavingUniqueKey: 'vueDataTable',
        tableUniqueKey: null,
        tableClass: null,
        autoUpdateLimit: 30
    }
)

const filter = ref<Record<string, string>>({})
const sortBy = ref<string | null>(null)
const sortDirection = ref<string | null>(null)
const currentPage = ref(1)
const currentPageLimit = ref((props.pagingOptions.length > 0) ? props.pagingOptions[0] : 15)
const uniqueKey = ref<string>(props.tableUniqueKey ?? `vueDataTable_${generateString(20)}`)

watch(filter, () => {
    onSaveState()
    onRemoteDataRefresh()
})

watch(sortBy, () => {
    onSaveState()
    onRemoteDataRefresh()
})

watch(sortDirection, () => {
    onSaveState()
    onRemoteDataRefresh()
})

watch(currentPage, () => {
    onSaveState()
    onRemoteDataRefresh()
})

watch(currentPageLimit, () => {
    onSaveState()
    onRemoteDataRefresh()
})

const tableClassnames = computed(() => {
    let classNames = (props.tableClass ?? '').split(' ').filter(item => item)
    if (classNames.length === 0) {
        classNames = ['table table-sm table-bordered table-striped mb-0']
    }
    return classNames.join(' ')
})

const selectedRows = computed({
    get () {
        return props.modelValue
    },
    set (value) {
        $emit('update:modelValue', value)
    }
})

const flattenedSelectedRows = computed(() => {
    return props.modelValue.map(item => flatten(item, { safe: true }))
})

const selectedRowIds = computed(() => {
    return flattenedSelectedRows.value.filter(item => item[props.selectableRowsTrackBy] !== undefined).map(item => item[props.selectableRowsTrackBy])
})

const responsiveClass = computed(() => {
    if (props.responsive !== undefined) {
        return (props.responsive === true) ? 'table-responsive' : `table-responsive-${props.responsive}`
    }
    return null
})

const i18nStrings = computed(() => {
    const defaults = (props.lang !== undefined && langs[props.lang]) ? langs[props.lang] : langs.en_US
    return {
        ...defaults,
        ...toValue(props.i18n)
    }
})

const sortFunctions = computed(() => {
    const tmp: Record<string, (a: any, b: any) => number> = {}
    for (const cell of props.header) {
        if (typeof cell.sortFn === 'function') {
            tmp[cell.data] = cell.sortFn
        }
    }
    return tmp
})

const filterFunctions = computed(() => {
    const tmp: Record<string, (...args: any[]) => boolean> = {}
    for (const cell of props.header) {
        if (typeof cell.filterFn === 'function') {
            tmp[cell.data] = cell.filterFn
        }
    }
    return tmp
})

const formatFunctions = computed(() => {
    const tmp: Record<string, (...args: any[]) => any> = {}
    for (const cell of props.header) {
        if (typeof cell.format === 'function') {
            tmp[cell.data] = cell.format
        }
    }
    return tmp
})

const aggregateFunctions = computed(() => {
    const tmp: Record<string, (...args: any[]) => any> = {}
    for (const cell of props.header) {
        if (typeof cell.aggregate === 'function') {
            tmp[cell.data] = cell.aggregate
        }
    }
    return tmp
})

const aggregateTexts = computed(() => {
    const tmp: Record<string, string> = {}
    for (const cell of props.header) {
        if (cell.aggregateText !== undefined) {
            tmp[cell.data] = cell.aggregateText
        }
    }
    return tmp
})

const aggregateInitialValues = computed(() => {
    const tmp: Record<string, any> = {}
    for (const cell of props.header.filter(item => item.aggregateInitialValue !== undefined)) {
        tmp[cell.data] = cell.aggregateInitialValue
    }
    return tmp
})

const flattenedData = computed(() => {
    return props.data.map((item) => {
        return flatten(item, { safe: true })
    })
})

const filteredData = computed(() => {
    if (props.remoteDataMode || filter.value === undefined || filter.value === null || Object.keys(filter.value).length === 0) {
        return flattenedData.value
    }
    const activeFilters = Object.keys(filter.value)
    return flattenedData.value.filter((row: Record<string, any>) => {
        let isVisible = true
        // fix for missing data property
        const rowIndexes = Object.keys(row)
        for (const activeFilter of activeFilters) {
            if (!rowIndexes.includes(activeFilter) && filter.value[activeFilter] !== '') {
                return false
            }
        }

        for (const index in row) {
            if (filter.value.hasOwnProperty(index) && filter.value[index] !== '' && filter.value[index]) {
                if (filterFunctions.value.hasOwnProperty(index) && typeof filterFunctions.value[index] === 'function') {
                    isVisible = isVisible && filterFunctions.value[index](`${row[index]}`, filter.value[index], row)
                } else if (formatFunctions.value[index] && typeof formatFunctions.value[index] === 'function') {
                    isVisible = isVisible && `${formatFunctions.value[index](row[index], row)}`.includes(filter.value[index])
                } else {
                    isVisible = isVisible && `${row[index]}`.toLocaleLowerCase().includes(`${filter.value[index]}`.toLocaleLowerCase())
                }
                if (!isVisible) {
                    return false
                }
            }
        }
        return isVisible
    })
})

const sortedData = computed(() => {
    if (!props.remoteDataMode && sortBy.value !== null) {
        return sortData(filteredData.value)
    }
    return filteredData.value
})

const pagedData = computed(() => {
    if (!props.remoteDataMode && props.paging) {
        const offset = ((-1 + currentPage.value) * currentPageLimit.value)
        return getPortionOfArray(sortedData.value, offset, currentPageLimit.value)
    }
    return sortedData.value
})

const processedData = computed(() => {
    return processData(pagedData.value)
})

onBeforeMount(() => {
    if (props.stateSaving && props.stateSavingUniqueKey) {
        const state = JSON.parse(sessionStorage.getItem('_vueDataTableStates') || '{}')
        if (state && state[props.stateSavingUniqueKey]) {
            const tableState = state[props.stateSavingUniqueKey]
            filter.value = tableState.filter ?? {}
            sortBy.value = tableState.sortBy ?? null
            sortDirection.value = tableState.sortDirection ?? null
            currentPage.value = tableState.currentPage ?? 1
            currentPageLimit.value = tableState.currentPageLimit ?? ((props.pagingOptions.length > 0) ? props.pagingOptions[0] : 15)
        }
    }
})

function onSelectAll (): void {
    selectedRows.value = sortedData.value.map(item => unflatten(item, { safe: true }))
}

function onSelectNone (): void {
    selectedRows.value = []
}

function onSaveState (): void {
    void nextTick(() => {
        if (props.stateSaving && props.stateSavingUniqueKey) {
            const state = JSON.parse(sessionStorage.getItem('_vueDataTableStates') || '{}')
            if (state) {
                state[props.stateSavingUniqueKey] = {
                    filter: filter.value,
                    sortBy: sortBy.value,
                    sortDirection: sortDirection.value,
                    currentPage: currentPage.value,
                    currentPageLimit: currentPageLimit.value
                }
            }
            sessionStorage.setItem('_vueDataTableStates', JSON.stringify(state))
        }
    })
}

const _refreshTm = ref<any>(undefined)
function onRemoteDataRefresh (): void {
    clearTimeout(_refreshTm.value)
    _refreshTm.value = setTimeout(() => {
        $emit(
            'remote-data-refresh',
            JSON.parse(JSON.stringify({
                filter: filter.value,
                sortBy: sortBy.value,
                sortDirection: sortDirection.value,
                currentPage: currentPage.value,
                currentPageLimit: currentPageLimit.value
            }))
        )
    }, 250)
}

function onExport (): void {
    const header: Record<string, string> = {}
    for (const entry of props.header) {
        header[entry.data] = entry.text
    }
    const data = [
        header,
        ...processData(sortData(flattenedData.value)).map(entry => {
            const jsonObject: Record<string, any> = {}
            for (const item of entry.cells) {
                jsonObject[item.index] = item.content
            }
            return jsonObject
        })
    ]
    $emit('export', data)
}

function processData (pagedData: Array<Record<string, any>>): ProcessedRowData[] {
    return pagedData.map((row) => {
        return {
            row: unflatten(row, { safe: true }),
            isSelected: (row[props.selectableRowsTrackBy] !== undefined) ? selectedRowIds.value.includes(row[props.selectableRowsTrackBy]) : false,
            cells: props.header.map((item) => {
                if (row.hasOwnProperty(item.data)) {
                    const data: ProcessedCell = { index: item.data, content: row[item.data], customComponent: (typeof item.customComponent === 'function') ? item.customComponent() : item.customComponent }
                    if (typeof item.format === 'function') {
                        data.content = item.format(data.content, { ...row })
                    }
                    if (typeof item.cellStyle === 'function') {
                        data.cellStyle = item.cellStyle(data.index, data.content, { ...row })
                    }
                    if (typeof item.cellStyle === 'string') {
                        data.cellStyle = item.cellStyle
                    }
                    if (Array.isArray(item.cellClassnames)) {
                        data.cellClassnames = item.cellClassnames
                    }
                    data.clickToSelect = item.clickToSelect !== false && item.clickToSelect !== undefined
                    return data
                }
                return { index: item.data, content: '', customComponent: false }
            })
        }
    })
}

function sortData (filteredData: Array<Record<string, any>>) {
    if (sortBy.value !== null) {
        const sortFn = sortFunctions.value[sortBy.value] ?? naturalSort
        if (sortFn !== null) {
            return ((sortDirection.value === 'DESC')
                // @ts-expect-error
                ? [...filteredData].sort((a, b) => sortFn(a[sortBy.value], b[sortBy.value]))
                // @ts-expect-error
                : [...filteredData].sort((a, b) => sortFn(b[sortBy.value], a[sortBy.value])))
        }
    }
    return filteredData
}

function onRowSelectToggle (row: Record<string, any>) {
    const flatRow = flatten(row, { safe: true })
    if (selectedRowIds.value.includes(flatRow[props.selectableRowsTrackBy])) {
        selectedRows.value = selectedRows.value.filter((item) => flatten(item, { safe: true })[props.selectableRowsTrackBy] !== flatRow[props.selectableRowsTrackBy])
    } else {
        selectedRows.value = [...selectedRows.value, row]
    }
}

function getPortionOfArray (sourceArray: Array<Record<string, any>>, offset: number, limit: number): Array<Record<string, any>> {
    const content = []
    for (let i = offset; i < sourceArray.length; i++) {
        content.push(sourceArray[i])
        if (content.length >= limit) {
            break
        }
    }
    return content
}

function onSort (cellDataProp: string): void {
    if (`${sortBy.value}` !== `${cellDataProp}`) {
        sortBy.value = `${cellDataProp}`
        sortDirection.value = 'ASC'
    } else {
        if (`${sortDirection.value}` === 'ASC') {
            sortDirection.value = 'DESC'
        } else {
            sortBy.value = null
        }
    }
}

function onRefresh (): void {
    if (props.remoteDataMode) {
        onRemoteDataRefresh()
    } else {
        $emit('refresh')
    }
}

function onFilter (value: Record<string, any>): void {
    filter.value = { ...value }
}

function onAction (value: { event: string, row: Record<string, any> }): void {
    $emit('action', value)
    // @ts-expect-error
    $emit(value.event, value.row)
}
</script>

<style lang="scss">
.table thead.__datatable-header th {
    vertical-align: top;
}

table.__datatable-sm, .__datatable-sm table {
    font-size: 14px;
}
</style>
