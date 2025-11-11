module.exports = {
	root: true,
	env: {
		browser: true,
		es2021: true,
		node: true
	},
	parser: 'vue-eslint-parser',
	parserOptions: {
		ecmaVersion: 12,
		parser: '@typescript-eslint/parser',
		sourceType: 'module'
	},
	extends: [
		'eslint:recommended',
		'plugin:vue/vue3-essential',
		'plugin:vue/vue3-strongly-recommended',
		'plugin:vue/vue3-recommended'
	],
	plugins: ['vue', '@typescript-eslint', 'prettier'],
	/*
	 * "off" 或 0    ==>  关闭规则
	 * "warn" 或 1   ==>  打开的规则作为警告（不影响代码执行）
	 * "error" 或 2  ==>  规则作为一个错误（代码不能执行，界面报错）
	 */
	rules: {
		// eslint (http://eslint.cn/docs/rules)
		'no-var': 'error', // 要求使用 let 或 const 而不是 var
		'no-console': 'off', // 禁用console
		'no-debugger': 'error', // 禁用 debugger
		'no-multiple-empty-lines': ['error', { max: 1 }], // 不允许多个空行
		'no-use-before-define': 'off', // 禁止在 函数/类/变量 定义之前使用它们
		'prefer-const': 'off', // 此规则旨在标记使用 let 关键字声明但在初始分配后从未重新分配的变量，要求使用 const
		'no-irregular-whitespace': 'off', // 禁止不规则的空白
		eqeqeq: 'error', // 全等于校验
		camelcase: 'error', // 强制使用驼峰拼写法命名约定
		'no-duplicate-imports': 'error', //禁止重复引入
		'no-undef': 'off',
		'no-unused-vars': 'off',
		// typeScript (https://typescript-eslint.io/rules)
		// '@typescript-eslint/no-unused-vars': 'warn', // 禁止定义未使用的变量
		'@typescript-eslint/no-inferrable-types': 'off', // 可以轻松推断的显式类型可能会增加不必要的冗长
		'@typescript-eslint/no-namespace': 'off', // 禁止使用自定义 TypeScript 模块和命名空间。
		'@typescript-eslint/no-explicit-any': 'off', // 禁止使用 any 类型
		'@typescript-eslint/ban-ts-ignore': 'off', // 禁止使用 @ts-ignore
		'@typescript-eslint/ban-types': 'off', // 禁止使用特定类型
		'@typescript-eslint/explicit-function-return-type': 'off', // 不允许对初始化为数字、字符串或布尔值的变量或参数进行显式类型声明
		'@typescript-eslint/no-var-requires': 'off', // 不允许在 import 语句中使用 require 语句
		'@typescript-eslint/no-empty-function': 'off', // 禁止空函数
		'@typescript-eslint/no-use-before-define': 'off', // 禁止在变量定义之前使用它们
		'@typescript-eslint/ban-ts-comment': 'off', // 禁止 @ts-<directive> 使用注释或要求在指令后进行描述
		'@typescript-eslint/no-non-null-assertion': 'off', // 不允许使用后缀运算符的非空断言(!)
		'@typescript-eslint/explicit-module-boundary-types': 'off', // 要求导出函数和类的公共类方法的显式返回和参数类型
		'@typescript-eslint/consistent-type-imports': 'error', // 使用 import type 语法来导入类型
		'no-extra-semi': 'off', // 忽略分号检查
		// vue (https://eslint.vuejs.org/rules/)
		'vue/html-closing-bracket-newline': 'off', //html标签闭合
		'vue/html-indent': 'off', //缩进规范
		'vue/singleline-html-element-content-newline': 'off', // 强制单行元素的内容在换行符之后
		'vue/no-deprecated-model-definition': [
			'error',
			{
				allowVue3Compat: true
			}
		],
		'vue/custom-event-name-casing': ['error', 'camelCase'], // emit事件名称规范
		'vue/component-options-name-casing': ['error', 'PascalCase'],
		//组建名称规范
		'vue/component-name-in-template-casing': [
			'error',
			'PascalCase',
			{
				registeredComponentsOnly: true,
				ignores: []
			}
		],
		'vue/this-in-template': 'error', //模板中禁止使用this
		//自闭合标签 />
		'vue/html-self-closing': [
			'error',
			{
				html: {
					void: 'always',
					normal: 'always',
					component: 'always'
				},
				svg: 'always',
				math: 'always'
			}
		],
		'vue/v-on-event-hyphenation': ['error', 'never'], //v-on事件名称
		'vue/multi-word-component-names': 'off', //于检测当前的组件名称是否使用驼峰或多单词命名
		'vue/no-deprecated-slot-attribute': 'error', //不推荐使用插槽attribute
		'vue/no-deprecated-router-link-tag-prop': [
			'error',
			{
				components: ['RouterLink']
			}
		],
		// Vue组件排序
		'vue/component-tags-order': [
			'error',
			{
				order: ['script', 'template', 'style']
			}
		],
		// Vue属性排序
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
				alphabetical: false
			}
		],
		// "script-setup", "composition", "composition-vue2", or "options"
		'vue/component-api-style': ['error', ['script-setup']],

		// 函数声明只允许 function声明
		'func-style': [
			'error',
			'declaration',
			{
				allowArrowFunctions: false // 不允许箭头函数
			}
		],

		// 对象多个属性换行
		'object-property-newline': ['error', { allowAllPropertiesOnSameLine: false }],
		'object-curly-newline': [
			'error',
			{
				consistent: true,
				multiline: true
			}
		]
	}
}
