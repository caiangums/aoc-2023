import { readFile } from '_utils/file'

const Boat = ({ buttonHoldTime }) => {
  return {
    speed: buttonHoldTime, // 1 mm / ms
    travelledDistance: (remainingRaceTime) =>
      remainingRaceTime * buttonHoldTime,
  }
}

const fillRacesData = (lines) => {
  const raceTimes = lines[0].match(/\d+/g)
  const raceRecords = lines[1].match(/\d+/g)

  const races = []
  for (let i = 0; i < raceTimes.length; i++) {
    races.push([raceTimes[i], raceRecords[i]])
  }

  return races
}

const findHoldTimesAboveRecord = (race) => {
  const [time, record] = race

  const holdTimes = []
  for (let i = 0; i <= time; i++) {
    const boat = Boat({ buttonHoldTime: i })
    const distance = boat.travelledDistance(time - i)

    if (distance > record) {
      holdTimes.push(i)
    }
  }

  return holdTimes
}

const getHoldTimesMultiplicationFromRaces = (lines) => {
  const races = fillRacesData(lines)

  const holdTimesPerRace = []

  for (const race of races) {
    const holdTimes = findHoldTimesAboveRecord(race)

    holdTimesPerRace.push(holdTimes.length)
  }

  const holdTimesMultiplication = holdTimesPerRace.reduce(
    (acc, holdTimes) => acc * holdTimes,
    1
  )

  return holdTimesMultiplication
}

const fillSingleRaceData = (lines) => {
  const raceTimes = lines[0].match(/\d+/g)
  const raceRecords = lines[1].match(/\d+/g)

  let raceTime = ''
  let raceRecord = ''
  for (let i = 0; i < raceTimes.length; i++) {
    raceTime = Number(`${raceTime}${raceTimes[i]}`)
    raceRecord = Number(`${raceRecord}${raceRecords[i]}`)
  }

  return [raceTime, raceRecord]
}

const getHoldTimesMultiplicationFromSingleRace = (lines) => {
  const race = fillSingleRaceData(lines)

  const holdTimes = findHoldTimesAboveRecord(race)

  return holdTimes.length
}

const solve = (data) => {
  const lines = data.split('\n').slice(0, -1)

  const holdTimesMultiplication = getHoldTimesMultiplicationFromRaces(lines)

  console.log('> result 1:', holdTimesMultiplication)

  const holdTimesFromSingleRace = getHoldTimesMultiplicationFromSingleRace(lines)

  // and the second part here
  console.log('> result 2:', holdTimesFromSingleRace)
}

export default function () {
  console.log('--- Day 06: Wait For It ---')

  const data = readFile('06/input.in')

  return solve(data)
}
