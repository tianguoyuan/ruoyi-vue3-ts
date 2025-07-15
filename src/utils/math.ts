import * as math from 'mathjs'
/**加 */
export const add = (x: number, y: number) => {
	return Number(math.format(math.add(math.bignumber(x), math.bignumber(y))))
}
/**减 */
export const subtract = (x: number, y: number) => {
	return Number(math.format(math.subtract(math.bignumber(x), math.bignumber(y))))
}
/**乘 */
export const multiply = (x: number, y: number) => {
	return Number(math.format(math.multiply(math.bignumber(x), math.bignumber(y))))
}
/**除 */
export const divide = (x: number, y: number) => {
	return Number(math.format(math.divide(math.bignumber(x), math.bignumber(y))))
}
