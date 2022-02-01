<template>
    <tr :class="rowClassnames">
        <td v-if="selectableRows && selectableRowsCheckboxes" class="vue-datatable-vertical-align-middle">
            <div class="custom-control custom-checkbox">
                <input type="checkbox" class="custom-control-input" :id="`${tableUniqueKey}_rowCheckbox-${rowIndex}`" v-model="selectedModel">
                <label class="custom-control-label" :for="`${tableUniqueKey}_rowCheckbox-${rowIndex}`"></label>
            </div>
        </td>
        <data-row-buttons
            v-if="actions && actionsOnLeft"
            :actions-on-left="actionsOnLeft"
            :row="row"
            :buttons="buttons"
            :i18n="i18n"
            :disable-buttons="disableButtons"
            :running-actions="runningActions"
            @action="onAction"
        />
        <component
            v-for="(item, index) in row.cells"
            :key="`rw-${index}`"
            :is="(item.customComponent) ? item.customComponent : 'td'"
            :row="(item.customComponent) ? row.row : undefined"
            :style="(item.cellStyle) ? item.cellStyle : undefined"
            :class="(Array.isArray(item.cellClassnames)) ? item.cellClassnames.join(' ') : undefined"
            @action="onAction"
            @click="onCellClick(item)"
        >
            {{ item.content }}
        </component>
        <data-row-buttons
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

<script>
import DataRowButtons from './DataRowButtons.vue'

export default {
    name: 'DataRow',
    components: {
        DataRowButtons
    },
    props: {
        actionsOnLeft: {
            type: Boolean,
            required: false,
            default: false
        },
        header: {
            type: Array,
            required: true
        },
        row: {
            type: Object,
            required: true
        },
        actions: {
            type: Boolean,
            required: false,
            default: true
        },
        buttons: {
            type: Array,
            required: false,
            default () {
                return []
            }
        },
        i18n: {
            type: Object,
            required: true
        },
        disableButtons: {
            type: Boolean,
            required: false,
            default: false
        },
        filter: {
            type: Object,
            required: false
        },
        runningActions: {
            type: Array,
            required: false,
            default: () => []
        },
        selectableRows: {
            type: Boolean,
            required: false,
            default: false
        },
        selectableRowsCheckboxes: {
            type: Boolean,
            required: false,
            default: false
        },
        selectableRowsTrackBy: {
            type: String,
            required: false,
            default: 'id'
        },
        selectableRowsClass: {
            type: String,
            required: false,
            default: 'vue-datatable-selected-row'
        },
        rowIndex: {
            type: Number,
            required: true
        },
        tableUniqueKey: {
            type: String,
            required: true
        }
    },
    computed: {
        selected () {
            return this.row.isSelected === true
        },
        selectedModel: {
            get () {
                return this.selected
            },
            set (value) {
                this.$emit('rowSelectToggle', this.row.row)
            }
        },
        rowClassnames () {
            const classnames = { 'highlight-row': true }
            if (this.selectableRows && this.selected) {
                classnames[`${this.selectableRowsClass}`] = true
            }
            return classnames
        }
    },
    methods: {
        onAction (data) {
            this.$emit('action', data)
        },
        onCellClick (item) {
            if (item.clickToSelect && this.selectableRows && !this.selectableRowsCheckboxes) {
                this.selectedModel = !this.selectedModel
            }
        }
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
