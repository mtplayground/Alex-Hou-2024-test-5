export const LINE_CLEAR_SCORES = [0, 40, 100, 300, 1200] as const

export function calculateLineClearScore(
  clearedLineCount: number,
  level: number
): number {
  const normalizedCount = Math.max(0, Math.min(clearedLineCount, 4))
  const normalizedLevel = Math.max(1, level)

  return LINE_CLEAR_SCORES[normalizedCount] * normalizedLevel
}
