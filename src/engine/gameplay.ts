import type { ActivePiece, Matrix } from '../types/game'
import { clearFullRows, collides, lockPiece } from './board'
import { softDropPiece } from './movement'
import { calculateLineClearScore } from './scoring'

export const HARD_DROP_BONUS_PER_ROW = 2
const MIN_GRAVITY_INTERVAL_MS = 100
const BASE_GRAVITY_INTERVAL_MS = 1000
const GRAVITY_STEP_MS = 75

export interface GravityTickResult {
  board: Matrix
  clearedLineCount: number
  didLock: boolean
  piece: ActivePiece
  scoreDelta: number
}

export interface HardDropResult {
  board: Matrix
  clearedLineCount: number
  droppedRows: number
  piece: ActivePiece
  scoreDelta: number
}

export function calculateLevel(totalClearedLines: number): number {
  return Math.max(1, Math.floor(totalClearedLines / 10) + 1)
}

export function getGravityIntervalMs(level: number): number {
  return Math.max(
    MIN_GRAVITY_INTERVAL_MS,
    BASE_GRAVITY_INTERVAL_MS - (Math.max(1, level) - 1) * GRAVITY_STEP_MS
  )
}

export function applyGravityTick(
  board: Matrix,
  piece: ActivePiece,
  level: number
): GravityTickResult {
  const droppedPiece = softDropPiece(board, piece)

  if (droppedPiece !== piece) {
    return {
      board,
      clearedLineCount: 0,
      didLock: false,
      piece: droppedPiece,
      scoreDelta: 0,
    }
  }

  const lockedBoard = lockPiece(board, piece)
  const { board: clearedBoard, clearedLineCount } = clearFullRows(lockedBoard)

  return {
    board: clearedBoard,
    clearedLineCount,
    didLock: true,
    piece,
    scoreDelta: calculateLineClearScore(clearedLineCount, level),
  }
}

export function hardDropPiece(
  board: Matrix,
  piece: ActivePiece,
  level: number
): HardDropResult {
  let currentPiece = piece
  let droppedRows = 0

  while (true) {
    const nextPiece: ActivePiece = {
      ...currentPiece,
      position: {
        ...currentPiece.position,
        y: currentPiece.position.y + 1,
      },
    }

    if (collides(board, nextPiece)) {
      break
    }

    currentPiece = nextPiece
    droppedRows += 1
  }

  const lockedBoard = lockPiece(board, currentPiece)
  const { board: clearedBoard, clearedLineCount } = clearFullRows(lockedBoard)
  const lineClearScore = calculateLineClearScore(clearedLineCount, level)

  return {
    board: clearedBoard,
    clearedLineCount,
    droppedRows,
    piece: currentPiece,
    scoreDelta: lineClearScore + droppedRows * HARD_DROP_BONUS_PER_ROW,
  }
}
