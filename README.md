# Simple Bootstrap 5 and Vue 3 data table

Very naive and simple data table for Bootstrap 5 and Vue 3. For Vue 2 use version 1.x.

## Install
``` sh
npm install @tvaliasek/vue-datatable

# peer dependencies
npm install bootstrap
npm install bootstrap-vue-3
```

``` js
import { createApp } from 'vue'
import { DataTablePlugin } from '@tvaliasek/vue-datatable'

import '@tvaliasek/vue-datatable/dist/data-table.css'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue-3/dist/bootstrap-vue-3.css'

const app = createApp(App)
app.use(DataTablePlugin)

app.mount('#app')
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
| actionsOnLeft | Boolean | no | false | set to true for render actions cell in first column |
| selectableRows | Boolean | no | false | Set to true to enable selectability of table rows. Do not forget to set v-model and "selectableRowsTrackBy" property. |
| selectableRowsCheckboxes | Boolean | no | false | Set to true to perform selection of rows trough checkboxes displayed in first cell of rows. Please note that using this feature automatically disable selection of rows trough clicking on any data cell. | 
| selectableRowsTrackBy | String | no | id | Unique data property of flattened row which should be used as tracking id for row selection. |
| selectableRowsClass | String | no | vue-datatable-selected-row | CSS class added to selected rows (on TR tag). |
| exportable | Boolean | no | false | Show export button |
| stateSaving | Boolean | no | false | Enable internal state saving feature. State is saved in sessionStorage under specified key |
| stateSavingUniqueKey | String | no | vueDataTable | a unique key under which the internal state will be stored | 
| tableUniqueKey | String | no | generated from _uid | custom unique key for table |
| remoteDataMode | Boolean | no | false | set to true to enable remote data mode |
| remoteDataTotalRows | Number | no | 0 | required for pagination to work when remote data mode is enabled, total number of rows in remote dataset |

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
| aggregate | Function | no | undefined | Array reducer function for aggregation of filtered and flattened data. Whole flattened row is obtained as reducer currentValue. [See Array.reduce](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce) |
| aggregateInitialValue | Any | no | undefined | Value to use as aggregation (reducer) initial value. |
| aggregateText | String | no | undefined | Text to place before aggregation result. |
| clickToSelect | Boolean | no | true | Set to false to disable click to select row function for this column |

### DataTable actions definition

Actions are defined as Array of objects, each action generates button and emits two events, common `action` event and event named as is defined in definition

| property | type | required | default | usage |
| -------- | ---- | -------- | ------- |------ |
| text | String | yes | undefined | Text displayed as caption of button |
| event | String | yes | undefined | Name of emitted event |
| variant | String | no | undefined | Bootstrap variant of button ex: `'primary'`, `'danger'` |
| confirm | Boolean | no | false | Enable confirmation when button is clicked |
| confirmText | String | no | undefined | Text to show on confirmation prompt |
| customComponent | Function | no | undefined | Function which returns custom component instance or name, component will receive whole data row in prop named row |
| visibleIf | Function | no | undefined | Function which returns boolean to indicate if button should be visible, function will receive whole data row as first parameter |
| customTextComponent | String or function | no | undefined | Custom component for default slot of button, can be combined with text | 
| customTextComponentProps| Record<string, any> | no | undefined | Object with props which will be passed to customTextComponent |

### Events

| event | data | usage |
| ----- | ---- | ----- |
| refresh | undefined | Emitted on update tick when auto update feature is enabled |
| action | { event: nameOfEvent, row: object } | Emitted on click to any action button |
| as defined in action | { ...row } | Emitted on click to any action button |
| export | [{ cellDataProperty: cellContent }] | Emitted on click to export button |
| remote-data-refresh | `{ filter: {key: filterQuery}[], sortBy: string, sortDirection: string, currentPage: number, currentPageLimit: number }` | Emitted on any display settings change during remote data mode, automatically debounced |

## Run demo
``` sh
# clone repo using your favourite git client
gh repo clone tvaliasek/vue-datatable ./vue-datatable
cd vue-datatable
npm install
npm run dev
```
