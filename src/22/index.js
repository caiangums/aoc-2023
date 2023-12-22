import { readFile } from '_utils/file'

const checkOverlaps = (brickA, brickB) => {
  const [startA, endA] = brickA
  const [startB, endB] = brickB

  return (
    Math.max(startA[0], startB[0]) <= Math.min(endA[0], endB[0]) &&
    Math.max(startA[1], startB[1]) <= Math.min(endA[1], endB[1])
  )
}

const solve = (data) => {
  const bricks = data
    .split('\n')
    .reduce((acc, line) => {
      if (line.length === 0) {
        return acc
      }

      const brick = line
        .match(/(\d+,\d+,\d+)/g)
        .map((value) => value.split(',').map((v) => Number(v)))

      return [...acc, brick]
    }, [])
    .sort((a, b) => a[0][2] - b[0][2])
  // bricks are sorted by lowest Z coord

  for (let i = 0; i < bricks.length; i++) {
    const brick = bricks[i]

    let maxZ = 1
    for (let j = 0; j < i; j++) {
      const checkingBrick = bricks[j]
      const hasOverlap = checkOverlaps(brick, checkingBrick)
      if (hasOverlap) {
        maxZ = Math.max(maxZ, checkingBrick[1][2] + 1)
      }
    }

    brick[1][2] -= brick[0][2] - maxZ
    brick[0][2] = maxZ
  }

  // sorts for eventual changes
  bricks.sort((a, b) => a[0][2] - b[0][2])

  const supports = Array.from({ length: bricks.length }, () => new Set())
  const isSupportedBy = Array.from({ length: bricks.length }, () => new Set())

  for (let i = 0; i < bricks.length; i++) {
    const actualBrick = bricks[i]
    for (let j = 0; j < i; j++) {
      const belowBrick = bricks[j]
      const hasOverlap = checkOverlaps(actualBrick, belowBrick)
      if (hasOverlap && actualBrick[0][2] === belowBrick[1][2] + 1) {
        supports[j].add(i)
        isSupportedBy[i].add(j)
      }
    }
  }

  let canBeDesintegrated = 0
  for (let i = 0; i < bricks.length; i++) {
    const bricksSupporting = supports[i]

    let supportedByMoreThanOneBrick = true
    for (const el of bricksSupporting) {
      if (isSupportedBy[el].size < 2) {
        supportedByMoreThanOneBrick = false
        break
      }
    }

    canBeDesintegrated = supportedByMoreThanOneBrick
      ? canBeDesintegrated + 1
      : canBeDesintegrated
  }

  console.log('> result 1:', canBeDesintegrated)

  // and the second part here
  // console.log('> result 2:')
}

export default function () {
  console.log('--- Day 22: Sand Slabs ---')

  const data = readFile('22/input.in')

  return solve(data)
}
