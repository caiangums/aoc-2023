import { readFile } from '_utils/file'

const SPELLED_NUMBER_SUBSTITUTION = {
  one: 'o1e',
  two: 't2o',
  three: 't3e',
  four: 'f4r',
  five: 'f5e',
  six: 's6x',
  seven: 's7n',
  eight: 'e8t',
  nine: 'n9e',
}

const spelledNumberRegex = /(one|two|three|four|five|six|seven|eight|nine)/g

const parseSpelledNumbers = (data) => {
  const parsedData = data.replace(
    spelledNumberRegex,
    (match) => SPELLED_NUMBER_SUBSTITUTION[match]
  )

  if (parsedData.search(spelledNumberRegex) >= 0) {
    return parseSpelledNumbers(parsedData)
  }

  return parsedData
}

const getCalibrationSum = (lines) => {
  let calibrationSum = 0

  for (const line of lines) {
    if (!line) continue

    const digits = line.match(/\d/g)

    if (!digits) continue

    const [first, last] = [digits[0], ...digits.slice(-1)]

    const calibrationValue = Number(`${first}${last}`) || 0

    calibrationSum += calibrationValue
  }

  return calibrationSum
}

const solve = (data) => {
  const lines = data.split('\n')

  const calibrationSum = getCalibrationSum(lines)

  console.log('> result 1:', calibrationSum)

  const parsedSpelledNumbersData = parseSpelledNumbers(data)
  const parsedLines = parsedSpelledNumbersData.split('\n')
  const calibrationSumWithSpelledNumbers = getCalibrationSum(parsedLines)

  console.log('> result 2:', calibrationSumWithSpelledNumbers)
}

export default function () {
  console.log('--- Day 01: Trebuchet?! ---')

  const data = readFile('01/input.in')

  return solve(data)
}
