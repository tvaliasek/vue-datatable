import { BFormInput, BSpinner } from 'bootstrap-vue-next'

import DataTableComponent from './DataTable.vue'
import type { App, Plugin } from 'vue'

export const DataTablePlugin: Plugin = {
    install (app: App<Element>): void {
        app.component('BFormInput', BFormInput)
        app.component('BSpinner', BSpinner)
        app.component('DataTable', DataTableComponent)
    }
}

export { default as DataTable } from './DataTable.vue'
export * from './interfaces'
