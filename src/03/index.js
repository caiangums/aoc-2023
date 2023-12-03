import { readFile } from '_utils/file'

const DOT = '.'
let ROW_SIZE = -1
let COL_SIZE = -1

// Returns those points based on point x(i,j):
//
//    [.] [.] [.]
//    [.] [x] [.]
//    [.] [.] [.]
//
// Also, check for out of bounds points
const getAdjascentPoints = (point) => {
  const [i, j] = point
  const allPossibleAdjascentPoints = [
    [i - 1, j - 1],
    [i - 1, j],
    [i - 1, j + 1],
    [i, j - 1],
    [i, j + 1],
    [i + 1, j - 1],
    [i + 1, j],
    [i + 1, j + 1],
  ]

  const adjascentPoints = []

  for (const adjascentPoint of allPossibleAdjascentPoints) {
    const [x, y] = adjascentPoint
    if (x >= 0 && x < ROW_SIZE && y >= 0 && y < COL_SIZE) {
      adjascentPoints.push(adjascentPoint)
    }
  }

  return adjascentPoints
}

const hasAdjascentSymbols = ({ lines, point }) => {
  const adjascentPoints = getAdjascentPoints(point)

  for (const adjascentPoint of adjascentPoints) {
    const [i, j] = adjascentPoint
    if (!/(\d|\.)/.test(lines[i][j])) {
      return true
    }
  }

  return false
}

const hasAdjascentGear = ({ lines, point }) => {
  const adjascentPoints = getAdjascentPoints(point)

  for (const adjascentPoint of adjascentPoints) {
    const [i, j] = adjascentPoint
    if (/(\*)/.test(lines[i][j])) {
      return adjascentPoint
    }
  }

  return null
}

const isNumber = (value) => !isNaN(Number(value))

const findTotalSum = (lines) => {
  let totalSum = 0

  for (let i = 0; i < COL_SIZE; i++) {
    const line = lines[i]
    let shouldSum = false
    let actualValue = 0

    for (let j = 0; j < ROW_SIZE; j++) {
      const lineItem = line[j]

      if (lineItem !== DOT && isNumber(lineItem)) {
        actualValue = Number(`${actualValue}${lineItem}`)
        shouldSum = shouldSum || hasAdjascentSymbols({ lines, point: [i, j] })
        continue
      }

      if (shouldSum) {
        totalSum += Number(actualValue)
      }
      shouldSum = false
      actualValue = 0
    }

    if (actualValue > 0 && shouldSum) {
      totalSum += Number(actualValue)
    }
  }

  return totalSum
}

const addGearPointToGears = ({ gears, gearPoint, value }) => {
  const [x, y] = gearPoint
  const label = `gear[${x}${y}]`

  const values = gears.has(label) ? [...gears.get(label), value] : [value]

  gears.set(label, values)
}

const populateGearsMap = (lines) => {
  const gears = new Map()

  for (let i = 0; i < COL_SIZE; i++) {
    const line = lines[i]
    let gearPoint = []
    let actualValue = 0

    for (let j = 0; j < ROW_SIZE; j++) {
      const lineItem = line[j]

      if (lineItem !== DOT && isNumber(lineItem)) {
        actualValue = Number(`${actualValue}${lineItem}`)
        gearPoint = hasAdjascentGear({ lines, point: [i, j] }) ?? gearPoint
        continue
      }

      if (actualValue > 0 && gearPoint.length > 0) {
        addGearPointToGears({ gears, gearPoint, value: actualValue })
      }

      gearPoint = []
      actualValue = 0
    }

    if (actualValue > 0 && gearPoint.length > 0) {
      addGearPointToGears({ gears, gearPoint, value: actualValue })
    }
  }

  return gears
}

const findGearRatio = (lines) => {
  const gears = populateGearsMap(lines)

  let gearRatio = 0

  for (const values of gears.values()) {
    if (values.length === 2) {
      const [v1, v2] = values
      gearRatio += v1 * v2
    }
  }

  return gearRatio
}

const solve = (data) => {
  const lines = data
    .split('\n')
    .slice(0, -1)
    .map((line) => line.split(''))

  ROW_SIZE = lines.length
  COL_SIZE = lines[0].length

  const totalSum = findTotalSum(lines)

  console.log('> result 1:', totalSum)

  const gearRatio = findGearRatio(lines)

  console.log('> result 2:', gearRatio)
}

export default function () {
  console.log('--- Day 03: Gear Ratios ---')

  const data = readFile('03/input.in')

  return solve(data)
}
