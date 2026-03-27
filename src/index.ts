import DataTableComponent from './DataTable.vue'
import type { App, ObjectPlugin } from 'vue'

export const DataTablePlugin: ObjectPlugin = {
    install(app: App, _options?: unknown) {
        app.component('DataTable', DataTableComponent)
    }
}

export { default as DataTable } from './DataTable.vue'
export * from './interfaces'
