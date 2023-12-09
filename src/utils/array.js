import { leastCommonMultiple } from './number'

export const leastCommonMultipleBetweenList = (list) =>
  list.reduce((acc, el) => leastCommonMultiple(acc, el), 1)

export const sumListElements = (list) => list.reduce((acc, el) => acc + el, 0)
