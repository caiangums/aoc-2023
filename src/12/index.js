import { readFile } from '_utils/file'

const SPRING_TYPES = {
  OPERATIONAL: '.',
  DAMAGED: '#',
  UNKNOWN: '?',
}

const buildSpringsData = (lines) =>
  lines.map((line) => {
    const [springs, damagedSizes] = line.split(' ')

    const damagedSizesList = damagedSizes.split(',').map((v) => Number(v))

    const unknownSpringsPositions = springs
      .split('')
      .reduce(
        (acc, s, pos) => (s === SPRING_TYPES.UNKNOWN ? [...acc, pos] : acc),
        []
      )
    const unknownSprings = unknownSpringsPositions.length

    return {
      springs,
      damagedSizesList,
      unknownSprings,
      unknownSpringsPositions,
    }
  })

// This function doesn't consider UNKNOWN springs
const countSprings = (springs) =>
  springs
    .split(SPRING_TYPES.OPERATIONAL)
    .reduce((acc, item) => (item.length > 0 ? [...acc, item.length] : acc), [])

const replaceAt = ({ str, text, pos }) =>
  str.slice(0, pos) + text + str.slice(pos + text.length)

const buildSpringOptions = ({ springsLine, countPosition = 0 }) => {
  const { springs, unknownSprings, unknownSpringsPositions } = springsLine

  const replacePosition = unknownSpringsPositions[countPosition]

  const springsWithOperational = replaceAt({
    str: springs,
    text: SPRING_TYPES.OPERATIONAL,
    pos: replacePosition,
  })

  const springsWithDamaged = replaceAt({
    str: springs,
    text: SPRING_TYPES.DAMAGED,
    pos: replacePosition,
  })

  // stop criteria
  if (unknownSprings <= 1) {
    return [springsWithDamaged, springsWithOperational]
  }

  return [
    ...buildSpringOptions({
      springsLine: {
        ...springsLine,
        springs: springsWithDamaged,
        unknownSprings: unknownSprings - 1,
      },
      countPosition: countPosition + 1,
    }),
    ...buildSpringOptions({
      springsLine: {
        ...springsLine,
        springs: springsWithOperational,
        unknownSprings: unknownSprings - 1,
      },
      countPosition: countPosition + 1,
    }),
  ]
}

const filterValidOptions = ({ damagedSizesList, options }) => {
  const originalPositions = damagedSizesList.join(',')
  return options.filter(
    (option) => countSprings(option).join(',') === originalPositions
  )
}

const solve = (data) => {
  const lines = data.split('\n').slice(0, -1)

  const springsData = buildSpringsData(lines)

  let possibleSpringsOptions = 0
  for (const springsDataLine of springsData) {
    const options = buildSpringOptions({ springsLine: springsDataLine })

    const { damagedSizesList } = springsDataLine

    const validOptions = filterValidOptions({ damagedSizesList, options })
    possibleSpringsOptions += validOptions.length
  }

  console.log('> result 1:', possibleSpringsOptions)
}

export default function () {
  console.log('--- Day 12: Hot Springs ---')

  const data = readFile('12/input.in')

  return solve(data)
}
