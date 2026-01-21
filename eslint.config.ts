import { globalIgnores } from 'eslint/config'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import pluginVue from 'eslint-plugin-vue'
import pluginOxlint from 'eslint-plugin-oxlint'
import stylistic from '@stylistic/eslint-plugin'

// To allow more languages other than `ts` in `.vue` files, uncomment the following lines:
// import { configureVueProject } from '@vue/eslint-config-typescript'
// configureVueProject({ scriptLangs: ['ts', 'tsx'] })
// More info at https://github.com/vuejs/eslint-config-typescript/#advanced-setup

const stylisticConfig = stylistic.configs.customize({
    pluginName: 'recommended',
    indent: 4,
    jsx: false,
    semi: false,
    commaDangle: 'never',
    braceStyle: '1tbs'
})

export default defineConfigWithVueTs(
    {
        name: 'app/files-to-lint',
        files: ['**/*.{ts,mts,tsx,vue}'],
        ignores: ['**/public/**'],
        languageOptions: {
            parserOptions: {
                tsconfigRootDir: __dirname
            }
        }
    },

    globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**', '**/.history/**']),

    pluginVue.configs['flat/recommended'],
    vueTsConfigs.recommended,
    ...pluginOxlint.configs['flat/recommended'],
    stylisticConfig,
    {
        rules: {
            'vue/html-indent': ['error', 4],
            'vue/html-self-closing': ['error', {
                html: {
                    void: 'always',
                    normal: 'never'
                }
            }],
            '@typescript-eslint/no-explicit-any': 'warn'
        }
    }
)
