import { Square } from '_utils/square'

import { Tile } from './tile'
import { DistanceConnections } from './distance-connections'

export const Maze = ({ data }) => {
  let internalSquare = null
  let getAdjascentPoints = null
  let MAZE = null
  let START_TILE = null
  let distanceConnections = null

  const buildMazeTilesCallbackFn = ({ item, coordinates }) => {
    const tile = Tile({ tileType: item, coordinates })
    if (tile.isStartTile()) {
      START_TILE = tile
    }
    return tile
  }

  const fillMazeConnections = () =>
    MAZE.forEach((line) =>
      line.forEach((tile) => {
        const coordinates = tile.coordinates
        const connectionsOffset = tile.getTileConnectionsCoordinatesOffset()

        const adjascentPoints = getAdjascentPoints(coordinates).map((coord) =>
          coord.join('')
        )

        connectionsOffset.forEach((offset) => {
          const connectionCoordinates = [
            coordinates[0] + offset[0],
            coordinates[1] + offset[1],
          ]

          if (adjascentPoints.includes(connectionCoordinates.join(''))) {
            const tileToConnect =
              MAZE[connectionCoordinates[0]][connectionCoordinates[1]]
            tile.connectToTile(tileToConnect)

            if (tileToConnect.isStartTile()) {
              tileToConnect.connectToTile(tile)
            }
          }
        })
      })
    )

  const init = () => {
    internalSquare = Square({
      data,
      itemCallbackFn: buildMazeTilesCallbackFn,
    })
    getAdjascentPoints = internalSquare.getAdjascentPoints
    MAZE = internalSquare.getSquare()

    fillMazeConnections()

    distanceConnections = DistanceConnections({ startTile: START_TILE })
    distanceConnections.evaluateDistance()
  }

  init()
  return {
    getFarthestPointFromStart: distanceConnections.getFarthestDistance,
  }
}
