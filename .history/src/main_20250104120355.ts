import { createApp } from 'vue'
import App from './App.vue'
import { DataTablePlugin } from '.'

import 'bootstrap/dist/css/bootstrap.css'

const app = createApp(App)
app.use(DataTablePlugin)

app.mount('#app')
