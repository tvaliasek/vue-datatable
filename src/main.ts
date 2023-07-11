import { createApp } from 'vue'
import App from '@/Examples/App.vue'
import Router from './Router'

import { DataTablePlugin } from '.'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue-next/dist/bootstrap-vue-next.css'

const app = createApp(App)
app.use(Router)
app.use(DataTablePlugin)

app.mount('#app')
