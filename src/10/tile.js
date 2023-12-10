export const TILES = {
  GROUND: '.',
  STARTING: 'S',
  VERTICAL_PIPE: '|',
  HORIZONTAL_PIPE: '-',
  NE_BEND_PIPE: 'L',
  NW_BEND_PIPE: 'J',
  SW_BEND_PIPE: '7',
  SE_BEND_PIPE: 'F',
}

export const TILES_CONNECTIONS_OFFSET = {
  [TILES.GROUND]: [],
  [TILES.STARTING]: [],
  [TILES.VERTICAL_PIPE]: [
    [-1, 0],
    [1, 0],
  ],
  [TILES.HORIZONTAL_PIPE]: [
    [0, -1],
    [0, 1],
  ],
  [TILES.NE_BEND_PIPE]: [
    [-1, 0],
    [0, 1],
  ],
  [TILES.NW_BEND_PIPE]: [
    [-1, 0],
    [0, -1],
  ],
  [TILES.SW_BEND_PIPE]: [
    [1, 0],
    [0, -1],
  ],
  [TILES.SE_BEND_PIPE]: [
    [1, 0],
    [0, 1],
  ],
}

export const Tile = ({ tileType, coordinates }) => {
  let tileConnections = []

  const connectToTile = (tile) => {
    if (tileConnections.length > 1) {
      return
    }

    tileConnections.push(tile)
  }

  return {
    name: () => `tile[${coordinates[0]}][${coordinates[1]}]`,
    isStartTile: () => tileType === TILES.STARTING,
    getTileConnections: () => tileConnections,
    getTileConnectionsCoordinatesOffset: () =>
      TILES_CONNECTIONS_OFFSET[tileType],
    connectToTile,
    coordinates,
  }
}
