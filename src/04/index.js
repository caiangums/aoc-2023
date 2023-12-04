import { readFile } from '_utils/file'

const getTotalPointsFromScratchCards = (lines) => {
  let totalPoints = 0
  for (const line of lines) {
    const [_cardLabel, winningNumbers, cardNumbers] = line

    const winningNumbersList = winningNumbers.match(/\d+/g)
    const cardNumbersList = cardNumbers.match(/\d+/g)

    let cardPoints = 0
    for (const cardNumber of cardNumbersList) {
      if (winningNumbersList.includes(cardNumber)) {
        cardPoints = cardPoints === 0 ? 1 : cardPoints * 2
      }
    }

    totalPoints += cardPoints
  }

  return totalPoints
}

const getScratchCardById = ({ scratchCards, scratchCardId }) => {
  const actualScratchCard = scratchCards.has(scratchCardId)
    ? scratchCards.get(scratchCardId)
    : { copies: 0, points: 0 }

  return actualScratchCard
}

const getCardPointsAndLabel = (line) => {
  const [cardLabel, winningNumbers, cardNumbers] = line

  const scratchCardId = Number(cardLabel.match(/\d+/g))

  const winningNumbersList = winningNumbers.match(/\d+/g)
  const cardNumbersList = cardNumbers.match(/\d+/g)

  let cardPoints = 0
  for (const cardNumber of cardNumbersList) {
    if (winningNumbersList.includes(cardNumber)) {
      cardPoints += 1
    }
  }

  return { cardPoints, scratchCardId }
}

const findOriginalScratchCardsAndCopies = (lines) => {
  const MAX_CARD_ID = lines.length + 1
  const scratchCards = new Map()

  for (const line of lines) {
    const { cardPoints, scratchCardId } = getCardPointsAndLabel(line)

    const actualScratchCard = getScratchCardById({
      scratchCards,
      scratchCardId,
    })

    // add the original card and fill points
    const originalCardPlusCopies = actualScratchCard.copies + 1
    scratchCards.set(scratchCardId, {
      copies: originalCardPlusCopies,
      points: cardPoints,
    })

    // populate next cards with copies
    for (
      let i = scratchCardId;
      i < cardPoints + scratchCardId && i < MAX_CARD_ID;
      i++
    ) {
      const nextScratchCardId = i + 1
      const nextScratchCard = getScratchCardById({
        scratchCards,
        scratchCardId: nextScratchCardId,
      })

      scratchCards.set(nextScratchCardId, {
        copies: nextScratchCard.copies + originalCardPlusCopies,
        points: nextScratchCard.points,
      })
    }
  }

  return scratchCards
}

const getTotalScratchCards = (scratchCardsMap) => {
  let totalScratchCards = 0
  for (let scratchCard of scratchCardsMap.values()) {
    totalScratchCards += scratchCard.copies
  }

  return totalScratchCards
}

const solve = (data) => {
  const lines = data
    .split('\n')
    .slice(0, -1)
    .map((line) => line.split(/:|\|/))

  const totalPoints = getTotalPointsFromScratchCards(lines)

  console.log('> result 1:', totalPoints)

  const scratchCardsMap = findOriginalScratchCardsAndCopies(lines)

  const totalScratchCards = getTotalScratchCards(scratchCardsMap)

  console.log('> result 2:', totalScratchCards)
}

export default function () {
  console.log('--- Day 04: Scratchcards ---')

  const data = readFile('04/input.in')

  return solve(data)
}
