import { readFile } from '_utils/file'

const BUTTON_PRESSES = 1000

const TYPE = {
  FLIP_FLOP: 'flip-flop',
  CONJUNCTION: 'conjunction',
  BROASCASTER: 'broadcaster',
  OUTPUT: 'output',
}

const pulsesCount = {
  highPulse: 0,
  lowPulse: 0,
}

const FlipFlop = ({ name }) => {
  const connections = []
  // ON / OFF = true / false
  let state = false

  const connect = (outModule) => {
    connections.push(outModule)
  }

  const highPulse = (inputModuleName) => []

  const lowPulse = (inputModuleName) => {
    const nextPulses = []

    connections.forEach((connection) => {
      if (state) {
        pulsesCount.lowPulse += 1
        nextPulses.push(() => connection.lowPulse(name))
      } else {
        pulsesCount.highPulse += 1
        nextPulses.push(() => connection.highPulse(name))
      }
    })

    state = !state

    return nextPulses
  }

  return {
    name,
    connect,
    lowPulse,
    highPulse,
    type: TYPE.FLIP_FLOP,
  }
}

const HIGH_PULSE = 'high-pulse'
const LOW_PULSE = 'low-pulse'

const Conjunction = ({ name }) => {
  const outModules = []
  const inputModules = new Map()

  const connectOut = (outModule) => {
    outModules.push(outModule)
  }

  const connectInput = (inputModuleName) => {
    inputModules.set(inputModuleName, LOW_PULSE)
  }

  const sendPulse = () => {
    const nextPulses = []

    if ([...inputModules.values()].includes(LOW_PULSE)) {
      outModules.forEach((connection) => {
        pulsesCount.highPulse += 1
        nextPulses.push(() => connection.highPulse(name))
      })
    } else {
      outModules.forEach((connection) => {
        pulsesCount.lowPulse += 1
        nextPulses.push(() => connection.lowPulse(name))
      })
    }

    return nextPulses
  }

  const highPulse = (inputModuleName) => {
    inputModules.set(inputModuleName, HIGH_PULSE)

    return sendPulse()
  }

  const lowPulse = (inputModuleName) => {
    inputModules.set(inputModuleName, LOW_PULSE)

    return sendPulse()
  }

  return {
    name,
    connectOut,
    connectInput,
    lowPulse,
    highPulse,
    type: TYPE.CONJUNCTION,
  }
}

const Broadcaster = () => {
  const name = 'broadcaster'
  const connections = []

  const connect = (outModule) => {
    connections.push(outModule)
  }

  const highPulse = (inputName) => {
    const nextPulses = []

    connections.forEach((connection) => {
      pulsesCount.highPulse += 1

      nextPulses.push(() => connection.highPulse(name))
    })

    return nextPulses
  }

  const lowPulse = (inputName) => {
    const nextPulses = []

    connections.forEach((connection) => {
      pulsesCount.lowPulse += 1

      nextPulses.push(() => connection.lowPulse(name))
    })

    return nextPulses
  }

  return {
    name,
    connect,
    highPulse,
    lowPulse,
    type: TYPE.BROASCASTER,
  }
}

let rxLowPulseSent = false
const Output = ({ name }) => {
  return {
    name,
    highPulse: () => [],
    lowPulse: () => {
      rxLowPulseSent = true
      return []
    },
    type: TYPE.OUTPUT,
  }
}

let allModules = new Map()

const buildModule = (moduleName) => {
  if (moduleName === TYPE.BROASCASTER) {
    return Broadcaster()
  }

  // FLIP_FLOP
  if (moduleName.charAt(0) === '%') {
    return FlipFlop({ name: moduleName.slice(1) })
  }

  return Conjunction({ name: moduleName.slice(1) })
}

const fillStartingModulesAndGetPulsesMap = (lines) => {
  const pulsesMap = lines.map((line) => {
    const modules = line.match(/(.*) -> (.*)/).slice(1, 3)

    const actualModule = buildModule(modules[0])

    allModules.set(actualModule.name, actualModule)

    return [actualModule.name, modules[1]]
  })

  return pulsesMap
}

const connectModulesToBePulsed = (pulsesMap) => {
  for (const pulse of pulsesMap) {
    const [source, outModules] = pulse

    const actualModule = allModules.get(source)

    outModules.split(', ').forEach((outModuleName) => {
      if (!allModules.has(outModuleName)) {
        allModules.set(outModuleName, Output({ name: outModuleName }))
      }
      const outModule = allModules.get(outModuleName)

      if (actualModule.type === TYPE.CONJUNCTION) {
        actualModule.connectOut(outModule)
      } else {
        actualModule.connect(outModule)
      }

      if (outModule.type === TYPE.CONJUNCTION) {
        outModule.connectInput(actualModule.name)
      }
    })
  }
}

const resetState = () => {
  pulsesCount.highPulse = 0
  pulsesCount.lowPulse = 0
  allModules = new Map()
}

const solve = (data) => {
  const lines = data.split('\n').slice(0, -1)

  let pulsesMap = fillStartingModulesAndGetPulsesMap(lines)

  connectModulesToBePulsed(pulsesMap)

  for (let i = 0; i < BUTTON_PRESSES; i++) {
    // execute pulses
    let startingModuleName = 'broadcaster'
    let actualModule = allModules.get(startingModuleName)
    // starting pulse
    pulsesCount.lowPulse += 1
    let actualPulses = actualModule.lowPulse('button')

    while (actualPulses.length !== 0) {
      const callbackFn = actualPulses.shift()
      actualPulses = [...actualPulses, ...callbackFn()]
    }
  }

  const finalPulses = pulsesCount.highPulse * pulsesCount.lowPulse

  console.log('> result 1:', finalPulses)

  // brute-force won't work!
  /*
  pulsesMap = fillStartingModulesAndGetPulsesMap(lines)

  connectModulesToBePulsed(pulsesMap)

  let countButtonPresses = 0
  while (!rxLowPulseSent) {
    // execute pulses
    let startingModuleName = 'broadcaster'
    let actualModule = allModules.get(startingModuleName)
    // starting pulse
    pulsesCount.lowPulse += 1
    let actualPulses = actualModule.lowPulse('button')

    while (actualPulses.length !== 0) {
      const callbackFn = actualPulses.shift()
      actualPulses = [...actualPulses, ...callbackFn()]
      if (rxLowPulseSent) {
        break
      }
    }

    countButtonPresses += 1
  }
  */

  //console.log('> result 2:', countButtonPresses)
}

export default function () {
  console.log('--- Day 20: Pulse Propagation ---')

  const data = readFile('20/input.in')

  return solve(data)
}
