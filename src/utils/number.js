// GCD for positive numbers
export const greatestCommonDivisor = (x, y) => {
  let [a, b] = x < y ? [x, y] : [y, x]

  while (true) {
    if (b === 0) return a
    a = a % b

    if (a === 0) return b
    b = b % a
  }
}

// LCM for positive numbers
export const leastCommonMultiple = (a, b) =>
  (a * b) / greatestCommonDivisor(a, b)
