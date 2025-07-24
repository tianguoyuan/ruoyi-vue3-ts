/**
 * 布局大小枚举
 */
// export enum SizeEnum {
// 	/**
// 	 * 大型
// 	 */
// 	LARGE = '较大',
// 	/**
// 	 * 默认
// 	 */
// 	DEFAULT = '默认',

// 	/**
// 	 * 小型
// 	 */
// 	SMALL = '稍小'
// }
export type ISizeEnumType = 'large' | 'default' | 'small'
export const SizeEnum = [
	{
		label: '较大',
		value: 'large'
	},
	{
		label: '默认',
		value: 'default'
	},
	{
		label: '稍小',
		value: 'small'
	}
]
