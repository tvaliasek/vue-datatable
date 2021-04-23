# Simple Bootstrap Vue 2 data table

Very naive and simple data table for Bootstrap 4 and Vue 2, currently without direct support for remote dataset adapters, but good enough for use in some of my personal projects. 

## Install
``` sh
npm install @tvaliasek/vue-datatable

# peer dependencies
npm install bootstrap
npm install bootstrap-vue
```

``` js
import Vue from 'vue'
import { DataTablePlugin } from '@tvaliasek/vue-datatable'
import '@tvaliasek/vue-datatable/dist/vueDataTable.css'

Vue.use(DataTablePlugin)
```

## Usage
Define columns (header prop) and provide dataset as array of objects.

### DataTable component props

| property | type | required | default | usage |
| -------- | ---- | -------- | ------- |------ |
| lang | String | no | undefined / 'en_US' | ISO language code of translation, as defined in src/Langs |
| i18n | Object | no | {} | Override for language strings, object { key: string } |
| autoUpdate | Boolean | no | false | Toggle auto update feature |
| loading | Boolean | no | false | Toggle loading state |
| header | Array | yes | undefined | Definition of columns (described below) |
| data | Array | no | [] | Array of row data objects |
| actions | Boolean | no | true | Toggle display of actions column |
| buttons | Array | no | [] | Definition of available row actions/buttons |
| disableButtons | Boolean | no | false | Toggle disabled state of all actions/buttons |
| paging | Boolean | no | false | Toggle pagination |
| pagingOptions | Array | no | [ 15, 30, 60, 100 ] | Rows per page variants |
| responsive | Boolean or string | no | null | responsive css class suffix |

### DataTable column definition

Columns are defined as Array of objects

| property | type | required | default | usage |
| -------- | ---- | -------- | ------- |------ |
| text | String | yes | undefined | Text displayed as caption of column |
| data | String | yes | undefined | Name of property in row data object, for nested objects it should be in dot notation ex: ```'person.name'``` |
| sortable | Boolean | no | false | Toggles sorting on column, data is by default sorted naturally |
| filterable | Boolean | no | false | Toggles filtering on column |
| format | Function | no | undefined | Custom cell data format function. ```(value) => value ``` |
| sortFn | Function | no | undefined | Custom sort function ``` sort(a, b) ``` |
| filterFn | Function | no | undefined | Custom filter function ``` filter(cellValue, filterValue, rowData) ``` |
| customComponent | Function | no | undefined | Function which returns custom component instance or name, component will receive whole data row in prop named row |
| cellStyle | String | no | undefined | CSS style rules to apply on column data cells |
| cellClassnames | Array | no | [] | Array of css class names to apply on column data cells |

### DataTable actions definition

Actions are defined as Array of objects, each action generates button and emits two events, common `action` event and event named as is defined in definition

| property | type | required | default | usage |
| -------- | ---- | -------- | ------- |------ |
| text | String | yes | undefined | Text displayed as caption of button |
| event | String | yes | undefined | Name of emitted event |
| variant | String | yes | undefined | Bootstrap variant of button ex: `'primary'`, `'danger'` |
| confirm | Boolean | no | false | Enable confirmation when button is clicked |
| confirmText | String | no | undefined | Text to show on confirmation prompt |

### Events

| event | data | usage |
| ----- | ---- | ----- |
| refresh | undefined | Emitted on update tick when auto update feature is enabled |
| action | { event: nameOfEvent, row: object } | Emitted on click to any action button |
| as defined in action | { ...row } | Emitted on click to any action button |

## Run demo
``` sh
# clone repo using your favourite git client
gh repo clone @tvaliasek/vue-datatable ./vue-datatable
cd vue-datatable
npm install
npm run serve
```