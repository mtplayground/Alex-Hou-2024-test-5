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

export function lockPiece(board: Matrix, piece: ActivePiece): Matrix {
  const nextBoard = board.map((row) => [...row])

  for (const cell of getAbsolutePieceCells(piece)) {
    if (!isPointInsideBoard(cell)) {
      continue
    }

    nextBoard[cell.y][cell.x] = piece.type
  }

  return nextBoard
}

export function isRowFull(row: Matrix[number]): boolean {
  return row.every((cell) => cell !== null)
}

export function clearFullRows(board: Matrix): {
  board: Matrix
  clearedLineCount: number
} {
  const remainingRows = board.filter((row) => !isRowFull(row)).map((row) => [...row])
  const clearedLineCount = board.length - remainingRows.length
  const emptyRows = Array.from({ length: clearedLineCount }, () =>
    Array.from({ length: BOARD_WIDTH }, () => null)
  )

  return {
    board: [...emptyRows, ...remainingRows],
    clearedLineCount,
  }
}
