import type { ActivePiece, Matrix, TetrominoQueue, TetrominoType } from '../types/game'
import { BOARD_WIDTH, collides } from './board'
import { getTetrominoMatrix, TETROMINO_TYPES } from './tetrominoes'

export const PREVIEW_QUEUE_SIZE = 7

export type RandomNumberGenerator = () => number

export interface SpawnResult {
  activePiece: ActivePiece
  isGameOver: boolean
  queue: TetrominoQueue
}

export function createShuffledBag(
  rng: RandomNumberGenerator = Math.random
): TetrominoQueue {
  const bag = [...TETROMINO_TYPES]

  for (let index = bag.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(rng() * (index + 1))
    ;[bag[index], bag[swapIndex]] = [bag[swapIndex], bag[index]]
  }

  return bag
}

export function refillQueue(
  queue: TetrominoQueue,
  rng: RandomNumberGenerator = Math.random,
  minimumSize = PREVIEW_QUEUE_SIZE
): TetrominoQueue {
  const nextQueue = [...queue]

  while (nextQueue.length < minimumSize) {
    nextQueue.push(...createShuffledBag(rng))
  }

  return nextQueue
}

export function createSpawnPiece(type: TetrominoType): ActivePiece {
  const matrix = getTetrominoMatrix(type, 0)
  const spawnX = Math.floor((BOARD_WIDTH - matrix[0].length) / 2)

  return {
    type,
    rotation: 0,
    position: {
      x: spawnX,
      y: 0,
    },
  }
}

export function isSpawnCollision(board: Matrix, piece: ActivePiece): boolean {
  return collides(board, piece)
}

export function spawnNextPiece(
  board: Matrix,
  queue: TetrominoQueue,
  rng: RandomNumberGenerator = Math.random
): SpawnResult {
  const replenishedQueue = refillQueue(queue, rng, 1)
  const [nextType, ...remainingQueue] = replenishedQueue
  const activePiece = createSpawnPiece(nextType)

  return {
    activePiece,
    isGameOver: isSpawnCollision(board, activePiece),
    queue: refillQueue(remainingQueue, rng),
  }
}
