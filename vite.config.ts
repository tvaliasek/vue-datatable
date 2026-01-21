import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { resolve } from 'node:path'
import dts from 'vite-plugin-dts'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue({}),
        dts({
            tsconfigPath: resolve(__dirname, 'tsconfig.declarations.json')
        }),
        vueDevTools()
    ],
    resolve: {
        alias: {
            '@': resolve(__dirname, 'src')
        }
    },
    build: {
        sourcemap: true,
        lib: {
            entry: resolve(__dirname, 'src/index.ts'),
            name: 'DataTable',
            fileName: 'data-table',
            formats: ['es', 'umd', 'cjs']
        },
        rollupOptions: {
            external: [
                'vue',
                'bootstrap'
            ],
            output: {
                globals: {
                    vue: 'Vue'
                },
                assetFileNames: 'data-table.[ext]'
            }
        }
    },
    css: {
        preprocessorOptions: {
            scss: {
                silenceDeprecations: [
                    'color-functions',
                    'mixed-decls',
                    'import',
                    'global-builtin'
                ]
            },
            sass: {
                silenceDeprecations: [
                    'color-functions',
                    'mixed-decls',
                    'import',
                    'global-builtin'
                ]
            }
        }
    }
})

