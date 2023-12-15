const MULTIPLY_FACTOR = 17
const REMAINDER_FACTOR = 256

export const hashAlgorithm = ({ character, currentValue = 0 }) => {
  const asciiCode = character.charCodeAt(0) + currentValue

  const multipliedValue = asciiCode * MULTIPLY_FACTOR

  const remainderValue = multipliedValue % REMAINDER_FACTOR

  return remainderValue
}
