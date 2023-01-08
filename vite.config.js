/* eslint-disable import/no-unresolved */
import { fileURLToPath, URL } from 'node:url'
import Components from 'unplugin-vue-components/vite'
import { BootstrapVue3Resolver } from 'unplugin-vue-components/resolvers'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'node:path'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        Components({
            resolvers: [BootstrapVue3Resolver()]
        })
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },
    build: {
        lib: {
            entry: resolve(__dirname, 'src/lib-main.js'),
            name: 'SchemaForm',
            fileName: 'schema-form'
        },
        rollupOptions: {
            external: [
                'vue',
                'bootstrap',
                'bootstrap-vue-3',
                'vue',
                'vuelidate'
            ],
            output: {
                globals: {
                    vue: 'Vue'
                }
            }
        }
    }
})
