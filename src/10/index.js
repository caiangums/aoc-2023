import { readFile } from '_utils/file'
import { Maze } from './maze.js'

const solve = (data) => {
  const maze = Maze({ data })

  const farthestFromStart = maze.getFarthestPointFromStart()

  console.log('> result 1:', farthestFromStart)
}

export default function () {
  console.log('--- Day 10: Pipe Maze ---')

  const data = readFile('10/input.in')

  return solve(data)
}
