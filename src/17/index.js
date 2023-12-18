import { readFile } from '_utils/file'
import { Square } from '_utils/square'

let CITIES = null

let END_CITY = [] // [MAX_ROW, MAX_COL]
// defined by the challenge
const MAX_MOVES_SAME_DIRECTION_PART_1 = 3
const MAX_MOVES_SAME_DIRECTION_PART_2 = 10
const MIN_MOVES_BEFORE_TURN_PART_1 = 0
const MIN_MOVES_BEFORE_TURN_PART_2 = 4
const MIN_MOVES_BEFORE_STOP_PART_1 = 0
const MIN_MOVES_BEFORE_STOP_PART_2 = 4

const buildCityItemsCallbackFn = ({ item, coordinates }) => Number(item)

const reachedDestination = (coordinates) =>
  coordinates[0] === END_CITY[0] - 1 && coordinates[1] === END_CITY[1] - 1

const isValidMove = (coordinates) =>
  coordinates[0] >= 0 &&
  coordinates[0] < END_CITY[0] &&
  coordinates[1] >= 0 &&
  coordinates[1] < END_CITY[1]

const NEXT_DIRECTIONS = [
  [0, 1],
  [0, -1],
  [1, 0],
  [-1, 0],
]

const isMoving = ([di, dj]) => di !== 0 || dj !== 0

const findTotalHeatLoss = ({
  maxMovesSameDirection = MAX_MOVES_SAME_DIRECTION_PART_1,
  minMovesBeforeTurn = MIN_MOVES_BEFORE_TURN_PART_1,
  minMovesBeforeStop = MIN_MOVES_BEFORE_STOP_PART_1,
}) => {
  const seen = new Set()

  // i, j = coordinates of the current node
  // heatLoss = current heat loss
  // di, dj = new direction to move
  // dn = number of times it went in that direction
  const nodeQueue = [{ heatLoss: 0, i: 0, j: 0, di: 0, dj: 0, dn: 0 }]
  let totalHeatLoss = 0

  while (nodeQueue.length > 0) {
    const { heatLoss, i, j, di, dj, dn } = nodeQueue.pop()

    if (reachedDestination([i, j]) && dn >= minMovesBeforeStop) {
      totalHeatLoss = heatLoss
      break
    }

    if (seen.has(`${i},${j},${di},${dj},${dn}`)) {
      continue
    }
    seen.add(`${i},${j},${di},${dj},${dn}`)

    if (dn < maxMovesSameDirection && isMoving([di, dj])) {
      const nextI = i + di
      const nextJ = j + dj

      if (isValidMove([nextI, nextJ])) {
        const increasedHeatLoss = heatLoss + CITIES[nextI][nextJ]

        nodeQueue.push({
          heatLoss: increasedHeatLoss,
          i: nextI,
          j: nextJ,
          di,
          dj,
          dn: dn + 1,
        })
      }
    }

    if (dn >= minMovesBeforeTurn || !isMoving([di, dj])) {
      for (const turnDirection of NEXT_DIRECTIONS) {
        const [nextDI, nextDJ] = turnDirection

        if (
          (nextDI !== di || nextDJ !== dj) &&
          (nextDI !== -di || nextDJ !== -dj)
        ) {
          const nextI = i + nextDI
          const nextJ = j + nextDJ

          if (isValidMove([nextI, nextJ])) {
            const increasedHeatLoss = heatLoss + CITIES[nextI][nextJ]

            nodeQueue.push({
              heatLoss: increasedHeatLoss,
              i: nextI,
              j: nextJ,
              di: nextDI,
              dj: nextDJ,
              dn: 1,
            })
          }
        }
      }
    }

    // we need to sort to always get the lowest `heatLoss`
    nodeQueue.sort((a, b) => b.heatLoss - a.heatLoss)
  }

  return totalHeatLoss
}

const solve = (data) => {
  const cityBlocks = Square({ data, itemCallbackFn: buildCityItemsCallbackFn })

  END_CITY = cityBlocks.getMaxLimits()
  CITIES = cityBlocks.getSquare()

  let totalHeatLoss = findTotalHeatLoss({
    maxMovesSameDirection: MAX_MOVES_SAME_DIRECTION_PART_1,
  })

  console.log('> result 1:', totalHeatLoss)

  totalHeatLoss = findTotalHeatLoss({
    maxMovesSameDirection: MAX_MOVES_SAME_DIRECTION_PART_2,
    minMovesBeforeTurn: MIN_MOVES_BEFORE_TURN_PART_2,
    minMovesBeforeStop: MIN_MOVES_BEFORE_STOP_PART_2,
  })

  console.log('> result 2:', totalHeatLoss)
}

export default function () {
  console.log('--- Day 17: Clumsy Crucible ---')

  const data = readFile('17/input.in')

  return solve(data)
}
