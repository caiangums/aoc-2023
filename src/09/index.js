import { readFile } from '_utils/file'
import { sumListElements } from '_utils/array'

const findListOfDifferences = (values) => {
  const allDifferences = [values]

  let differences = [...values]
  while (differences.some((v) => v !== 0)) {
    const nextDifferences = []
    for (let i = 0; i < differences.length - 1; i++) {
      const differenceBetweenElements = differences[i + 1] - differences[i]
      nextDifferences.push(differenceBetweenElements)
    }

    differences = nextDifferences

    allDifferences.push(differences)
  }

  return allDifferences
}

const findNextValueBasedOnListOfDifferences = (allDifferences) => {
  const localDifferences = [...allDifferences].reverse()

  let nextValue = 0
  for (const differences of localDifferences) {
    const [lastValue] = differences.slice(-1)
    nextValue += lastValue
  }

  return nextValue
}

const findNextValue = (line) => {
  const values = line.match(/-?\d+/g).map((v) => Number(v))

  const allDifferences = findListOfDifferences(values)

  const nextValue = findNextValueBasedOnListOfDifferences(allDifferences)

  return nextValue
}

const findPreviousValue = (line) => {
  const reversedLine = line.split(' ').reverse().join(' ')

  return findNextValue(reversedLine)
}

const buildListOfNextValues = (lines) => {
  const nextValues = []
  for (const line of lines) {
    const nextValue = findNextValue(line)

    nextValues.push(nextValue)
  }

  return nextValues
}

const buildListOfPreviousValues = (lines) => {
  const previousValues = []
  for (const line of lines) {
    const previousValue = findPreviousValue(line)

    previousValues.push(previousValue)
  }

  return previousValues
}

const solve = (data) => {
  const lines = data.split('\n').slice(0, -1)

  const nextValues = buildListOfNextValues(lines)

  const sumOfNextValues = sumListElements(nextValues)

  console.log('> result 1:', sumOfNextValues)

  const previousValues = buildListOfPreviousValues(lines)

  const sumOfPreviousValues = sumListElements(previousValues)

  console.log('> result 2:', sumOfPreviousValues)
}

export default function () {
  console.log('--- Day 09: Mirage Maintenance ---')

  const data = readFile('09/input.in')

  return solve(data)
}
