import { LanguageEnum } from '@/enums/LanguageEnum'
import { LayoutEnum } from '@/enums/LayoutEnum'
import { SizeEnum } from '@/enums/SizeEnum'
import { ThemeEnum } from '@/enums/ThemeEnum'

const { pkg } = __APP_INFO__
console.log('pkg', pkg)

const mediaQueryList = window.matchMedia('(prefers-color-scheme: dark)')

const defaultSettings: AppSettings = {
	fixedHeader: true,
	language: LanguageEnum.ZH_CN,
	layout: LayoutEnum.LEFT,
	needErrorLog: ['production'],
	showSettings: false,
	sidebarLogo: true,
	size: 'default',
	tagsView: true,
	theme: mediaQueryList.matches ? ThemeEnum.DARK : ThemeEnum.LIGHT,
	themeColor: '#409EFF',
	title: pkg.name,

	version: pkg.version,
	watermarkContent: pkg.name,
	watermarkEnabled: false
}

export default defaultSettings
