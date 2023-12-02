import { readFile } from '_utils/file'

const MAX_CUBES = {
  red: 12,
  green: 13,
  blue: 14,
}

const STARTING_LINE_PRESENTED_CUBES = {
  red: 0,
  green: 0,
  blue: 0,
}

const filterMaxPresentedCubesFromLine = (line) => {
  const lineMaxPresentedCubes = { ...STARTING_LINE_PRESENTED_CUBES }

  const reveals = line.split('; ')

  for (const hand of reveals) {
    const matches = hand.matchAll(/((?<quantity>\d+) (?<color>\w+))+/g)
    for (const match of matches) {
      const { quantity, color } = match.groups

      if (lineMaxPresentedCubes[color] < Number(quantity)) {
        lineMaxPresentedCubes[color] = Number(quantity)
      }
    }
  }

  return lineMaxPresentedCubes
}

const isPossibleHand = (hand) => {
  for (const color in MAX_CUBES) {
    if (hand[color] > MAX_CUBES[color]) {
      return false
    }
  }

  return true
}

const solve = (data) => {
  const lines = data.split('\n').slice(0, -1)

  let sumPossibleGames = 0

  for (const line of lines) {
    const maxPresentedCubes = filterMaxPresentedCubesFromLine(line)

    if (isPossibleHand(maxPresentedCubes)) {
      const [gameId] = line.match(/(\d+)/)
      sumPossibleGames += Number(gameId)
    }
  }

  console.log('> result 1:', sumPossibleGames)

  let sumOfGamePowers = 0

  for (const line of lines) {
    const presentedCubes = filterMaxPresentedCubesFromLine(line)

    let gamePower = 1
    for (const color in presentedCubes) {
      gamePower = gamePower * Number(presentedCubes[color])
    }

    sumOfGamePowers += gamePower
  }

  console.log('> result 2:', sumOfGamePowers)
}

export default function () {
  console.log('--- Day 02: Cube Conundrum ---')

  const data = readFile('02/input.in')

  return solve(data)
}
