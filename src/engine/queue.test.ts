import { describe, expect, it } from 'vitest'
import type { TetrominoQueue } from '../types/game'
import { createEmptyBoard } from './board'
import {
  createShuffledBag,
  createSpawnPiece,
  isSpawnCollision,
  PREVIEW_QUEUE_SIZE,
  refillQueue,
  spawnNextPiece,
} from './queue'
import { TETROMINO_TYPES } from './tetrominoes'

function createDeterministicRng(values: number[]): () => number {
  let index = 0

  return () => {
    const value = values[index] ?? 0
    index += 1
    return value
  }
}

describe('piece queue and spawning', () => {
  it('creates a 7-bag containing each tetromino exactly once', () => {
    const bag = createShuffledBag(() => 0)

    expect(bag).toHaveLength(TETROMINO_TYPES.length)
    expect([...bag].sort()).toEqual([...TETROMINO_TYPES].sort())
  })

  it('refills the queue until it reaches the preview size', () => {
    const queue = refillQueue(['I'], () => 0, PREVIEW_QUEUE_SIZE)

    expect(queue.length).toBeGreaterThanOrEqual(PREVIEW_QUEUE_SIZE)
    expect(queue[0]).toBe('I')
  })

  it('spawns pieces centered at the top using rotation 0', () => {
    expect(createSpawnPiece('I')).toEqual({
      type: 'I',
      rotation: 0,
      position: { x: 3, y: 0 },
    })

    expect(createSpawnPiece('O')).toEqual({
      type: 'O',
      rotation: 0,
      position: { x: 4, y: 0 },
    })
  })

  it('detects immediate spawn collision as game over', () => {
    const board = createEmptyBoard()
    board[0][4] = 'L'

    expect(isSpawnCollision(board, createSpawnPiece('O'))).toBe(true)
  })

  it('spawns the next queued piece and replenishes the queue', () => {
    const board = createEmptyBoard()
    const rng = createDeterministicRng([0, 0, 0, 0, 0, 0, 0])
    const queue: TetrominoQueue = ['T', 'L']

    const result = spawnNextPiece(board, queue, rng)

    expect(result.activePiece).toEqual({
      type: 'T',
      rotation: 0,
      position: { x: 3, y: 0 },
    })
    expect(result.isGameOver).toBe(false)
    expect(result.queue[0]).toBe('L')
    expect(result.queue.length).toBeGreaterThanOrEqual(PREVIEW_QUEUE_SIZE)
  })

  it('reports game over when the spawned piece immediately collides', () => {
    const board = createEmptyBoard()
    board[1][5] = 'S'

    const result = spawnNextPiece(board, ['T'])

    expect(result.activePiece.type).toBe('T')
    expect(result.isGameOver).toBe(true)
  })
})
