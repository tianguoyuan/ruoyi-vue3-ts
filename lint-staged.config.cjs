module.exports = {
	'*.{js,ts}': ['eslint --fix', 'prettier --write'],
	'*.{cjs,json}': ['prettier --write'],
	'*.{vue,html}': ['eslint --fix', 'prettier --write', 'stylelint --fix'],
	'*.{scss,css}': ['stylelint --fix', 'prettier --write'],
	'*.md': ['prettier --write']
}
