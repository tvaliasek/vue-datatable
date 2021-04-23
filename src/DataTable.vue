<template>
    <div>
        <div class="row align-items-end mb-1 px-2">
            <div class="col-12 col-md-6 mb-1">
                <slot name="left"></slot>
            </div>
            <div class="col-12 col-md-6 mb-1 text-right">
                <slot name="right"></slot>
                <auto-update-counter
                    v-if="autoUpdate"
                    @refresh="onRefresh"
                    :i18n="i18nStrings"
                />
            </div>
        </div>
        <div :class="responsiveClass">
            <table class="table table-sm table-bordered table-striped mb-0">
                <data-header
                    :actions="actions"
                    :header="header"
                    :filter="filter"
                    :sort="sortBy"
                    :sort-direction="sortDirection"
                    @filter="onFilter"
                    @sort="onSort"
                    :i18n="i18nStrings"
                />
                <tbody v-if="data.length === 0">
                    <tr>
                        <td class="text-center" :colspan="header.length + ((actions) ? 1 : 0)">
                            <p class="mb-0" v-if="!loading">{{ i18nStrings.noData }}</p>
                            <loading-indicator
                                v-else
                                :i18n="i18nStrings"
                            />
                        </td>
                    </tr>
                </tbody>
                <tbody v-else>
                    <data-row
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
                    />
                </tbody>
            </table>
        </div>
        <div class="d-flex justify-content-between flex-wrap my-1">
            <div class="mb-1">
                <b-pagination
                    v-if="paging"
                    size="sm"
                    v-model="currentPage"
                    :total-rows="filteredData.length"
                    :per-page="currentPageLimit"
                    first-number
                    last-number
                />
            </div>
            <div class="mb-1 text-md-right">
                <b-dropdown
                    v-if="paging"
                    variant="primary"
                    :text="`${i18nStrings.perPage} ${currentPageLimit}`"
                    size="sm"
                >
                    <b-dropdown-item
                        v-for="item in pagingOptions"
                        :key="`item-${item}`"
                        @click="currentPageLimit = item"
                    >
                        {{item}}
                    </b-dropdown-item>
                </b-dropdown>
            </div>
        </div>
    </div>
</template>

<script>
import DataHeader from './Components/DataHeader.vue'
import DataRow from './Components/DataRow.vue'
import LoadingIndicator from './Components/LoadingIndicator.vue'
import AutoUpdateCounter from './Components/AutoUpdateCounter.vue'
import langs from './Langs/index.js'
import naturalSort from './Sorters/naturalSort.js'
import flat from 'flat'

export default {
    name: 'DataTable',
    components: {
        DataHeader,
        DataRow,
        LoadingIndicator,
        AutoUpdateCounter
    },
    props: {
        /**
         * ISO language code of translation, as defined in src/Langs
         */
        lang: {
            type: String,
            required: false
        },
        /**
         * Override for language strings, object { key: string }
         */
        i18n: {
            type: Object,
            required: false,
            default () {
                return {}
            }
        },
        /**
         * Toggle auto update feature
         */
        autoUpdate: {
            type: Boolean,
            required: false,
            default: false
        },
        /**
         * Toggle loading state
         */
        loading: {
            type: Boolean,
            required: false,
            default: false
        },
        /**
         * Definition of columns
         */
        header: {
            type: Array,
            required: true
        },
        /**
         * Array of row data objects
         */
        data: {
            type: Array,
            required: false,
            default () {
                return []
            }
        },
        /**
         * Toggle display of actions column
         */
        actions: {
            type: Boolean,
            required: false,
            default: true
        },
        /**
         * Definition of available row actions/buttons
         */
        buttons: {
            type: Array,
            required: false,
            default () {
                return []
            }
        },
        /**
         * Toggle disabled state of all actions/buttons
         */
        disableButtons: {
            type: Boolean,
            required: false,
            default: false
        },
        /**
         * Toggle pagination
         */
        paging: {
            type: Boolean,
            required: false,
            default: false
        },
        /**
         * Rows per page variants
         */
        pagingOptions: {
            type: Array,
            required: false,
            default () {
                return [
                    10,
                    15,
                    30,
                    60,
                    100
                ]
            }
        },
        /**
         * Holds array of selected rows
         */
        selectedRows: {
            type: Array,
            required: false,
            default () {
                return []
            }
        },
        /**
         * Holds key for selection
         */
        selectedBy: {
            type: String,
            required: false,
            default: 'id'
        },
        /**
         * Holds list of in-progress async actions
         */
        runningActions: {
            type: Array,
            required: false,
            default: () => []
        },
        responsive: {
            required: false,
            default: false
        }
    },
    data () {
        return {
            filter: {},
            sortBy: null,
            sortDirection: null,
            currentPage: 1,
            currentPageLimit: (this.pagingOptions.length > 0) ? this.pagingOptions[0] : 15
        }
    },
    computed: {
        responsiveClass () {
            if (this.responsive) {
                return (this.responsive === true) ? 'table-responsive' : `table-responsive-${this.responsive}`
            }
            return null
        },
        i18nStrings () {
            const defaults = (this.lang !== undefined && langs[this.lang]) ? langs[this.lang] : langs.en_US
            return {
                ...defaults,
                ...this.i18n
            }
        },
        sortFunctions () {
            const tmp = {}
            for (const cell of this.header) {
                tmp[cell.data] = cell.sortFn
            }
            return tmp
        },
        filterFunctions () {
            const tmp = {}
            for (const cell of this.header) {
                tmp[cell.data] = cell.filterFn
            }
            return tmp
        },
        formatFunctions () {
            const tmp = {}
            for (const cell of this.header) {
                tmp[cell.data] = cell.format
            }
            return tmp
        },
        flattenedData () {
            return this.data.map((item) => {
                return flat.flatten(item, { safe: true })
            })
        },
        filteredData () {
            if (this.filter === undefined || this.filter === null || Object.keys(this.filter).length === 0) {
                return this.flattenedData
            }
            const activeFilters = Object.keys(this.filter)
            return this.flattenedData.filter((row) => {
                let isVisible = true
                // fix for missing data property
                const rowIndexes = Object.keys(row)
                for (const filter of activeFilters) {
                    if (rowIndexes.indexOf(filter) === -1 && this.filter[filter] !== '') {
                        return false
                    }
                }

                for (const index in row) {
                    if (this.filter.hasOwnProperty(index) && this.filter[index] !== '' && this.filter[index]) {
                        if (this.filterFunctions.hasOwnProperty(index) && typeof this.filterFunctions[index] === 'function') {
                            isVisible = isVisible && this.filterFunctions[index](`${row[index]}`, this.filter[index], row)
                        } else if (this.formatFunctions[index] && typeof this.formatFunctions[index] === 'function') {
                            isVisible = isVisible && (`${this.formatFunctions[index](row[index])}`.indexOf(this.filter[index]) > -1)
                        } else {
                            isVisible = isVisible && (`${row[index]}`.toLocaleLowerCase().indexOf(`${this.filter[index]}`.toLocaleLowerCase()) > -1)
                        }
                        if (!isVisible) {
                            return false
                        }
                    }
                }
                return isVisible
            })
        },
        sortedData () {
            if (this.sortBy !== null) {
                const sortFn = this.sortFunctions[this.sortBy] ?? naturalSort
                if (sortFn !== null) {
                    return ((this.sortDirection === 'DESC')
                        ? [...this.filteredData].sort((a, b) => sortFn(a[this.sortBy], b[this.sortBy]))
                        : [...this.filteredData].sort((a, b) => sortFn(b[this.sortBy], a[this.sortBy])))
                }
            }
            return this.filteredData
        },
        pagedData () {
            if (this.paging) {
                const offset = ((-1 + this.currentPage) * this.currentPageLimit)
                return this.getPortionOfArray(this.sortedData, offset, this.currentPageLimit)
            }
            return this.sortedData
        },
        processedData () {
            return this.pagedData.map((row) => {
                return {
                    row: flat.unflatten(row, { safe: true }),
                    cells: this.header.map((item) => {
                        if (row.hasOwnProperty(item.data)) {
                            const data = { index: item.data, content: row[item.data], customComponent: item.customComponent }
                            if (typeof item.format === 'function') {
                                data.content = item.format(data.content)
                            }
                            if (typeof item.cellStyle === 'function') {
                                data.cellStyle = item.cellStyle(data.index, data.content, { ...row })
                            }
                            if (Array.isArray(item.cellClassnames)) {
                                data.cellClassnames = item.cellClassnames
                            }
                            return data
                        }
                        return { index: item.data, content: '', customComponent: false }
                    }),
                    selected: this.isSelected(row)
                }
            })
        },
        selectedArray () {
            const tmp = []
            for (const item of this.selectedRows) {
                if (item[this.selectedBy] !== undefined) {
                    tmp.push(item[this.selectedBy])
                }
            }
            return tmp
        }
    },
    methods: {
        isSelected (row) {
            if (this.selectedArray.length === 0) {
                return false
            }
            return this.selectedArray.indexOf(row[this.selectedBy]) > -1
        },
        getPortionOfArray (sourceArray, offset, limit) {
            const content = []
            for (let i = offset; i < sourceArray.length; i++) {
                content.push(sourceArray[i])
                if (content.length >= limit) {
                    break
                }
            }
            return content
        },
        onSort (cellDataProp) {
            if (this.sortBy !== cellDataProp) {
                this.sortBy = cellDataProp
                this.sortDirection = 'ASC'
            } else {
                if (this.sortDirection === 'ASC') {
                    this.sortDirection = 'DESC'
                } else {
                    this.sortBy = null
                }
            }
        },
        onRefresh () {
            this.$emit('refresh')
        },
        onFilter (value) {
            this.filter = { ...value }
        },
        onAction (value) {
            this.$emit('action', value)
            this.$emit(value.event, value.row)
        }
    }
}
</script>

<style lang="scss">
.table thead.__datatable-header th {
    vertical-align: top;
}

table.table-sm-font, .table-sm-font table {
    font-size: 14px;
}
</style>
