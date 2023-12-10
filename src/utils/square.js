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

    const adjascentPoints = []

    for (const adjascentPoint of allPossibleAdjascentPoints) {
      const [x, y] = adjascentPoint
      if (x >= 0 && x < ROW_SIZE && y >= 0 && y < COL_SIZE) {
        adjascentPoints.push(adjascentPoint)
      }
    }

    return adjascentPoints
  }

  const getMaxLimits = () => [ROW_SIZE, COL_SIZE]
  const getSquare = () => SQUARE

  init()
  return {
    data,
    getAdjascentPoints,
    getMaxLimits,
    getSquare,
  }
}
