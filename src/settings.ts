import { SizeEnum } from '@/enums/SizeEnum'
import { LayoutEnum } from '@/enums/LayoutEnum'
import { ThemeEnum } from '@/enums/ThemeEnum'
import { LanguageEnum } from '@/enums/LanguageEnum'

const { pkg } = __APP_INFO__
console.log('pkg', pkg)

const mediaQueryList = window.matchMedia('(prefers-color-scheme: dark)')

const defaultSettings: AppSettings = {
	title: pkg.name,
	version: pkg.version,
	showSettings: true,
	tagsView: true,
	fixedHeader: true,
	sidebarLogo: true,
	needErrorLog: ['production'],
	watermarkEnabled: false,
	watermarkContent: pkg.name,
	size: SizeEnum.DEFAULT,
	language: LanguageEnum.ZH_CN,

	layout: LayoutEnum.LEFT,
	theme: mediaQueryList.matches ? ThemeEnum.DARK : ThemeEnum.LIGHT,
	themeColor: '#409EFF'
}

export default defaultSettings
