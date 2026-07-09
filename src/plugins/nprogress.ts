import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

NProgress.configure({
	easing: 'ease', // 动画方式
	minimum: 0.3, // 初始化时的最小百分比
	showSpinner: false, // 是否显示加载ico
	speed: 500, // 递增进度条的速度
	trickleSpeed: 200 // 自动递增间隔
})

export default NProgress
