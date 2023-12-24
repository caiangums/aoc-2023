import { readFile } from '_utils/file'
import { Square } from '_utils/square'

const FOREST = '#'
const PATH = '.'

const NODES = []
let STARTING_NODE = null
let GOAL_NODE = null

const isValidTrailPositionOfSquare = (square) => (point) => {
  const [i, j] = point

  return square[i][j] !== FOREST
}

const getTrailAdjascentValidPoints = (trailsModule) => {
  const trailsSquare = trailsModule.getSquare()
  const isValidTrailPosition = isValidTrailPositionOfSquare(trailsSquare)

  return (point) => {
    const adjascentPoints = trailsModule.getLineAndColumnAdjascentPoints(point)

    return adjascentPoints.filter((p) => isValidTrailPosition(p))
  }
}

const itemCallbackFn = ({ item, coordinates }) => {
  if (item !== FOREST) {
    NODES.push(coordinates)
  }

  return item
}

const fillStartingAndFinalNodes = (trailsModule) => {
  const trailsSquare = trailsModule.getSquare()

  const startingCol = trailsSquare[0].findIndex((el) => el === PATH)
  STARTING_NODE = [0, startingCol]

  const goalCol = trailsSquare[trailsSquare.length - 1].findIndex(
    (el) => el === PATH
  )

  GOAL_NODE = [trailsSquare.length - 1, goalCol]
}

const POINTS_OF_INTEREST = []
const name = (point) => point.join(',')

const dirs = {
  '^': [[-1, 0]],
  v: [[1, 0]],
  '>': [[0, 1]],
  '<': [[0, -1]],
  '.': [
    [-1, 0],
    [1, 0],
    [0, 1],
    [0, -1],
  ],
}

const GRAPH = {}

// Depth-first search
const dfs = (point) => {
  if (point[0] === GOAL_NODE[0] && point[1] === GOAL_NODE[1]) {
    return 0
  }

  // max = negative infinite = no path found
  let max = Number.MIN_SAFE_INTEGER

  for (const node of Object.keys(GRAPH[name(point)])) {
    const [i, j] = node.split(',').map((v) => Number(v))
    max = Math.max(max, dfs([i, j]) + GRAPH[name(point)][node])
  }

  return max
}

const solve = (data) => {
  const trails = Square({
    data,
    itemCallbackFn,
  })

  fillStartingAndFinalNodes(trails)
  POINTS_OF_INTEREST.push(STARTING_NODE, GOAL_NODE)

  const getAdjscentValidPoints = getTrailAdjascentValidPoints(trails)

  const trailsSquare = trails.getSquare()

  for (const node of NODES) {
    const adjascentNodes = getAdjscentValidPoints(node)
    const neighbors = adjascentNodes.length

    if (neighbors >= 3) {
      POINTS_OF_INTEREST.push(node)
    }
  }

  for (const point of POINTS_OF_INTEREST) {
    GRAPH[name(point)] = {}
  }

  for (const point of POINTS_OF_INTEREST) {
    const stack = [{ distance: 0, point }]
    const localSeen = new Set()
    localSeen.add(name(point))

    while (stack.length > 0) {
      const { distance, point: actualPoint } = stack.pop()
      const [i, j] = actualPoint

      if (
        distance !== 0 &&
        POINTS_OF_INTEREST.find(
          (p) => p[0] === actualPoint[0] && p[1] === actualPoint[1]
        )
      ) {
        GRAPH[name(point)][name(actualPoint)] = distance
        continue
      }

      const possibleNextPositions = dirs[trailsSquare[i][j]]
      for (const pos of possibleNextPositions) {
        const [a, b] = pos
        const ni = i + a
        const nj = j + b
        if (
          ni >= 0 &&
          ni < trailsSquare.length &&
          nj >= 0 &&
          nj < trailsSquare[0].length &&
          trailsSquare[ni][nj] !== FOREST &&
          !localSeen.has(name([ni, nj]))
        ) {
          stack.push({ distance: distance + 1, point: [ni, nj] })
          localSeen.add(name([ni, nj]))
        }
      }
    }
  }

  const result = dfs(STARTING_NODE)

  console.log('> result 1:', result)
}

export default function () {
  console.log('--- Day 23: A Long Walk ---')

  const data = readFile('23/input.in')

  return solve(data)
}
