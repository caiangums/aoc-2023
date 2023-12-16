import { readFile } from '_utils/file'
import { Square } from '_utils/square'

const ITEM = {
  EMPTY_SPACE: '.',
  MIRROR_LEFT: '/',
  MIRROR_RIGHT: '\\',
  SPLITER_VERTICAL: '|',
  SPLITER_HORIZONTAL: '-',
}

const buildContraptionItemsCallbackFn = ({ item, coordinates }) => {
  const contraptionItem = {
    energized: false,
    reflected: false,
    coordinates,
    item,
  }

  return contraptionItem
}

const SOURCE_LIGHT = {
  UP: { label: 'up', coordinates: [-1, 0] },
  DOWN: { label: 'down', coordinates: [1, 0] },
  RIGHT: { label: 'right', coordinates: [0, 1] },
  LEFT: { label: 'left', coordinates: [0, -1] },
}

const MIRROR_NEXT_DIRECTIONS = {
  [ITEM.MIRROR_LEFT]: {
    [SOURCE_LIGHT.UP.label]: [SOURCE_LIGHT.RIGHT],
    [SOURCE_LIGHT.RIGHT.label]: [SOURCE_LIGHT.UP],
    [SOURCE_LIGHT.DOWN.label]: [SOURCE_LIGHT.LEFT],
    [SOURCE_LIGHT.LEFT.label]: [SOURCE_LIGHT.DOWN],
  },
  [ITEM.MIRROR_RIGHT]: {
    [SOURCE_LIGHT.UP.label]: [SOURCE_LIGHT.LEFT],
    [SOURCE_LIGHT.RIGHT.label]: [SOURCE_LIGHT.DOWN],
    [SOURCE_LIGHT.DOWN.label]: [SOURCE_LIGHT.RIGHT],
    [SOURCE_LIGHT.LEFT.label]: [SOURCE_LIGHT.UP],
  },
}

const verticalLightSource = [SOURCE_LIGHT.UP.label, SOURCE_LIGHT.DOWN.label]
const horizontalLightSource = [
  SOURCE_LIGHT.RIGHT.label,
  SOURCE_LIGHT.LEFT.label,
]

const getNextSourceDirection = ({ sourceDirection, actualItem }) => {
  if (actualItem.item === ITEM.SPLITER_VERTICAL) {
    if (verticalLightSource.includes(sourceDirection.label)) {
      return [sourceDirection]
    }
    return [SOURCE_LIGHT.DOWN, SOURCE_LIGHT.UP]
  }

  if (actualItem.item === ITEM.SPLITER_HORIZONTAL) {
    if (horizontalLightSource.includes(sourceDirection.label)) {
      return [sourceDirection]
    }
    return [SOURCE_LIGHT.RIGHT, SOURCE_LIGHT.LEFT]
  }

  if ([ITEM.MIRROR_LEFT, ITEM.MIRROR_RIGHT].includes(actualItem.item)) {
    return MIRROR_NEXT_DIRECTIONS[actualItem.item][sourceDirection.label]
  }

  // default case: actualItem.item === ITEM.EMPTY_SPACE
  return [sourceDirection]
}

const fireLightBeam = ({
  square,
  startingPoint = [0, 0],
  startingSourceDirection = SOURCE_LIGHT.RIGHT,
}) => {
  let [a, b] = startingPoint
  if (!Boolean(square?.[a]?.[b])) {
    // out of bounds
    return
  }

  let sourceDirection = startingSourceDirection

  while (Boolean(square?.[a]?.[b])) {
    let actualItem = square[a][b]
    actualItem.energized = true

    const nextSourceDirections = getNextSourceDirection({
      sourceDirection,
      actualItem,
    })

    if (nextSourceDirections.length > 1) {
      // is MIRROR or REFLECTOR
      if (actualItem.reflected) {
        // avoid loops in case of already reflected
        break
      }
      actualItem.reflected = true

      nextSourceDirections.forEach((nextSourceItem) =>
        fireLightBeam({
          square,
          startingPoint: [a, b],
          startingSourceDirection: nextSourceItem,
        })
      )

      // the lightbeam already splitted!
      break
    }

    sourceDirection = nextSourceDirections[0]
    const [i, j] = sourceDirection.coordinates
    a += i
    b += j
  }
}

const sumEnergized = (square) =>
  square.reduce(
    (acc, line) =>
      acc + line.reduce((acc2, item) => (item.energized ? acc2 + 1 : acc2), 0),
    0
  )

const toEnergizedMap = (square) => {
  let text = ''

  for (const line of square) {
    for (const item of line) {
      text += item.energized ? '#' : '.'
    }

    text += '\n'
  }

  return text
}

const testFireLightBeam = ({
  data,
  startingPoint,
  startingSourceDirection,
}) => {
  const localContraption = Square({
    data,
    itemCallbackFn: buildContraptionItemsCallbackFn,
  })

  const localContraptionSquare = localContraption.getSquare()
  fireLightBeam({
    square: localContraptionSquare,
    startingPoint,
    startingSourceDirection,
  })

  return sumEnergized(localContraptionSquare)
}

const solve = (data) => {
  const contraption = Square({
    data,
    itemCallbackFn: buildContraptionItemsCallbackFn,
  })

  const contraptionSquare = contraption.getSquare()

  let sum = sumEnergized(contraptionSquare)

  fireLightBeam({ square: contraptionSquare })

  sum = sumEnergized(contraptionSquare)

  console.log('> result 1:', sum)

  let maxSum = 0
  const MAX_COLUMN = contraptionSquare[0].length - 1
  for (let i = 0; i < contraptionSquare.length; i++) {
    const upSourceEnergized = testFireLightBeam({
      data,
      startingPoint: [0, i],
      startingSourceDirection: SOURCE_LIGHT.DOWN,
    })

    const downSourceEnergized = testFireLightBeam({
      data,
      startingPoint: [MAX_COLUMN, i],
      startingSourceDirection: SOURCE_LIGHT.UP,
    })

    if (upSourceEnergized > maxSum) {
      maxSum = upSourceEnergized
    }

    if (downSourceEnergized > maxSum) {
      maxSum = downSourceEnergized
    }
  }

  const MAX_LINE = contraptionSquare.length - 1
  for (let i = 0; i < contraptionSquare[0].length; i++) {
    const leftSourceEnergized = testFireLightBeam({
      data,
      startingPoint: [i, 0],
      startingSourceDirection: SOURCE_LIGHT.RIGHT,
    })

    const rightSourceEnergized = testFireLightBeam({
      data,
      startingPoint: [i, MAX_LINE],
      startingSourceDirection: SOURCE_LIGHT.LEFT,
    })

    if (leftSourceEnergized > maxSum) {
      maxSum = leftSourceEnergized
    }

    if (rightSourceEnergized > maxSum) {
      maxSum = rightSourceEnergized
    }
  }

  console.log('> result 2:', maxSum)
}

export default function () {
  console.log('--- Day 16: The Floor Will Be Lava ---')

  const data = readFile('16/input.in')

  return solve(data)
}
