/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')
const path = require('node:path')
const createAliasSetting = require('@vue/eslint-config-standard-with-typescript/createAliasSetting')

module.exports = {
    root: true,
    extends: [
        'plugin:vue/vue3-essential',
        '@vue/eslint-config-standard-with-typescript',
        '@vue/eslint-config-standard-with-typescript/allow-js-in-vue'
        // '@vue/eslint-config-typescript'
    ],
    parserOptions: {
        ecmaVersion: 'latest',
        project: ['./tsconfig.json'],
        extraFileExtensions: ['.vue']
    },
    ignorePatterns: [
        'shims-vue.d.ts'
    ],
    rules: {
        'vue/component-name-in-template-casing': ['error', 'PascalCase'],
        'no-console': 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        indent: ['error', 4, {
            SwitchCase: 1,
            VariableDeclarator: 1,
            outerIIFEBody: 1,
            MemberExpression: 1,
            FunctionDeclaration: { parameters: 1, body: 1 },
            FunctionExpression: { parameters: 1, body: 1 },
            CallExpression: { arguments: 1 },
            ArrayExpression: 1,
            ObjectExpression: 1,
            ImportDeclaration: 1,
            flatTernaryExpressions: false,
            ignoreComments: false,
            ignoredNodes: ['TemplateLiteral *', 'JSXElement', 'JSXElement > *', 'JSXAttribute', 'JSXIdentifier', 'JSXNamespacedName', 'JSXMemberExpression', 'JSXSpreadAttribute', 'JSXExpressionContainer', 'JSXOpeningElement', 'JSXClosingElement', 'JSXFragment', 'JSXOpeningFragment', 'JSXClosingFragment', 'JSXText', 'JSXEmptyExpression', 'JSXSpreadChild'],
            offsetTernaryExpressions: true
        }],
        '@typescript-eslint/indent': ['error', 4, {
            SwitchCase: 1,
            VariableDeclarator: 1,
            outerIIFEBody: 1,
            MemberExpression: 1,
            FunctionDeclaration: { parameters: 1, body: 1 },
            FunctionExpression: { parameters: 1, body: 1 },
            CallExpression: { arguments: 1 },
            ArrayExpression: 1,
            ObjectExpression: 1,
            ImportDeclaration: 1,
            flatTernaryExpressions: false,
            ignoreComments: false,
            ignoredNodes: ['TemplateLiteral *', 'JSXElement', 'JSXElement > *', 'JSXAttribute', 'JSXIdentifier', 'JSXNamespacedName', 'JSXMemberExpression', 'JSXSpreadAttribute', 'JSXExpressionContainer', 'JSXOpeningElement', 'JSXClosingElement', 'JSXFragment', 'JSXOpeningFragment', 'JSXClosingFragment', 'JSXText', 'JSXEmptyExpression', 'JSXSpreadChild'],
            offsetTernaryExpressions: true
        }],
        'no-prototype-builtins': 'off',
        'template-curly-spacing': 'off',
        'import/no-unresolved': 'error'
    },
    settings: {
        ...createAliasSetting({
            '@': `${path.resolve(__dirname, './src')}`
        }),
        'import/resolver': {
            typescript: true
        }
    }
}
