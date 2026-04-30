import type { ActivePiece, Matrix } from '../types/game'
import { collides } from './board'
import { normalizeRotation } from './tetrominoes'

function updatePieceIfValid(
  board: Matrix,
  currentPiece: ActivePiece,
  nextPiece: ActivePiece
): ActivePiece {
  return collides(board, nextPiece) ? currentPiece : nextPiece
}

export function movePieceLeft(board: Matrix, piece: ActivePiece): ActivePiece {
  return updatePieceIfValid(board, piece, {
    ...piece,
    position: {
      ...piece.position,
      x: piece.position.x - 1,
    },
  })
}

export function movePieceRight(board: Matrix, piece: ActivePiece): ActivePiece {
  return updatePieceIfValid(board, piece, {
    ...piece,
    position: {
      ...piece.position,
      x: piece.position.x + 1,
    },
  })
}

export function softDropPiece(board: Matrix, piece: ActivePiece): ActivePiece {
  return updatePieceIfValid(board, piece, {
    ...piece,
    position: {
      ...piece.position,
      y: piece.position.y + 1,
    },
  })
}

export function rotatePieceClockwise(
  board: Matrix,
  piece: ActivePiece
): ActivePiece {
  return updatePieceIfValid(board, piece, {
    ...piece,
    rotation: normalizeRotation(piece.rotation + 1),
  })
}

export function rotatePieceCounterclockwise(
  board: Matrix,
  piece: ActivePiece
): ActivePiece {
  return updatePieceIfValid(board, piece, {
    ...piece,
    rotation: normalizeRotation(piece.rotation - 1),
  })
}
