import { readFile } from '_utils/file'

const WORKFLOWS = new Map()
const PARTS = []

const GREATER_THAN = '>'
const LOWER_THAN = '<'

const ACCEPTED = 'A'
const REJECTED = 'R'

const fillPart = (part) => {
  const [x, m, a, s] = part.match(/(\d+)/g).map((v) => Number(v))

  PARTS.push({ x, m, a, s })
}

// singlePart parameter is an object in form { x, m, a, s }
const workflowFn =
  ({ category, check, value, resultingWorkflow }) =>
  (singlePart) => {
    if (check === GREATER_THAN) {
      return singlePart[category] > value ? resultingWorkflow : null
    }
    // LOWER_THAN
    return singlePart[category] < value ? resultingWorkflow : null
  }

const fillWorkflow = (workflow) => {
  const [_fullMatch, name, allConditions, finalResult] = workflow.match(
    /(\w+){(.+:\w+)+,(\w+)}/
  )

  // functions with checks to be iterable
  const conditionsChecks = allConditions.split(',').map((condition) => {
    const [_fullMatch2, category, check, value, resultingWorkflow] =
      condition.match(/(\w)(<|>)(\d+):(\w+)/)

    return workflowFn({
      category,
      check,
      value: Number(value),
      resultingWorkflow,
    })
  })

  WORKFLOWS.set(name, { conditionsChecks, finalResult })
}

const fillWorflowsAndPartsFromLines = (lines) => {
  let isMachinePart = false
  for (const line of lines) {
    if (line.length > 0) {
      if (isMachinePart) {
        fillPart(line)
      } else {
        fillWorkflow(line)
      }
    } else {
      isMachinePart = true
    }
  }
}

const evaluateWorkflow = ({ part, conditionsChecks, finalResult }) => {
  let result = null

  for (const conditionFn of conditionsChecks) {
    result = conditionFn(part)
    if (result !== null) {
      break
    }
  }

  result = result ?? finalResult

  if (WORKFLOWS.has(result)) {
    const {
      conditionsChecks: nextConditionsChecks,
      finalResult: nextFinalRestul,
    } = WORKFLOWS.get(result)

    return evaluateWorkflow({
      part,
      conditionsChecks: nextConditionsChecks,
      finalResult: nextFinalRestul,
    })
  }

  return result
}

const sumRatingNumbers = (parts) =>
  parts.reduce((acc, { x, m, a, s }) => acc + x + m + a + s, 0)

const solve = (data) => {
  const lines = data.split('\n').slice(0, -1)

  fillWorflowsAndPartsFromLines(lines)

  const acceptedParts = []
  for (const part of PARTS) {
    const { conditionsChecks, finalResult } = WORKFLOWS.get('in')

    const result = evaluateWorkflow({ part, conditionsChecks, finalResult })

    if (result === ACCEPTED) {
      acceptedParts.push(part)
    }
  }

  const sumOfRatingNumbers = sumRatingNumbers(acceptedParts)

  console.log('> result 1:', sumOfRatingNumbers)
}

export default function () {
  console.log('--- Day 19: Aplenty ---')

  const data = readFile('19/input.in')

  return solve(data)
}
