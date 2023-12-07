import { readFile } from '_utils/file'

const HAND_TYPES = {
  FIVE: { cards: 5, strength: 7 },
  FOUR: { cards: 4, strength: 6 },
  FULL_HOUSE: { cards: 3, strength: 5 },
  THREE: { cards: 3, strength: 4 },
  TWO_PAIR: { cards: 2, strength: 3 },
  PAIR: { cards: 2, strength: 2 },
  HIGH_CARD: { cards: 1, strength: 1 },
}

const COUNT_TO_HAND_TYPE = {
  1: 'HIGH_CARD',
  2: 'PAIR',
  3: 'THREE',
  4: 'FOUR',
  5: 'FIVE',
}

const CARDS_WITHOUT_JOKER = '23456789TJQKA'.split('')
const CARDS_WITH_JOKER = 'J23456789TQKA'.split('')
const JOKER = 'J'

const isTwoPairs = (firstCount, secondCount) =>
  firstCount === 2 && secondCount === 2

const isFullHouse = (firstCount, secondCount) =>
  firstCount === 3 && secondCount === 2

const Hand = ({ cards, bid, withJoker = false }) => {
  const CARDS = withJoker ? CARDS_WITH_JOKER : CARDS_WITHOUT_JOKER

  const getCardCountsStrength = (cardCounts) => {
    const [firstCount, secondCount] = [...cardCounts.values()].sort(
      (a, b) => b - a
    )

    if (isTwoPairs(firstCount, secondCount)) {
      return HAND_TYPES.TWO_PAIR.strength
    }

    if (isFullHouse(firstCount, secondCount)) {
      return HAND_TYPES.FULL_HOUSE.strength
    }

    const type = COUNT_TO_HAND_TYPE[firstCount]

    return HAND_TYPES[type].strength
  }

  // removes JOKER from cardCounts and order by:
  //  - occurrences
  //  - strength
  const buildSortedCardCountsWithoutJoker = (cardCounts) =>
    [...cardCounts]
      .filter((card) => card[0] !== JOKER)
      .sort((a, b) => {
        const countResult = b[1] - a[1]

        return countResult === 0
          ? CARDS_WITHOUT_JOKER.indexOf(b[0]) - CARDS_WITHOUT_JOKER.indexOf(a[0])
          : countResult
      })

  const getCardCountsStrengthWithJoker = (cardCounts) => {
    if (!cardCounts.has(JOKER)) {
      return getCardCountsStrength(cardCounts)
    }

    const jokerCount = cardCounts.get(JOKER)
    if (jokerCount === 5) {
      return HAND_TYPES.FIVE.strength
    }

    // filter JOKER from cardCounts
    const sortedCardCounts = buildSortedCardCountsWithoutJoker(cardCounts)

    const updatedCardCounts = new Map(sortedCardCounts)
    const [firstCardName, firstCardCount] = sortedCardCounts[0]
    updatedCardCounts.set(firstCardName, firstCardCount + jokerCount)

    return getCardCountsStrength(updatedCardCounts)
  }

  const getHandStrength = (cards) => {
    const singleCards = cards.split('')

    const cardCounts = new Map()
    for (const card of singleCards) {
      let count = 1
      if (cardCounts.has(card)) {
        count += cardCounts.get(card)
      }

      cardCounts.set(card, count)
    }

    const handStrength = withJoker
      ? getCardCountsStrengthWithJoker(cardCounts)
      : getCardCountsStrength(cardCounts)

    return handStrength
  }

  const strength = getHandStrength(cards)

  const sortCallbackFn = (otherHand) => {
    if (strength === otherHand.strength) {
      const handSingleCards = cards.split('')
      const otherHandSingleCards = otherHand.cards.split('')

      for (let i = 0; i < handSingleCards.length; i++) {
        if (handSingleCards[i] !== otherHandSingleCards[i]) {
          return (
            CARDS.indexOf(handSingleCards[i]) -
            CARDS.indexOf(otherHandSingleCards[i])
          )
        }
      }

      return 0
    }

    return strength - otherHand.strength
  }

  return {
    cards,
    bid,
    strength,
    sortCallbackFn,
  }
}

const parseLineOfCardsAndBids = (line) => {
  const [cards, bid] = line.split(' ')
  return [cards, Number(bid)]
}

const getHandsWithStrengths = (lines, withJoker = false) => {
  const hands = []

  for (const line of lines) {
    const [cards, bid] = parseLineOfCardsAndBids(line)

    const hand = Hand({ cards, bid, withJoker })

    hands.push(hand)
  }

  return hands
}

const getTotalWinnings = (hands) =>
  hands.reduce((acc, hand, i) => acc + hand.bid * (i + 1), 0)

const solveWithoutJoker = (lines) => {
  const handsWithStrengths = getHandsWithStrengths(lines)

  const sortedHands = [...handsWithStrengths].sort((handA, handB) =>
    handA.sortCallbackFn(handB)
  )

  const totalWinnings = getTotalWinnings(sortedHands)

  return totalWinnings
}

const solveWithJoker = (lines) => {
  const withJoker = true
  const handsWithStrengthsAndWithJoker = getHandsWithStrengths(lines, withJoker)

  const sortedHandsWithJoker = [...handsWithStrengthsAndWithJoker].sort(
    (handA, handB) => handA.sortCallbackFn(handB)
  )

  const totalWinningsWithJoker = getTotalWinnings(sortedHandsWithJoker)

  return totalWinningsWithJoker
}

const solve = (data) => {
  const lines = data.split('\n').slice(0, -1)

  const totalWinnings = solveWithoutJoker(lines)

  console.log('> result 1:', totalWinnings)

  const totalWinningsWithJoker = solveWithJoker(lines)

  console.log('> result 2:', totalWinningsWithJoker)
}

export default function () {
  console.log('--- Day 07: Camel Cards ---')

  const data = readFile('07/input.in')

  return solve(data)
}
