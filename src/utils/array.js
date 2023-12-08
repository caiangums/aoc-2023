import { leastCommonMultiple } from './number'

export const leastCommonMultipleBetweenList = (list) =>
  list.reduce((acc, el) => leastCommonMultiple(acc, el), 1)
