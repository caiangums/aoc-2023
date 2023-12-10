export const DistanceConnections = ({ startTile }) => {
  const distanceFromStartMap = new Map()

  const getNextTile = ({ tile, prevTile }) =>
    tile.getTileConnections().find((t) => t.name() !== prevTile.name())

  const setDistanceFromTiles = ({ tile, prevTile }) => {
    const prevTileValue = distanceFromStartMap.get(prevTile.name())

    distanceFromStartMap.set(tile.name(), prevTileValue + 1)
  }

  const fillDistance = ({ tile, prevTile, tileList }) => {
    if (tile && !distanceFromStartMap.has(tile.name())) {
      setDistanceFromTiles({ tile, prevTile })

      const nextTile = getNextTile({
        tile,
        prevTile,
      })
      tileList.push(nextTile)
    }

    return { nextPrevTile: tile }
  }

  const evaluateDistance = () => {
    let actualTile = startTile
    distanceFromStartMap.set(actualTile.name(), 0)

    const prevTiles = { left: actualTile, right: actualTile }
    const tileList = actualTile.getTileConnections()

    while (tileList.length > 0) {
      const rightTile = tileList.pop()
      const leftTile = tileList.pop()

      const { nextPrevTile: nextLeftPrevTile } = fillDistance({
        tile: leftTile,
        prevTile: prevTiles.left,
        tileList,
      })
      prevTiles.left = nextLeftPrevTile

      const { nextPrevTile: nextRightPrevTile } = fillDistance({
        tile: rightTile,
        prevTile: prevTiles.right,
        tileList,
      })
      prevTiles.right = nextRightPrevTile
    }
  }

  const getFarthestDistance = () =>
    [...distanceFromStartMap.values()].sort((a, b) => a - b).pop()

  return {
    evaluateDistance,
    getFarthestDistance,
  }
}
