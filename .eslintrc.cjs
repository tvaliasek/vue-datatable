require('@rushstack/eslint-patch/modern-module-resolution')
const path = require('node:path')
const createAliasSetting = require('@vue/eslint-config-standard/createAliasSetting')

/* eslint-env node */
module.exports = {
    root: true,
    extends: [
        'plugin:vue/vue3-essential',
        // 'eslint:recommended',
        '@vue/eslint-config-standard'
    ],
    parserOptions: {
        ecmaVersion: 'latest'
    },
    rules: {
        'no-console': 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        indent: ['error', 4, { SwitchCase: 1, ignoredNodes: ['TemplateLiteral'] }],
        'no-prototype-builtins': 'off',
        'template-curly-spacing': 'off',
        'import/no-unresolved': 'error'
    },
    settings: {
        ...createAliasSetting({
            '@': `${path.resolve(__dirname, './src')}`
        })
    }
}
