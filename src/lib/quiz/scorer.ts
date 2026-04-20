export function calculateBlockScore(scores: number[]): number {
  if (scores.length === 0) return 0
  return scores.reduce((sum, s) => sum + s, 0) / scores.length
}

export function calculateTotalScore(b1: number, b2: number, b3: number): number {
  return (b1 + b2 + b3) / 3
}
