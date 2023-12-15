import { readFile } from '_utils/file'
import { Square } from '_utils/square'

const TILES = {
  ROUND_ROCKS: 'O',
  CUBE_ROCKS: '#',
  EMPTY_SPACE: '.',
}

const MAX_CYCLES = 1000000000

const ALL_ROCKS = []

const buildRocksMapCallbackFn = ({ item, coordinates }) => {
  if (item !== TILES.EMPTY_SPACE) {
    ALL_ROCKS.push({ item, coordinates })
  }

  return item
}

const HORIZONTAL = {
  WEST: 'west',
  EAST: 'east',
}

const sortHorizontalRocksAscendant = (rockA, rockB) =>
  rockA.coordinates[1] - rockB.coordinates[1]
const sortHorizontalRocksDescendant = (rockA, rockB) =>
  rockB.coordinates[1] - rockA.coordinates[1]

const getTiltStateHorizontal = ({ direction, maxLimits }) => {
  const [maxRow] = maxLimits
  // west
  let startingOffset = 0
  let sortCallback = sortHorizontalRocksAscendant
  let updateOffset = (offset) => offset + 1

  // east
  if (direction === HORIZONTAL.EAST) {
    startingOffset = maxRow - 1
    sortCallback = sortHorizontalRocksDescendant
    updateOffset = (offset) => offset - 1
  }

  return { startingOffset, sortCallback, updateOffset }
}

const tiltHorizontal = ({ allRocksList, maxLimits, direction }) => {
  const [maxRow] = maxLimits

  const { startingOffset, sortCallback, updateOffset } = getTiltStateHorizontal(
    {
      direction,
      maxLimits,
    }
  )

  const updatedRocksList = []
  for (let i = 0; i < maxRow; i++) {
    const localRocks = allRocksList
      .filter((rockItem) => rockItem.coordinates[0] === i)
      .sort(sortCallback)

    if (localRocks.length === 0) {
      continue
    }

    let offset = startingOffset
    for (const rock of localRocks) {
      const { item, coordinates } = rock

      if (item === TILES.CUBE_ROCKS) {
        offset = coordinates[1]
      }
      updatedRocksList.push({ item, coordinates: [i, offset] })

      offset = updateOffset(offset)
    }
  }

  return updatedRocksList
}

const getNorthLoadFromRocks = ({ rocks, maxValue }) => {
  let northLoad = 0
  for (let i = 0; i < maxValue; i++) {
    const sortedColumnRocks = rocks
      .filter((rockItem) => rockItem.coordinates[1] === i)
      .sort((rockA, rockB) => rockA.coordinates[0] - rockB.coordinates[0])

    if (sortedColumnRocks.length === 0) {
      continue
    }

    for (const rock of sortedColumnRocks) {
      const { item, coordinates } = rock

      if (item === TILES.ROUND_ROCKS) {
        northLoad += maxValue - coordinates[0]
      }
    }
  }

  return northLoad
}

const VERTICAL = {
  NORTH: 'north',
  SOUTH: 'south',
}

const sortVerticalRocksAscendant = (rockA, rockB) =>
  rockA.coordinates[0] - rockB.coordinates[0]
const sortVerticalRocksDescendant = (rockA, rockB) =>
  rockB.coordinates[0] - rockA.coordinates[0]

const getTiltStateVertical = ({ direction, maxLimits }) => {
  const [maxRow] = maxLimits
  // north
  let startingOffset = 0
  let sortCallback = sortVerticalRocksAscendant
  let updateOffset = (offset) => offset + 1

  // south
  if (direction === VERTICAL.SOUTH) {
    startingOffset = maxRow - 1
    sortCallback = sortVerticalRocksDescendant
    updateOffset = (offset) => offset - 1
  }

  return { startingOffset, sortCallback, updateOffset }
}

const tiltVertical = ({ allRocksList, maxLimits, direction }) => {
  const [maxCol] = maxLimits

  const { startingOffset, sortCallback, updateOffset } = getTiltStateVertical({
    direction,
    maxLimits,
  })

  const updatedRocksList = []
  for (let i = 0; i < maxCol; i++) {
    const localRocks = allRocksList
      .filter((rockItem) => rockItem.coordinates[1] === i)
      .sort(sortCallback)

    if (localRocks.length === 0) {
      continue
    }

    let offset = startingOffset
    for (const rock of localRocks) {
      const { item, coordinates } = rock

      if (item === TILES.CUBE_ROCKS) {
        offset = coordinates[0]
      }
      updatedRocksList.push({ item, coordinates: [offset, i] })

      offset = updateOffset(offset)
    }
  }

  return updatedRocksList
}

const getRocksMap = ({ rocks, maxLimits = [10, 10] }) => {
  let text = ''
  for (let i = 0; i < maxLimits[0]; i++) {
    for (let j = 0; j < maxLimits[1]; j++) {
      const itemRock = rocks.find(
        (rock) => rock.coordinates[0] === i && rock.coordinates[1] === j
      )
      text += itemRock?.item ?? '.'
    }

    text += '\n'
  }

  return text
}

const solve = (data) => {
  const platform = Square({
    data,
    itemCallbackFn: buildRocksMapCallbackFn,
  })

  const [maxRow, maxCol] = platform.getMaxLimits()

  const tiltedRocks = tiltVertical({
    allRocksList: ALL_ROCKS,
    maxLimits: [maxRow, maxCol],
    direction: VERTICAL.NORTH,
  })

  const platformLoad = getNorthLoadFromRocks({
    rocks: tiltedRocks,
    maxValue: maxRow,
  })

  console.log('> result 1:', platformLoad)

  // platform spins
  let northLoadAfterCycles = 0
  let prevRocks = ALL_ROCKS
  const resultsMap = new Map()
  let cycleSize = 0
  let startCycleAt = 0
  let startCycleItemKey = ''
  for (let i = 0; i < MAX_CYCLES; i++) {
    const prevState = getRocksMap({
      rocks: prevRocks,
      maxLimits: [maxRow, maxCol],
    })
    // in case we already passed over this state
    if (resultsMap.has(prevState)) {
      if (startCycleAt > 0 && startCycleItemKey === prevState) {
        cycleSize = i - startCycleAt
        break
      }

      if (startCycleAt === 0) {
        startCycleAt = i
        startCycleItemKey = prevState
      }

      const { nextRocksState, northLoadValue } = resultsMap.get(prevState)

      prevRocks = nextRocksState
      northLoadAfterCycles = northLoadValue
      continue
    }

    const northTiltRocks = tiltVertical({
      allRocksList: prevRocks,
      maxLimits: [maxRow, maxCol],
      direction: VERTICAL.NORTH,
    })

    const westTiltRocks = tiltHorizontal({
      allRocksList: northTiltRocks,
      maxLimits: [maxRow, maxCol],
      direction: HORIZONTAL.WEST,
    })

    const southTiltRocks = tiltVertical({
      allRocksList: westTiltRocks,
      maxLimits: [maxRow, maxCol],
      direction: VERTICAL.SOUTH,
    })

    const eastTiltRocks = tiltHorizontal({
      allRocksList: southTiltRocks,
      maxLimits: [maxRow, maxCol],
      direction: HORIZONTAL.EAST,
    })

    const actualItemLoadsValue = getNorthLoadFromRocks({
      rocks: eastTiltRocks,
      maxValue: maxRow,
    })
    northLoadAfterCycles = actualItemLoadsValue

    if (!resultsMap.has(prevState)) {
      resultsMap.set(prevState, {
        nextRocksState: eastTiltRocks,
        northLoadValue: actualItemLoadsValue,
      })
    }

    prevRocks = eastTiltRocks
  }

  if (cycleSize > 0) {
    const leftIterations = MAX_CYCLES - startCycleAt
    const totalFullIterations = Math.floor(leftIterations / cycleSize)
    const stopItem = leftIterations - totalFullIterations * cycleSize - 1

    let itemKey = startCycleItemKey
    const { nextRocksState, northLoadValue } = resultsMap.get(itemKey)

    let prevRocks = nextRocksState
    let loadValue = northLoadValue
    for (let i = 0; i < stopItem; i++) {
      const prevState = getRocksMap({
        rocks: prevRocks,
        maxLimits: [maxRow, maxCol],
      })
      const { nextRocksState, northLoadValue } = resultsMap.get(prevState)

      prevRocks = nextRocksState
      loadValue = northLoadValue
    }

    northLoadAfterCycles = loadValue
  }

  console.log('> result 2:', northLoadAfterCycles)
}

export default function () {
  console.log('--- Day 14: Parabolic Reflector Dish ---')

  const data = readFile('14/input.in')

  return solve(data)
}
