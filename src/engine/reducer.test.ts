import { describe, expect, it } from 'vitest'
import type { GameState } from '../types/game'
import { createInitialGameState, gameActions, gameReducer } from './reducer'

function createDeterministicRng(values: number[]): () => number {
  let index = 0

  return () => {
    const value = values[index] ?? 0
    index += 1
    return value
  }
}

function createState(overrides: Partial<GameState> = {}): GameState {
  const rng = createDeterministicRng([0, 0, 0, 0, 0, 0, 0])

  return {
    ...createInitialGameState({ rng }),
    ...overrides,
  }
}

describe('game reducer', () => {
  it('creates an initial playable state with an active piece and queue', () => {
    const state = createInitialGameState({
      rng: createDeterministicRng([0, 0, 0, 0, 0, 0, 0]),
    })

    expect(state.phase).toBe('playing')
    expect(state.level).toBe(1)
    expect(state.linesCleared).toBe(0)
    expect(state.score).toBe(0)
    expect(state.queue.length).toBeGreaterThan(0)
  })

  it('moves the active piece left through the reducer', () => {
    const state = createState()

    expect(gameReducer(state, gameActions.moveLeft()).activePiece.position.x).toBe(
      state.activePiece.position.x - 1
    )
  })

  it('advances gravity ticks without locking when space is free', () => {
    const state = createState()

    expect(gameReducer(state, gameActions.tick()).activePiece.position.y).toBe(
      state.activePiece.position.y + 1
    )
  })

  it('locks, scores, and spawns the next piece on hard drop', () => {
    const rng = createDeterministicRng([0, 0, 0, 0, 0, 0, 0])
    const state = createState()

    const nextState = gameReducer(state, gameActions.hardDrop(rng))

    expect(nextState.score).toBeGreaterThan(0)
    expect(nextState.activePiece).not.toEqual(state.activePiece)
    expect(nextState.phase).toBe('playing')
    expect(nextState.queue.length).toBeGreaterThan(0)
  })

  it('increments total lines and level after enough clears', () => {
    const state = createState({
      activePiece: {
        type: 'I',
        rotation: 1,
        position: { x: 7, y: 0 },
      },
      board: (() => {
        const board = createState().board.map((row) => [...row])
        board[19] = ['I', 'I', 'I', 'I', 'I', 'I', 'I', 'I', 'I', null]
        return board
      })(),
      linesCleared: 9,
      level: 1,
    })

    const nextState = gameReducer(
      state,
      gameActions.hardDrop(createDeterministicRng([0, 0, 0, 0, 0, 0, 0]))
    )

    expect(nextState.linesCleared).toBe(10)
    expect(nextState.level).toBe(2)
    expect(nextState.score).toBeGreaterThan(0)
  })

  it('enters game over when spawning the next piece immediately collides', () => {
    const state = createState({
      activePiece: {
        type: 'I',
        rotation: 1,
        position: { x: 7, y: 0 },
      },
      board: (() => {
        const board = createState().board.map((row) => [...row])
        board[19] = ['I', 'I', 'I', 'I', 'I', 'I', 'I', 'I', 'I', null]
        board[0][4] = 'L'
        return board
      })(),
    })

    const nextState = gameReducer(
      state,
      gameActions.hardDrop(createDeterministicRng([0, 0, 0, 0, 0, 0, 0]))
    )

    expect(nextState.phase).toBe('gameOver')
  })

  it('restarts from a fresh initial state', () => {
    const state = createState({
      linesCleared: 12,
      level: 2,
      phase: 'gameOver',
      score: 640,
    })

    const nextState = gameReducer(
      state,
      gameActions.restart(createDeterministicRng([0, 0, 0, 0, 0, 0, 0]))
    )

    expect(nextState.phase).toBe('playing')
    expect(nextState.level).toBe(1)
    expect(nextState.linesCleared).toBe(0)
    expect(nextState.score).toBe(0)
  })

  it('toggles between playing and paused outside game over', () => {
    const state = createState()

    const pausedState = gameReducer(state, gameActions.togglePause())
    const resumedState = gameReducer(pausedState, gameActions.togglePause())

    expect(pausedState.phase).toBe('paused')
    expect(resumedState.phase).toBe('playing')
  })

  it('ignores movement while paused', () => {
    const state = createState({ phase: 'paused' })

    const nextState = gameReducer(state, gameActions.moveLeft())

    expect(nextState).toEqual(state)
  })
})
