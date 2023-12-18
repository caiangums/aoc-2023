import { readFile } from '_utils/file'

const VERTICAL = ['U', 'D']
const HORIZONTAL = ['L', 'R']

const DIG_MAP = new Map()
const GRID = []
const MAX_LINES = 300
const MAX_COLS = 600
const offset = {
  i: 0,
  j: 0,
}

for (let i = 0; i < MAX_LINES; i++) {
  GRID.push([])
  for (let j = 0; j < MAX_COLS; j++) {
    GRID[i].push('.')
  }
}

const printGrid = () => {
  let text = ''
  for (let i = 0; i < MAX_LINES; i++) {
    text += GRID[i].join('') + '\n'
  }

  console.log(text)
}

const getOffsets = () => {
  const digMapValues = [...DIG_MAP.values()].map((v) => v[1])

  const [lowestI] = [...digMapValues].sort((a, b) => a[0] - b[0])[0]
  const [_i, lowestJ] = [...digMapValues].sort((a, b) => a[1] - b[1])[0]

  offset.i = lowestI
  offset.j = lowestJ
}

const fillDigMap = (lines) => {
  let actualCoord = [0, 0]

  for (let i = 0; i < lines.length; i++) {
    const [direction, metersStr] = lines[i].match(/(\w) (\d+)/).slice(1, 3)
    const meters = Number(metersStr)

    let nextCoord = []
    if (VERTICAL.includes(direction)) {
      const i =
        direction === 'U' ? actualCoord[0] - meters : actualCoord[0] + meters
      nextCoord = [i, actualCoord[1]]
    } else {
      const j =
        direction === 'L' ? actualCoord[1] - meters : actualCoord[1] + meters
      nextCoord = [actualCoord[0], j]
    }

    actualCoord = nextCoord

    DIG_MAP.set(i, [direction, actualCoord])
  }
}

const drawGridLines = () => {
  let actualCoord = [0, 0]
  for (let step = 0; step < DIG_MAP.size; step++) {
    const [direction, nextCoord] = DIG_MAP.get(step)

    if (VERTICAL.includes(direction)) {
      const j = nextCoord[1] - offset.j
      if (direction === 'U') {
        for (
          let i = actualCoord[0] - offset.i;
          i >= nextCoord[0] - offset.i;
          i--
        ) {
          GRID[i][j] = '#'
        }
      } else {
        for (
          let i = actualCoord[0] - offset.i;
          i <= nextCoord[0] - offset.i;
          i++
        ) {
          GRID[i][j] = '#'
        }
      }
    } else {
      // HORIZONTAL
      const i = nextCoord[0] - offset.i
      if (direction === 'L') {
        for (
          let j = actualCoord[1] - offset.j;
          j >= nextCoord[1] - offset.j;
          j--
        ) {
          GRID[i][j] = '#'
        }
      } else {
        for (
          let j = actualCoord[1] - offset.j;
          j <= nextCoord[1] - offset.j;
          j++
        ) {
          GRID[i][j] = '#'
        }
      }
    }

    actualCoord = nextCoord
  }
}

// hole:
//  - borders: '#'
//  - fill: '0'
// ground: '.'
const openHoles = () => {
  let digging = false
  for (let i = 0; i < MAX_LINES - 1; i++) {
    digging = false

    // search for first hole border
    const start = GRID[i].indexOf('#')
    if (start < 0) {
      continue
    }

    digging = start === 0
    for (let j = start; j < MAX_COLS - 1; j++) {
      if (GRID[i][j] === '#') {
        if (j - 1 >= 0 && GRID[i][j - 1] === '#') {
          // we are at a "line" of '#' (borders)
          const endOfLine = GRID[i].slice(j).indexOf('.')
          j += endOfLine - 1

          // should we be digging or not?
          digging = i - 1 >= 0 && GRID[i - 1][j + 1] === '0'

          continue
        }

        if (j - 1 >= 0 && ['0', '.'].includes(GRID[i][j - 1])) {
          digging = !digging
        }

        // no more hole borders in this line
        if (!GRID[i].slice(j + 1).includes('#')) {
          break
        }
        continue
      }

      // FOR SURE, we have a ground ('.') item
      if (digging) {
        GRID[i][j] = '0'
      }
    }
  }
}

const evaluateVolume = () => {
  let volume = 0
  for (let i = 0; i < MAX_LINES - 1; i++) {
    for (let j = 0; j < MAX_COLS - 1; j++) {
      if (['#', '0'].includes(GRID[i][j])) {
        volume += 1
      }
      if (!GRID[i].slice(j + 1).includes('#')) {
        break
      }
    }

    if (!GRID[i].includes('#')) {
      break
    }
  }

  return volume
}

const solve = (data) => {
  const lines = data.split('\n').slice(0, -1)

  fillDigMap(lines)

  getOffsets()

  drawGridLines()

  openHoles()

  const volume = evaluateVolume()

  console.log('> result 1:', volume)

  // and the second part here
  // console.log('> result 2:')
}

export default function () {
  console.log('--- Day 18: Lavaduct Lagoon ---')

  const data = readFile('18/input.in')

  return solve(data)
}
