import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { resolve } from 'node:path'
import dts from 'vite-plugin-dts'

const currentDirectory = process.cwd()

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue({}),
        dts({
            tsconfigPath: resolve(currentDirectory, 'tsconfig.declarations.json')
        }),
        vueDevTools()
    ],
    resolve: {
        alias: {
            '@': resolve(currentDirectory, 'src')
        }
    },
    build: {
        sourcemap: true,
        lib: {
            entry: resolve(currentDirectory, 'src/index.ts'),
            name: 'DataTable',
            fileName: (format) => {
                if (format === 'es') {
                    return 'data-table.mjs'
                }
                if (format === 'umd') {
                    return 'data-table.umd.cjs'
                }
                return 'data-table.cjs'
            },
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
