import { BButton, BPagination, BDropdown, BDropdownItem, BFormInput, BSpinner } from 'bootstrap-vue-3'

import DataTable from './DataTable.vue'

export const DataTablePlugin = {
    install (app) {
        app.component('BButton', BButton)
        app.component('BPagination', BPagination)
        app.component('BDropdown', BDropdown)
        app.component('BDropdownItem', BDropdownItem)
        app.component('BFormInput', BFormInput)
        app.component('BSpinner', BSpinner)
        app.component('DataTable', DataTable)
    }
}

export { default as DataTable } from './DataTable.vue'
