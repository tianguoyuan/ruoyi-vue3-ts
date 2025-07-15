import { presetUno, defineConfig, presetIcons, transformerVariantGroup, transformerDirectives } from 'unocss'
import presetRemToPx from '@unocss/preset-rem-to-px'

export default defineConfig({
	presets: [
		presetUno(), // 添加 UnoCSS 的默认样式预设
		presetRemToPx(), // 转px
		presetIcons({
			scale: 1.2,
			warn: true,
			extraProperties: {
				display: 'inline-block',
				'vertical-align': 'middle'
			}
		})
	],
	transformers: [transformerVariantGroup(), transformerDirectives()]
})
