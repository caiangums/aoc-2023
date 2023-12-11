import { readFile } from '_utils/file'
import { Square } from '_utils/square'

const ELEMENTS = {
  EMPTY_SPACE: '.',
  VORTEX: '0', // it is also empty space!
  GALAXY: '#',
}

const PART_1_VORTEX_SIZE = 2
const PART_2_VORTEX_SIZE = 1000000

const getCosmicDistanceBetween = ({ galaxyA, galaxyB }) =>
  Math.abs(galaxyB[0] - galaxyA[0]) + Math.abs(galaxyB[1] - galaxyA[1])

const EMPTY_AND_VORTEX_SPACE = [ELEMENTS.EMPTY_SPACE, ELEMENTS.VORTEX]
const expandSpaceWithVortex = (data) => {
  const { getSquare } = Square({ data })

  const originalSpace = getSquare()

  // expand lines
  const expandedLines = []
  const expandedEmptySpaceLine = originalSpace[0].map(() => ELEMENTS.VORTEX)
  for (const line of originalSpace) {
    if (!line.includes(ELEMENTS.GALAXY)) {
      expandedLines.push(expandedEmptySpaceLine)
      continue
    }
    expandedLines.push(line)
  }

  // expand columns
  const expandedCols = [...expandedLines.map(() => [])]
  const firstLine = expandedLines[0]
  for (let i = 0; i < firstLine.length; i++) {
    let shouldExpand = true
    for (let j = 0; j < expandedLines.length; j++) {
      const actualItem = expandedLines[j][i]
      shouldExpand = shouldExpand && EMPTY_AND_VORTEX_SPACE.includes(actualItem)

      expandedCols[j].push(actualItem)
    }

    if (shouldExpand) {
      for (let j = 0; j < expandedLines.length; j++) {
        expandedCols[j][i] = ELEMENTS.VORTEX
      }
    }
  }

  // we need to add the final \n as the Square() Module depends on it!
  return `${expandedCols.map((line) => line.join('')).join('\n')}\n`
}

const galaxiesListWithVortex = []
const buildCosmicEntityWithVortex = ({ item, coordinates }) => {
  if (item === ELEMENTS.GALAXY) {
    galaxiesListWithVortex.push(coordinates)
  }

  return item
}

const countVortexesBetween = ({ space, galaxyA, galaxyB }) => {
  const [xA, yA] = galaxyA
  const [xB, yB] = galaxyB

  const [xStart, xEnd] = xA > xB ? [xB, xA] : [xA, xB]
  const [yStart, yEnd] = yA > yB ? [yB, yA] : [yA, yB]

  const spaceSquare = space.getSquare()

  let vortexes = 0
  for (let i = xStart; i <= xEnd; i++) {
    vortexes += spaceSquare[i][yStart] === ELEMENTS.VORTEX ? 1 : 0
  }
  for (let i = yStart; i <= yEnd; i++) {
    vortexes += spaceSquare[xStart][i] === ELEMENTS.VORTEX ? 1 : 0
  }

  return vortexes
}

const getCosmicDistanceBetweenWithVortex = ({
  space,
  galaxyA,
  galaxyB,
  vortexSize,
}) => {
  const distance = getCosmicDistanceBetween({ galaxyA, galaxyB })

  const vortexes = countVortexesBetween({ space, galaxyA, galaxyB })

  const distanceWithoutVortexes = distance - vortexes
  const vortexesDistance = vortexes * vortexSize

  return distanceWithoutVortexes + vortexesDistance
}

const solve = (data) => {
  const expandedSpaceWithVortexData = expandSpaceWithVortex(data)

  const spaceWithVortex = Square({
    data: expandedSpaceWithVortexData,
    itemCallbackFn: buildCosmicEntityWithVortex,
  })

  let sumOfShortestPaths = 0
  for (let i = 0; i < galaxiesListWithVortex.length; i++) {
    for (let j = i + 1; j < galaxiesListWithVortex.length; j++) {
      const sumBetween = getCosmicDistanceBetweenWithVortex({
        space: spaceWithVortex,
        galaxyA: galaxiesListWithVortex[i],
        galaxyB: galaxiesListWithVortex[j],
        vortexSize: PART_1_VORTEX_SIZE,
      })

      sumOfShortestPaths += sumBetween
    }
  }

  console.log('> result 1:', sumOfShortestPaths)

  let sumOfShortestPathsWithVortex = 0
  for (let i = 0; i < galaxiesListWithVortex.length; i++) {
    for (let j = i + 1; j < galaxiesListWithVortex.length; j++) {
      const sumBetween = getCosmicDistanceBetweenWithVortex({
        space: spaceWithVortex,
        galaxyA: galaxiesListWithVortex[i],
        galaxyB: galaxiesListWithVortex[j],
        vortexSize: PART_2_VORTEX_SIZE,
      })

      sumOfShortestPathsWithVortex += sumBetween
    }
  }

  console.log('> result 2:', sumOfShortestPathsWithVortex)
}

export default function () {
  console.log('--- Day 11: Cosmic Expansion ---')

  const data = readFile('11/input.in')

  return solve(data)
}
