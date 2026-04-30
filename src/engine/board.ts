import type { ActivePiece, Matrix, Point, TetrominoType } from '../types/game'
import { getTetrominoCells } from './tetrominoes'

export const BOARD_WIDTH = 10
export const BOARD_HEIGHT = 20

export function createEmptyBoard(): Matrix {
  return Array.from({ length: BOARD_HEIGHT }, () =>
    Array.from({ length: BOARD_WIDTH }, () => null)
  )
}

export function isPointInsideBoard(point: Point): boolean {
  return (
    point.x >= 0 &&
    point.x < BOARD_WIDTH &&
    point.y >= 0 &&
    point.y < BOARD_HEIGHT
  )
}

export function getBoardCell(board: Matrix, point: Point): TetrominoType | null {
  if (!isPointInsideBoard(point)) {
    return null
  }

  return board[point.y][point.x]
}

export function hasSettledBlock(board: Matrix, point: Point): boolean {
  return getBoardCell(board, point) !== null
}

export function getAbsolutePieceCells(piece: ActivePiece): Point[] {
  return getTetrominoCells(piece.type, piece.rotation).map((cell) => ({
    x: piece.position.x + cell.x,
    y: piece.position.y + cell.y,
  }))
}

export function collidesWithWalls(piece: ActivePiece): boolean {
  return getAbsolutePieceCells(piece).some(
    (cell) => cell.x < 0 || cell.x >= BOARD_WIDTH
  )
}

export function collidesWithFloor(piece: ActivePiece): boolean {
  return getAbsolutePieceCells(piece).some((cell) => cell.y >= BOARD_HEIGHT)
}

export function collidesWithSettledBlocks(
  board: Matrix,
  piece: ActivePiece
): boolean {
  return getAbsolutePieceCells(piece).some((cell) => {
    if (cell.y < 0) {
      return false
    }

    return hasSettledBlock(board, cell)
  })
}

export function collides(board: Matrix, piece: ActivePiece): boolean {
  return (
    collidesWithWalls(piece) ||
    collidesWithFloor(piece) ||
    collidesWithSettledBlocks(board, piece)
  )
}
