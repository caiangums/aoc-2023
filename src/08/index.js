import { readFile } from '_utils/file'
import { leastCommonMultipleBetweenList } from '_utils/array'

const buildNodeMap = (nodes) => {
  const nodeMap = new Map()

  for (const node of nodes) {
    const [source, left, right] = node.match(/\w+/g)

    nodeMap.set(source, { left, right })
  }

  return nodeMap
}

const START = 'AAA'
const END = 'ZZZ'
const MOVES = {
  left: 'L',
  right: 'R',
}

const isEndNode = (actualNode) => actualNode === END

const countMovesToEnd = ({
  nodeMap,
  instructions,
  startingNode = START,
  isEndNodeValidationCallbackFn = isEndNode,
}) => {
  const instructionsList = instructions.split('')

  let actualNode = startingNode
  let moves = 0
  let i = 0
  while (!isEndNodeValidationCallbackFn(actualNode)) {
    const { left, right } = nodeMap.get(actualNode)

    actualNode = instructionsList[i] === MOVES.left ? left : right

    i = (i + 1) % instructionsList.length

    moves += 1
  }

  return moves
}

const GHOST_START = 'A'
const GHOST_END = 'Z'
const isGhostStartingNode = (nodeName) => nodeName.charAt(2) === GHOST_START
const isGhostEndingNode = (nodeName) => nodeName.charAt(2) === GHOST_END

const getGhostStartingNodes = (nodeMap) => {
  const ghostStartingNodes = []

  const nodeNames = nodeMap.keys()
  for (const nodeName of nodeNames) {
    if (isGhostStartingNode(nodeName)) {
      ghostStartingNodes.push(nodeName)
    }
  }

  return ghostStartingNodes
}

const countGhostMovesToEnd = ({ nodeMap, instructions }) => {
  const startingNodes = getGhostStartingNodes(nodeMap)
  const allNodeMoves = []

  for (const startingNode of startingNodes) {
    const nodeMoves = countMovesToEnd({
      nodeMap,
      instructions,
      startingNode,
      isEndNodeValidationCallbackFn: isGhostEndingNode,
    })

    allNodeMoves.push(nodeMoves)
  }

  const movesToEnd = leastCommonMultipleBetweenList(allNodeMoves)

  return movesToEnd
}

const solve = (data) => {
  const lines = data.split('\n').slice(0, -1)
  const instructions = lines[0]
  const nodes = lines.slice(2)

  const nodeMap = buildNodeMap(nodes)

  const movesToEnd = countMovesToEnd({ nodeMap, instructions })

  console.log('> result 1:', movesToEnd)

  const ghostMovesToEnd = countGhostMovesToEnd({ nodeMap, instructions })

  console.log('> result 2:', ghostMovesToEnd)
}

export default function () {
  console.log('--- Day 08: Haunted Wasteland ---')

  const data = readFile('08/input.in')

  return solve(data)
}
