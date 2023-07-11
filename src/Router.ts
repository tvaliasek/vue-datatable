import { createRouter, createWebHistory } from 'vue-router'
export default createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'ExampleHome',
            component: async () => await import('@/Examples/Complex/App.vue')
        },
        {
            path: '/custom-buttons',
            name: 'ExampleCustomButtons',
            component: async () => await import('@/Examples/CustomButtons/App.vue')
        }
    ]
})
