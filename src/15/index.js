import { readFile } from '_utils/file'

import { hashAlgorithm } from './hash-algorithm'
import { LensBoxes } from './lens-boxes'

const findSumOfHashResultsForSequence = (sequence) => {
  let sumOfHashResults = 0

  for (const charSequence of sequence) {
    let currentValue = 0

    for (const character of charSequence.split('')) {
      currentValue = hashAlgorithm({ character, currentValue })
    }

    sumOfHashResults += currentValue
  }

  return sumOfHashResults
}

const solve = (data) => {
  const initSequence = data.substring(0, data.length - 1).split(',')

  const sumOfHashResults = findSumOfHashResultsForSequence(initSequence)

  console.log('> result 1:', sumOfHashResults)

  const lensBoxes = LensBoxes()

  for (const operation of initSequence) {
    lensBoxes.executeOperation({ operation })
  }

  const focusPower = lensBoxes.evaluateFocusPower()

  console.log('> result 2:', focusPower)
}

export default function () {
  console.log('--- Day 15: Lens Library ---')

  const data = readFile('15/input.in')

  return solve(data)
}
