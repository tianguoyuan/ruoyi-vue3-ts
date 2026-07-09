import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import tsEslint from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import pluginImportX, { flatConfigs as importXFlatConfigs } from 'eslint-plugin-import-x'
import perfectionist from 'eslint-plugin-perfectionist'
import pluginPrettier from 'eslint-plugin-prettier'
import parserVue from 'vue-eslint-parser'
import globals from 'globals'

export default [
	{ ignores: ['eslint.config.js', '**/dist/**', '*.cjs'] },
	js.configs.recommended,
	...pluginVue.configs['flat/essential'],
	...pluginVue.configs['flat/strongly-recommended'],
	...pluginVue.configs['flat/recommended'],
	importXFlatConfigs.recommended,
	importXFlatConfigs.typescript,
	{
		name: 'vue3-admin-template',
		files: ['src/**/*.{js,ts,tsx,vue}', 'build/**/*.ts', 'mock/**/*.ts', 'vite.config.ts'],
		languageOptions: {
			parser: parserVue,
			parserOptions: {
				ecmaVersion: 'latest',
				parser: tsParser,
				sourceType: 'module'
			},
			globals: {
				...globals.browser,
				...globals.node,
				...globals.es2021
			}
		},
		plugins: {
			vue: pluginVue,
			'@typescript-eslint': tsEslint,
			prettier: pluginPrettier,
			perfectionist
		},
		rules: {
			'no-var': 'error',
			'no-console': 'off',
			'no-debugger': 'error',
			'no-multiple-empty-lines': ['error', { max: 1 }],
			'no-use-before-define': 'off',
			'prefer-const': 'off',
			'no-irregular-whitespace': 'off',
			eqeqeq: 'error',
			'no-duplicate-imports': 'error',
			'no-undef': 'off',
			'no-unused-vars': 'off',
			'func-style': ['error', 'declaration', { allowArrowFunctions: false }],
			'@typescript-eslint/no-inferrable-types': 'off',
			'@typescript-eslint/no-namespace': 'off',
			'@typescript-eslint/no-explicit-any': 'off',
			'@typescript-eslint/ban-ts-ignore': 'off',
			'@typescript-eslint/ban-types': 'off',
			'@typescript-eslint/explicit-function-return-type': 'off',
			'@typescript-eslint/no-var-requires': 'off',
			'@typescript-eslint/no-empty-function': 'off',
			'@typescript-eslint/no-use-before-define': 'off',
			'@typescript-eslint/ban-ts-comment': 'off',
			'@typescript-eslint/no-non-null-assertion': 'off',
			'@typescript-eslint/explicit-module-boundary-types': 'off',
			'@typescript-eslint/consistent-type-imports': 'error',
			'no-extra-semi': 'off',
			'vue/html-closing-bracket-newline': 'off',
			'vue/html-indent': 'off',
			'vue/singleline-html-element-content-newline': 'off',
			'vue/no-deprecated-model-definition': ['error', { allowVue3Compat: true }],
			'vue/custom-event-name-casing': ['error', 'camelCase'],
			// 变量、函数、属性等必须使用小驼峰命名
			camelcase: ['error', { properties: 'always' }],
			'vue/component-options-name-casing': ['error', 'PascalCase'],
			'vue/component-name-in-template-casing': ['error', 'PascalCase', { registeredComponentsOnly: false, ignores: [] }],
			'vue/this-in-template': 'error',
			'vue/html-self-closing': [
				'error',
				{ html: { void: 'always', normal: 'always', component: 'always' }, svg: 'always', math: 'always' }
			],
			'vue/v-on-event-hyphenation': ['error', 'never'],
			'vue/attribute-hyphenation': ['error', 'never'],
			'vue/multi-word-component-names': 'off',
			'vue/no-deprecated-slot-attribute': 'error',
			'vue/no-deprecated-router-link-tag-prop': ['error', { components: ['RouterLink'] }],
			'vue/attributes-order': [
				'error',
				{
					order: [
						'DEFINITION',
						'LIST_RENDERING',
						'CONDITIONALS',
						'RENDER_MODIFIERS',
						'GLOBAL',
						'UNIQUE',
						'SLOT',
						'TWO_WAY_BINDING',
						'OTHER_DIRECTIVES',
						'OTHER_ATTR',
						'EVENTS',
						'CONTENT'
					],
					alphabetical: true
				}
			],
			'vue/no-required-prop-with-default': 'off',
			'vue/component-api-style': ['error', ['script-setup']],
			'import-x/no-unresolved': 'off',
			'import-x/no-named-as-default': 'off',
			'import-x/no-named-as-default-member': 'off',
			'no-useless-assignment': 'off',
			'import-x/namespace': 'off',
			'import-x/order': 'off',
			'perfectionist/sort-imports': [
				'error',
				{
					type: 'alphabetical',
					order: 'asc',
					ignoreCase: true,
					internalPattern: ['^@/'],
					sortSideEffects: true,
					groups: [
						['builtin', 'external', 'side-effect', 'side-effect-style'],
						{ newlinesBetween: 1 },
						['internal', 'type'],
						{ newlinesBetween: 1 },
						['parent', 'sibling', 'index']
					]
				}
			],
			'perfectionist/sort-objects': [
				'error',
				{
					type: 'alphabetical',
					order: 'asc',
					ignoreCase: true
				}
			],
			'perfectionist/sort-jsx-props': [
				'error',
				{
					type: 'alphabetical',
					order: 'asc',
					ignoreCase: true
				}
			],
			'object-property-newline': ['error', { allowAllPropertiesOnSameLine: false }],
			'object-curly-newline': ['error', { consistent: true, multiline: true }]
		}
	}
]
