import Vue from 'vue'
import App from './App.vue'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import { DataTablePlugin } from './index.js'

Vue.config.productionTip = false

Vue.use(DataTablePlugin)

new Vue({
    render: h => h(App)
}).$mount('#app')
