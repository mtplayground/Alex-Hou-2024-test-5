import { describe, expect, it } from 'vitest'
import { calculateLineClearScore } from './scoring'

describe('scoring', () => {
  it('uses the classic tetris line clear score formula', () => {
    expect(calculateLineClearScore(0, 1)).toBe(0)
    expect(calculateLineClearScore(1, 1)).toBe(40)
    expect(calculateLineClearScore(2, 1)).toBe(100)
    expect(calculateLineClearScore(3, 1)).toBe(300)
    expect(calculateLineClearScore(4, 1)).toBe(1200)
  })

  it('multiplies line clear scores by level', () => {
    expect(calculateLineClearScore(1, 3)).toBe(120)
    expect(calculateLineClearScore(4, 2)).toBe(2400)
  })

  it('clamps unsupported values safely', () => {
    expect(calculateLineClearScore(-1, 0)).toBe(0)
    expect(calculateLineClearScore(8, 1)).toBe(1200)
  })
})
