import SvgIcon from '@/components/SvgIcon/index.vue'
interface IProps {
	icon?: string
	title?: string
}

function MenuItem(props: IProps) {
	const { icon, title } = props
	const vnodes: JSX.Element[] = []

	if (icon) {
		vnodes.push(<SvgIcon iconClass={icon} />)
	}

	if (title) {
		vnodes.push(<span>{title}</span>)
	}
	return vnodes
}

export default MenuItem
