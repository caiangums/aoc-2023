import { hashAlgorithm } from './hash-algorithm'

export const LensBoxes = () => {
  const BOXES = new Map()

  const findBoxId = (label) => {
    let currentValue = 0
    for (const character of label.split('')) {
      currentValue = hashAlgorithm({ character, currentValue })
    }

    return currentValue
  }

  const buildLens = ({ label, value }) => `${label} ${value}`

  const getLensIndexInsideBox = ({ lensLabel, box }) =>
    box.findIndex((itemLens) => {
      const [itemLensLabel] = itemLens.split(' ')
      return itemLensLabel === lensLabel
    })

  const addLensToBox = ({ lensLabel, lensValue, boxId }) => {
    const actualBox = BOXES.has(boxId) ? BOXES.get(boxId) : []
    const lens = buildLens({ label: lensLabel, value: lensValue })

    let hasAddedLens = false
    if (actualBox.length > 0) {
      const lensIndex = getLensIndexInsideBox({ lensLabel, box: actualBox })

      if (lensIndex >= 0) {
        actualBox[lensIndex] = lens
        hasAddedLens = true
      }
    }

    if (!hasAddedLens) {
      actualBox.push(lens)
    }

    BOXES.set(boxId, actualBox)
  }

  const removeLensFromBox = ({ lensLabel, boxId }) => {
    const actualBox = BOXES.has(boxId) ? BOXES.get(boxId) : []

    const lensIndex = getLensIndexInsideBox({ lensLabel, box: actualBox })
    if (lensIndex < 0) {
      return
    }

    const updatedBoxWithoutLens = actualBox.reduce((acc, itemLens) => {
      const [itemLensLabel] = itemLens.split(' ')
      return itemLensLabel === lensLabel ? acc : [...acc, itemLens]
    }, [])

    BOXES.set(boxId, updatedBoxWithoutLens)
  }

  const executeOperation = ({ operation }) => {
    const [lensLabel, lensValue] = operation.match(/\w+|\d+/g)

    const boxId = findBoxId(lensLabel)

    if (lensValue) {
      // add/update lens to box
      addLensToBox({ lensLabel, lensValue, boxId })
    } else {
      // remove lens from box
      removeLensFromBox({ lensLabel, boxId })
    }
  }

  const findFocusPowerOfLens = ({ lensValue, boxId, slotPower }) =>
    (boxId + 1) * slotPower * lensValue

  const evaluateFocusPower = () => {
    let focusPower = 0

    for (const [boxId, boxLens] of BOXES) {
      for (let i = 0; i < boxLens.length; i++) {
        const [, lensValue] = boxLens[i].split(' ')
        focusPower += findFocusPowerOfLens({
          boxId,
          lensValue: Number(lensValue),
          slotPower: i + 1,
        })
      }
    }

    return focusPower
  }

  return {
    executeOperation,
    evaluateFocusPower,
  }
}
