import { describe, expect, it } from 'vitest'
import type { ActivePiece } from '../types/game'
import { createEmptyBoard } from './board'
import {
  movePieceLeft,
  movePieceRight,
  rotatePieceClockwise,
  rotatePieceCounterclockwise,
  softDropPiece,
} from './movement'

function createPiece(overrides: Partial<ActivePiece> = {}): ActivePiece {
  return {
    type: 'T',
    rotation: 0,
    position: { x: 4, y: 0 },
    ...overrides,
  }
}

describe('piece movement', () => {
  it('moves a piece left when no collision occurs', () => {
    const board = createEmptyBoard()

    expect(movePieceLeft(board, createPiece())).toEqual(
      createPiece({ position: { x: 3, y: 0 } })
    )
  })

  it('does not move a piece left into a wall', () => {
    const board = createEmptyBoard()
    const piece = createPiece({ position: { x: -1, y: 0 } })

    expect(movePieceLeft(board, piece)).toEqual(piece)
  })

  it('moves a piece right when no collision occurs', () => {
    const board = createEmptyBoard()

    expect(movePieceRight(board, createPiece())).toEqual(
      createPiece({ position: { x: 5, y: 0 } })
    )
  })

  it('does not move a piece right into a wall', () => {
    const board = createEmptyBoard()
    const piece = createPiece({ type: 'I', position: { x: 6, y: 0 } })

    expect(movePieceRight(board, piece)).toEqual(piece)
  })

  it('soft drops a piece when the next row is free', () => {
    const board = createEmptyBoard()

    expect(softDropPiece(board, createPiece())).toEqual(
      createPiece({ position: { x: 4, y: 1 } })
    )
  })

  it('does not soft drop a piece through the floor', () => {
    const board = createEmptyBoard()
    const piece = createPiece({ type: 'O', position: { x: 4, y: 18 } })

    expect(softDropPiece(board, piece)).toEqual(piece)
  })

  it('does not move through settled blocks', () => {
    const board = createEmptyBoard()
    board[1][3] = 'L'
    const piece = createPiece()

    expect(movePieceLeft(board, piece)).toEqual(piece)
  })

  it('rotates clockwise when the rotated piece does not collide', () => {
    const board = createEmptyBoard()

    expect(rotatePieceClockwise(board, createPiece())).toEqual(
      createPiece({ rotation: 1 })
    )
  })

  it('reverts clockwise rotation when blocked by a wall', () => {
    const board = createEmptyBoard()
    const piece = createPiece({ type: 'I', rotation: 1, position: { x: -2, y: 0 } })

    expect(rotatePieceClockwise(board, piece)).toEqual(piece)
  })

  it('reverts counterclockwise rotation when blocked by settled blocks', () => {
    const board = createEmptyBoard()
    board[1][5] = 'Z'
    const piece = createPiece({ rotation: 1 })

    expect(rotatePieceCounterclockwise(board, piece)).toEqual(piece)
  })

  it('rotates counterclockwise when the rotated piece is valid', () => {
    const board = createEmptyBoard()
    const piece = createPiece({ rotation: 1 })

    expect(rotatePieceCounterclockwise(board, piece)).toEqual(
      createPiece({ rotation: 0 })
    )
  })
})
