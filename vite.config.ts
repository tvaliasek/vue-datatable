/* eslint-disable import/no-unresolved */
import { fileURLToPath, URL } from 'node:url'
import Components from 'unplugin-vue-components/vite'
import { BootstrapVueNextResolver } from 'unplugin-vue-components/resolvers'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'node:path'
import dts from 'vite-plugin-dts'
import typescript2 from 'rollup-plugin-typescript2'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        dts({
            insertTypesEntry: true,
        }),
        Components({
            resolvers: [BootstrapVueNextResolver()],
            dts: true
        }),
        typescript2({
          check: false,
          include: [
            "src/Components/**/*.vue",
            "src/DataTable.vue",
          ],
          tsconfigOverride: {
            compilerOptions: {
              outDir: "dist",
              sourceMap: true,
              declaration: true,
              declarationMap: true,
            }
          },
          exclude: ["vite.config.ts"]
        })
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },
    build: {
        lib: {
            entry: resolve(__dirname, 'src/index.ts'),
            name: 'DataTable',
            fileName: 'data-table'
        },
        rollupOptions: {
            external: [
                'vue',
                'bootstrap',
                { 'bootstrap-vue-next': 'bootstrap-vue-next' }
            ],
            output: {
                globals: {
                    vue: 'Vue'
                },
                assetFileNames: 'data-table.[ext]'
            }
        }
    }
})
