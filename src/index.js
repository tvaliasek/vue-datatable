import {
    ButtonPlugin,
    PaginationPlugin,
    DropdownPlugin,
    BIcon,
    BIconArrowUp,
    BIconArrowDown,
    BIconArrowRepeat,
    BIconPause,
    BIconArrowsExpand,
    FormInputPlugin,
    SpinnerPlugin,
    FormCheckboxPlugin
} from 'bootstrap-vue'
import DataTable from './DataTable.vue'

export const DataTablePlugin = {
    install (Vue) {
        Vue.use(ButtonPlugin)
        Vue.use(PaginationPlugin)
        Vue.use(DropdownPlugin)
        Vue.use(FormInputPlugin)
        Vue.use(SpinnerPlugin)
        Vue.use(FormCheckboxPlugin)
        Vue.component('BIcon', BIcon)
        Vue.component('BIconArrowUp', BIconArrowUp)
        Vue.component('BIconArrowDown', BIconArrowDown)
        Vue.component('BIconArrowRepeat', BIconArrowRepeat)
        Vue.component('BIconPause', BIconPause)
        Vue.component('BIconArrowsExpand', BIconArrowsExpand)
        Vue.component(DataTable.name, DataTable)
    }
}

export { default as DataTable } from './DataTable.vue'
