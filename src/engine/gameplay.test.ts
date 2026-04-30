import { describe, expect, it } from 'vitest'
import type { ActivePiece } from '../types/game'
import { createEmptyBoard } from './board'
import {
  applyGravityTick,
  calculateLevel,
  getGravityIntervalMs,
  hardDropPiece,
  HARD_DROP_BONUS_PER_ROW,
} from './gameplay'

function createPiece(overrides: Partial<ActivePiece> = {}): ActivePiece {
  return {
    type: 'T',
    rotation: 0,
    position: { x: 4, y: 0 },
    ...overrides,
  }
}

describe('gameplay helpers', () => {
  it('increments level every 10 cleared lines', () => {
    expect(calculateLevel(0)).toBe(1)
    expect(calculateLevel(9)).toBe(1)
    expect(calculateLevel(10)).toBe(2)
    expect(calculateLevel(25)).toBe(3)
  })

  it('reduces the gravity interval as levels increase', () => {
    expect(getGravityIntervalMs(1)).toBe(1000)
    expect(getGravityIntervalMs(2)).toBe(925)
    expect(getGravityIntervalMs(20)).toBeGreaterThanOrEqual(100)
  })

  it('moves the active piece down on a free gravity tick', () => {
    const board = createEmptyBoard()
    const piece = createPiece()

    expect(applyGravityTick(board, piece, 1)).toEqual({
      board,
      clearedLineCount: 0,
      didLock: false,
      piece: createPiece({ position: { x: 4, y: 1 } }),
      scoreDelta: 0,
    })
  })

  it('locks the piece and scores when gravity cannot move it further', () => {
    const board = createEmptyBoard()
    board[19] = ['I', 'I', 'I', 'I', 'I', 'I', 'I', 'I', 'I', null]
    const piece = createPiece({ type: 'I', rotation: 1, position: { x: 7, y: 16 } })

    const result = applyGravityTick(board, piece, 1)

    expect(result.didLock).toBe(true)
    expect(result.clearedLineCount).toBe(1)
    expect(result.scoreDelta).toBe(40)
    expect(result.board[19][9]).toBe('I')
    expect(result.board[18][9]).toBe('I')
    expect(result.board[17][9]).toBe('I')
  })

  it('hard drops to the final valid row and locks immediately', () => {
    const board = createEmptyBoard()
    const piece = createPiece()

    const result = hardDropPiece(board, piece, 1)

    expect(result.droppedRows).toBeGreaterThan(0)
    expect(result.scoreDelta).toBe(result.droppedRows * HARD_DROP_BONUS_PER_ROW)
    expect(result.board[18][5]).toBe('T')
    expect(result.board[19][4]).toBe('T')
    expect(result.board[19][5]).toBe('T')
    expect(result.board[19][6]).toBe('T')
  })

  it('includes line clear points in the hard drop score', () => {
    const board = createEmptyBoard()
    board[19] = ['I', 'I', 'I', 'I', 'I', 'I', 'I', 'I', 'I', null]
    const piece = createPiece({ type: 'I', rotation: 1, position: { x: 7, y: 0 } })

    const result = hardDropPiece(board, piece, 2)

    expect(result.clearedLineCount).toBe(1)
    expect(result.scoreDelta).toBe(80 + result.droppedRows * HARD_DROP_BONUS_PER_ROW)
    expect(result.board[19][9]).toBe('I')
    expect(result.board[18][9]).toBe('I')
    expect(result.board[17][9]).toBe('I')
  })
})
