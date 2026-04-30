import { describe, expect, it } from 'vitest'
import {
  TETROMINO_ROTATIONS,
  TETROMINO_TYPES,
  getTetrominoCells,
  getTetrominoMatrix,
  normalizeRotation,
} from './tetrominoes'

describe('tetromino definitions', () => {
  it('defines four rotation states for each tetromino', () => {
    for (const type of TETROMINO_TYPES) {
      expect(TETROMINO_ROTATIONS[type]).toHaveLength(4)

      for (const matrix of TETROMINO_ROTATIONS[type]) {
        const occupiedCellCount = matrix.flat().filter((cell) => cell === 1).length

        expect(occupiedCellCount).toBe(4)
      }
    }
  })

  it('normalizes rotation indices into the 0-3 range', () => {
    expect(normalizeRotation(0)).toBe(0)
    expect(normalizeRotation(4)).toBe(0)
    expect(normalizeRotation(5)).toBe(1)
    expect(normalizeRotation(-1)).toBe(3)
  })

  it('returns the correct occupied cells for a rotated tetromino', () => {
    expect(getTetrominoCells('T', 0)).toEqual([
      { x: 1, y: 0 },
      { x: 0, y: 1 },
      { x: 1, y: 1 },
      { x: 2, y: 1 },
    ])

    expect(getTetrominoCells('T', 1)).toEqual([
      { x: 1, y: 0 },
      { x: 1, y: 1 },
      { x: 2, y: 1 },
      { x: 1, y: 2 },
    ])
  })

  it('returns the correct rotation matrix for wrapped indices', () => {
    expect(getTetrominoMatrix('I', 5)).toEqual(getTetrominoMatrix('I', 1))
    expect(getTetrominoMatrix('L', -1)).toEqual(getTetrominoMatrix('L', 3))
  })
})
