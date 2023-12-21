import { readFile } from '_utils/file'
import { Square } from '_utils/square'

const STARTING_POSITION = 'S'
const GARDEN_PLOT = '.'
const ROCK = '#'

let STARTING_POINT = null

const STARTING_STEPS_PART_1 = 64
const STARTING_STEPS_PART_2 = 26501365

const customItemCallbackFn = ({ item, coordinates }) => {
  if (item === STARTING_POSITION) {
    STARTING_POINT = coordinates
  }

  return item
}

const isValidPositionOfSquare = (square) => (point) => {
  const [i, j] = point

  return square[i][j] !== ROCK
}

const getAdjascentPointsOfSquareWithOutOfBounds = (squareModule) => (point) =>
  squareModule.getLineAndColumnAdjascentPoints(point, {
    clearOutOfBounds: false,
  })

const getInboundValueOfSquare = (squareModule) => {
  const [MAX_I, MAX_J] = squareModule.getMaxLimits()

  return (point) => {
    const [a, b] = [point[0] % MAX_I, point[1] % MAX_J]

    return [(a + MAX_I) % MAX_I, (b + MAX_J) % MAX_J]
  }
}

const solve = (data) => {
  const gardenPlots = Square({ data, itemCallbackFn: customItemCallbackFn })

  const gardenPlotsSquare = gardenPlots.getSquare()

  const isValidPosition = isValidPositionOfSquare(gardenPlotsSquare)

  let count = STARTING_STEPS_PART_1
  let possiblePositions = [STARTING_POINT]

  while (count !== 0) {
    let nextPossibleSteps = []

    for (const possiblePosition of possiblePositions) {
      const adjascentPoints =
        gardenPlots.getLineAndColumnAdjascentPoints(possiblePosition)

      adjascentPoints.forEach((point) => {
        const pointStr = point.join(',')
        if (isValidPosition(point) && !nextPossibleSteps.includes(pointStr)) {
          nextPossibleSteps.push(pointStr)
        }
      })
    }

    possiblePositions = nextPossibleSteps.map((point) => {
      const [i, j] = point.split(',')
      return [Number(i), Number(j)]
    })
    count -= 1
  }

  let possibleGardenPlotsCount = possiblePositions.length

  console.log('> result 1:', possibleGardenPlotsCount)

  const getAdjascentPointsWithOutOfBounds =
    getAdjascentPointsOfSquareWithOutOfBounds(gardenPlots)

  count = 0 // STARTING_STEPS_PART_2
  possiblePositions = [STARTING_POINT]
  const getInboundValue = getInboundValueOfSquare(gardenPlots)

  while (count !== 0) {
    let nextPossibleSteps = []

    for (const possiblePosition of possiblePositions) {
      const adjascentPoints =
        getAdjascentPointsWithOutOfBounds(possiblePosition)

      adjascentPoints.forEach((point) => {
        const pointMod = getInboundValue(point)
        const pointStr = point.join(',')
        if (
          isValidPosition(pointMod) &&
          !nextPossibleSteps.includes(pointStr)
        ) {
          nextPossibleSteps.push(pointStr)
        }
      })
    }

    possiblePositions = nextPossibleSteps.map((point) => {
      const [i, j] = point.split(',')
      return [Number(i), Number(j)]
    })
    count -= 1
  }

  possibleGardenPlotsCount = possiblePositions.length

  //console.log('> result 2:', possibleGardenPlotsCount)
}

export default function () {
  console.log('--- Day 21: Step Counter ---')

  const data = readFile('21/test.in')

  return solve(data)
}
