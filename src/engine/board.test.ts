import { describe, expect, it } from 'vitest'
import type { ActivePiece } from '../types/game'
import {
  BOARD_HEIGHT,
  BOARD_WIDTH,
  collides,
  collidesWithFloor,
  collidesWithSettledBlocks,
  collidesWithWalls,
  createEmptyBoard,
  getAbsolutePieceCells,
  getBoardCell,
  hasSettledBlock,
  isPointInsideBoard,
} from './board'

function createPiece(overrides: Partial<ActivePiece> = {}): ActivePiece {
  return {
    type: 'T',
    rotation: 0,
    position: { x: 4, y: 0 },
    ...overrides,
  }
}

describe('board model', () => {
  it('creates a 10x20 empty board', () => {
    const board = createEmptyBoard()

    expect(board).toHaveLength(BOARD_HEIGHT)
    expect(board.every((row) => row.length === BOARD_WIDTH)).toBe(true)
    expect(board[0]).toHaveLength(BOARD_WIDTH)
    expect(board.flat().every((cell) => cell === null)).toBe(true)
  })

  it('identifies points inside the board bounds', () => {
    expect(isPointInsideBoard({ x: 0, y: 0 })).toBe(true)
    expect(isPointInsideBoard({ x: BOARD_WIDTH - 1, y: BOARD_HEIGHT - 1 })).toBe(
      true
    )
    expect(isPointInsideBoard({ x: -1, y: 0 })).toBe(false)
    expect(isPointInsideBoard({ x: BOARD_WIDTH, y: 0 })).toBe(false)
    expect(isPointInsideBoard({ x: 0, y: BOARD_HEIGHT })).toBe(false)
  })

  it('reads board cells and settled blocks safely', () => {
    const board = createEmptyBoard()
    board[2][3] = 'L'

    expect(getBoardCell(board, { x: 3, y: 2 })).toBe('L')
    expect(getBoardCell(board, { x: 9, y: 19 })).toBe(null)
    expect(getBoardCell(board, { x: -1, y: 2 })).toBe(null)
    expect(hasSettledBlock(board, { x: 3, y: 2 })).toBe(true)
    expect(hasSettledBlock(board, { x: 2, y: 2 })).toBe(false)
  })

  it('maps a piece to absolute board coordinates', () => {
    expect(getAbsolutePieceCells(createPiece())).toEqual([
      { x: 5, y: 0 },
      { x: 4, y: 1 },
      { x: 5, y: 1 },
      { x: 6, y: 1 },
    ])
  })

  it('detects wall collisions', () => {
    expect(collidesWithWalls(createPiece({ position: { x: -1, y: 0 } }))).toBe(
      true
    )
    expect(
      collidesWithWalls(createPiece({ type: 'I', rotation: 0, position: { x: 7, y: 0 } }))
    ).toBe(true)
    expect(collidesWithWalls(createPiece())).toBe(false)
  })

  it('detects floor collisions', () => {
    expect(
      collidesWithFloor(createPiece({ type: 'O', position: { x: 4, y: 19 } }))
    ).toBe(true)
    expect(collidesWithFloor(createPiece({ position: { x: 4, y: 17 } }))).toBe(
      false
    )
  })

  it('detects collisions with settled blocks', () => {
    const board = createEmptyBoard()
    board[1][5] = 'I'

    expect(collidesWithSettledBlocks(board, createPiece())).toBe(true)
    expect(
      collidesWithSettledBlocks(board, createPiece({ position: { x: 4, y: -2 } }))
    ).toBe(false)
  })

  it('detects any collision against the board state', () => {
    const board = createEmptyBoard()
    board[18][4] = 'S'

    expect(collides(board, createPiece({ position: { x: -1, y: 0 } }))).toBe(true)
    expect(collides(board, createPiece({ type: 'O', position: { x: 4, y: 19 } }))).toBe(
      true
    )
    expect(collides(board, createPiece({ type: 'O', position: { x: 3, y: 17 } }))).toBe(
      true
    )
    expect(collides(board, createPiece())).toBe(false)
  })
})
