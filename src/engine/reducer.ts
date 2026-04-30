import type { GameState, Matrix } from '../types/game'
import { applyGravityTick, calculateLevel, hardDropPiece } from './gameplay'
import { createEmptyBoard } from './board'
import {
  type RandomNumberGenerator,
  refillQueue,
  spawnNextPiece,
} from './queue'
import {
  movePieceLeft,
  movePieceRight,
  rotatePieceClockwise,
  rotatePieceCounterclockwise,
  softDropPiece,
} from './movement'

type RandomizedActionPayload = {
  rng?: RandomNumberGenerator
}

export type GameAction =
  | { type: 'MOVE_LEFT' }
  | { type: 'MOVE_RIGHT' }
  | { type: 'ROTATE_CLOCKWISE' }
  | { type: 'ROTATE_COUNTERCLOCKWISE' }
  | { type: 'SOFT_DROP' }
  | ({ type: 'HARD_DROP' } & RandomizedActionPayload)
  | ({ type: 'TICK' } & RandomizedActionPayload)
  | ({ type: 'SPAWN' } & RandomizedActionPayload)
  | ({ type: 'RESTART' } & RandomizedActionPayload)

export interface CreateInitialGameStateOptions {
  rng?: RandomNumberGenerator
}

function buildLockedState(
  state: GameState,
  options: {
    board: Matrix
    clearedLineCount: number
    rng?: RandomNumberGenerator
    scoreDelta: number
  }
): GameState {
  const nextLinesCleared = state.linesCleared + options.clearedLineCount
  const nextLevel = calculateLevel(nextLinesCleared)
  const spawnResult = spawnNextPiece(
    options.board,
    state.queue,
    options.rng ?? Math.random
  )

  return {
    activePiece: spawnResult.activePiece,
    board: options.board,
    level: nextLevel,
    linesCleared: nextLinesCleared,
    phase: spawnResult.isGameOver ? 'gameOver' : 'playing',
    queue: spawnResult.queue,
    score: state.score + options.scoreDelta,
  }
}

export function createInitialGameState(
  options: CreateInitialGameStateOptions = {}
): GameState {
  const board = createEmptyBoard()
  const queue = refillQueue([], options.rng ?? Math.random)
  const spawnResult = spawnNextPiece(board, queue, options.rng ?? Math.random)

  return {
    activePiece: spawnResult.activePiece,
    board,
    level: 1,
    linesCleared: 0,
    phase: spawnResult.isGameOver ? 'gameOver' : 'playing',
    queue: spawnResult.queue,
    score: 0,
  }
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'RESTART':
      return createInitialGameState({ rng: action.rng })
    case 'SPAWN': {
      const spawnResult = spawnNextPiece(
        state.board,
        state.queue,
        action.rng ?? Math.random
      )

      return {
        ...state,
        activePiece: spawnResult.activePiece,
        phase: spawnResult.isGameOver ? 'gameOver' : 'playing',
        queue: spawnResult.queue,
      }
    }
    default:
      break
  }

  if (state.phase === 'gameOver') {
    return state
  }

  switch (action.type) {
    case 'MOVE_LEFT':
      return { ...state, activePiece: movePieceLeft(state.board, state.activePiece) }
    case 'MOVE_RIGHT':
      return { ...state, activePiece: movePieceRight(state.board, state.activePiece) }
    case 'ROTATE_CLOCKWISE':
      return {
        ...state,
        activePiece: rotatePieceClockwise(state.board, state.activePiece),
      }
    case 'ROTATE_COUNTERCLOCKWISE':
      return {
        ...state,
        activePiece: rotatePieceCounterclockwise(state.board, state.activePiece),
      }
    case 'SOFT_DROP':
      return { ...state, activePiece: softDropPiece(state.board, state.activePiece) }
    case 'TICK': {
      const tickResult = applyGravityTick(state.board, state.activePiece, state.level)

      if (!tickResult.didLock) {
        return { ...state, activePiece: tickResult.piece }
      }

      return buildLockedState(state, {
        board: tickResult.board,
        clearedLineCount: tickResult.clearedLineCount,
        rng: action.rng,
        scoreDelta: tickResult.scoreDelta,
      })
    }
    case 'HARD_DROP': {
      const dropResult = hardDropPiece(state.board, state.activePiece, state.level)

      return buildLockedState(state, {
        board: dropResult.board,
        clearedLineCount: dropResult.clearedLineCount,
        rng: action.rng,
        scoreDelta: dropResult.scoreDelta,
      })
    }
  }

  return state
}

export const gameActions = {
  hardDrop: (rng?: RandomNumberGenerator): GameAction => ({ type: 'HARD_DROP', rng }),
  moveLeft: (): GameAction => ({ type: 'MOVE_LEFT' }),
  moveRight: (): GameAction => ({ type: 'MOVE_RIGHT' }),
  restart: (rng?: RandomNumberGenerator): GameAction => ({ type: 'RESTART', rng }),
  rotateClockwise: (): GameAction => ({ type: 'ROTATE_CLOCKWISE' }),
  rotateCounterclockwise: (): GameAction => ({
    type: 'ROTATE_COUNTERCLOCKWISE',
  }),
  softDrop: (): GameAction => ({ type: 'SOFT_DROP' }),
  spawn: (rng?: RandomNumberGenerator): GameAction => ({ type: 'SPAWN', rng }),
  tick: (rng?: RandomNumberGenerator): GameAction => ({ type: 'TICK', rng }),
}
