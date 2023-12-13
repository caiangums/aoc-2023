/*
 * Square is a module that helps to create, isolate and iteract
 * with 2d SQUARE shapes
 *
 * It expect to receive the original `data` that can be used to
 * build the 2d square.
 *
 * There are also some helper functions such as:
 *  - getAdjascentPoints(point: Array<number>): returns the
 *    adjascent points from the square, based on square size and
 *    limits
 */
export const Square = ({ data, itemCallbackFn = null }) => {
  let ROW_SIZE = -1
  let COL_SIZE = -1
  let SQUARE = null
  let INVERSED_SQUARE = null

  const init = () => {
    const lines = data.split('\n').slice(0, -1)

    SQUARE = lines.map((line, i) => {
      const singleLineList = line.split('')
      if (itemCallbackFn) {
        return singleLineList.map((item, j) =>
          itemCallbackFn({ item, coordinates: [i, j] })
        )
      }

      return singleLineList
    })
    ROW_SIZE = lines.length
    COL_SIZE = lines[0].length
  }

  const clearOutOfBoundPoints = (adjascentPoints = []) => {
    const clearedAdjascentPoints = []

    for (const adjascentPoint of adjascentPoints) {
      const [x, y] = adjascentPoint
      if (x >= 0 && x < ROW_SIZE && y >= 0 && y < COL_SIZE) {
        clearedAdjascentPoints.push(adjascentPoint)
      }
    }

    return clearedAdjascentPoints
  }

  // Returns those points based on point x(i,j):
  //
  //    [ ] [.] [ ]
  //    [.] [x] [.]
  //    [ ] [.] [ ]
  //
  // Also, clear out of bounds points
  const getLineAndColumnAdjascentPoints = (point) => {
    const [i, j] = point
    const lineAndColumnAdjascentPoints = [
      [i - 1, j],
      [i, j - 1],
      [i, j + 1],
      [i + 1, j],
    ]

    return clearOutOfBoundPoints(adjascentPoints)
  }

  // Returns those points based on point x(i,j):
  //
  //    [.] [.] [.]
  //    [.] [x] [.]
  //    [.] [.] [.]
  //
  // Also, clear out of bounds points
  const getAdjascentPoints = (point) => {
    const [i, j] = point
    const allPossibleAdjascentPoints = [
      [i - 1, j - 1],
      [i - 1, j],
      [i - 1, j + 1],
      [i, j - 1],
      [i, j + 1],
      [i + 1, j - 1],
      [i + 1, j],
      [i + 1, j + 1],
    ]

    return clearOutOfBoundPoints(adjascentPoints)
  }

  const getMaxLimits = () => [ROW_SIZE, COL_SIZE]
  const getSquare = () => SQUARE

  /**
   * Note: INVERSED_SQUARE is not a deep copy of objects from
   * elements!
   */
  const getInversedSquare = () => {
    if (!INVERSED_SQUARE) {
      INVERSED_SQUARE = Array.from({ length: COL_SIZE }, () => [])
      for (let i = 0; i < COL_SIZE; i++) {
        for (let j = 0; j < ROW_SIZE; j++) {
          INVERSED_SQUARE[i].push(SQUARE[j][i])
        }
      }
    }

    return INVERSED_SQUARE
  }

  init()
  return {
    data,
    getAdjascentPoints,
    getLineAndColumnAdjascentPoints,
    getMaxLimits,
    getSquare,
    getInversedSquare,
  }
}
