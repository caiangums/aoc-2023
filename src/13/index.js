import { readFile } from '_utils/file'
import { Square } from '_utils/square'

const TILE_TYPES = {
  ASH: '.',
  ROCK: '#',
}

const getDifferencesBetween = ({ terrainA, terrainB }) => {
  let differences = 0
  for (let i = 0; i < terrainA.length; i++) {
    differences += terrainA[i] === terrainB[i] ? 0 : 1
  }

  return differences
}

const findMatchValue = ({ matchesMap, terrain, smudgeLimit = 0 }) => {
  if (matchesMap.size === 0) {
    return 0
  }

  let smudges = 0
  let foundMirroredRows = null
  for (const matchesMapValues of matchesMap.values()) {
    const { foundSmudges, matches: listOfRows } = matchesMapValues

    let allRowsMatch = true
    smudges = foundSmudges
    for (const [a, b] of listOfRows.slice(1)) {
      allRowsMatch = allRowsMatch && terrain[a].join('') === terrain[b].join('')

      if (!allRowsMatch) {
        const differences = getDifferencesBetween({
          terrainA: terrain[a],
          terrainB: terrain[b],
        })
        matchesMap.set(listOfRows[0].join(','), {
          foundSmudges: smudges + differences,
          listOfRows,
        })
        if (smudges + differences <= smudgeLimit) {
          smudges += differences
          allRowsMatch = true
          continue
        }

        break
      }
    }
    smudges = 0

    if (allRowsMatch) {
      foundMirroredRows = listOfRows
      break
    }
  }

  if (!foundMirroredRows) {
    return 0
  }

  const { foundSmudges, matches: foundMatches } = matchesMap.get(
    foundMirroredRows[0].join(',')
  )
  if (foundSmudges !== smudgeLimit) {
    return 0
  }

  const [a, b] = foundMirroredRows[0] // the actual reflected line

  return b
}

const buildMatchesMap = ({ terrainSquare, maxRow, smudgeLimit = 0 }) => {
  let matchCounts = 0
  let matchesMap = new Map()
  let smudges = 0
  for (let i = 0; i < terrainSquare.length - 1; i++) {
    let isRowMatch = terrainSquare[i].join('') === terrainSquare[i + 1].join('')

    if (!isRowMatch) {
      const differences = getDifferencesBetween({
        terrainA: terrainSquare[i],
        terrainB: terrainSquare[i + 1],
      })
      if (smudges + differences <= smudgeLimit) {
        smudges += differences
        isRowMatch = true
      }
    }

    if (isRowMatch) {
      const match = [i, i + 1]
      matchesMap.set(match.join(','), {
        foundSmudges: smudges,
        matches: [match],
      })
    }

    smudges = 0
  }

  for (const matchKey of matchesMap.keys()) {
    let matchesList = []

    let count = 0
    let [a, b] = matchKey.split(',').map((v) => Number(v))

    while (a > 0 && b < maxRow) {
      a -= 1
      b += 1

      if (b >= maxRow) {
        break
      }
      const { foundSmudges, matches } = matchesMap.get(matchKey)
      matchesMap.set(matchKey, { foundSmudges, matches: [...matches, [a, b]] })
    }
  }

  return matchesMap
}

const findTerrainMatchValue = ({ terrain, smudgeLimit = 0 }) => {
  const terrainSquareObj = Square({ data: terrain })

  const terrainSquare = terrainSquareObj.getSquare()
  const inversedTerrainSquare = terrainSquareObj.getInversedSquare()
  const [maxRow, maxCol] = terrainSquareObj.getMaxLimits()

  const matchesMap = buildMatchesMap({ terrainSquare, maxRow, smudgeLimit })
  const inversedMatchesMap = buildMatchesMap({
    terrainSquare: inversedTerrainSquare,
    maxRow: maxCol,
    smudgeLimit,
  })

  const lineMatchValue = findMatchValue({
    matchesMap: matchesMap,
    terrain: terrainSquare,
    smudgeLimit,
  })

  const columnMatchValue = findMatchValue({
    matchesMap: inversedMatchesMap,
    terrain: inversedTerrainSquare,
    smudgeLimit,
  })

  return lineMatchValue * 100 + columnMatchValue
}

const solve = (data) => {
  const terrains = data
    .split('\n\n')
    .map((terrain) => (terrain.slice(-1) !== '\n' ? `${terrain}\n` : terrain))

  let sum = 0
  for (const terrain of terrains) {
    sum += findTerrainMatchValue({ terrain })
  }

  console.log('> result 1:', sum)

  let sumWithSmudges = 0
  for (const terrain of terrains) {
    sumWithSmudges += findTerrainMatchValue({ terrain, smudgeLimit: 1 })
  }

  console.log('> result 2:', sumWithSmudges)
}

export default function () {
  console.log('--- Day 13: Point of Incidence ---')

  const data = readFile('13/input.in')

  return solve(data)
}
