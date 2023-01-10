import { createApp } from 'vue'
import App from './App.vue'
import { DataTablePlugin } from '.'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue-3/dist/bootstrap-vue-3.css'

const app = createApp(App)
app.use(DataTablePlugin)

app.mount('#app')
