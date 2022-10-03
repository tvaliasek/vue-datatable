import { BButton } from 'bootstrap-vue/esm/components/button/button'
import { BPagination } from 'bootstrap-vue/esm/components/pagination/pagination'
import { BDropdown, BDropdownItem } from 'bootstrap-vue/esm/components/dropdown'
import { BFormInput } from 'bootstrap-vue/esm/components/form-input/form-input'
import { BSpinner } from 'bootstrap-vue/esm/components/spinner/spinner'

import DataTable from './DataTable.vue'

export const DataTablePlugin = {
    install (Vue) {
        Vue.component(BButton.options.name, BButton)
        Vue.component('b-btn', BButton)
        Vue.component(BPagination.options.name, BPagination)
        Vue.component(BDropdown.options.name, BDropdown)
        Vue.component(BDropdownItem.options.name, BDropdownItem)
        Vue.component(BFormInput.options.name, BFormInput)
        Vue.component(BSpinner.options.name, BSpinner)
        Vue.component(DataTable.name, DataTable)
    }
}

export { default as DataTable } from './DataTable.vue'
