import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'
import { APP_TITLE } from './config/env'
import type { GameAction } from './engine/reducer'
import { HIGH_SCORES_STORAGE_KEY } from './lib/highScores'
import { useGame } from './hooks/useGame'

vi.mock('./hooks/useGame', () => ({
  useGame: vi.fn(),
}))

const mockedUseGame = vi.mocked(useGame)

function createAction<T extends GameAction>(action: T): T {
  return action
}

const mockActions = {
  hardDrop: vi.fn(() => createAction({ type: 'HARD_DROP', rng: undefined })),
  moveLeft: vi.fn(() => createAction({ type: 'MOVE_LEFT' })),
  moveRight: vi.fn(() => createAction({ type: 'MOVE_RIGHT' })),
  restart: vi.fn(() => createAction({ type: 'RESTART', rng: undefined })),
  rotateClockwise: vi.fn(() => createAction({ type: 'ROTATE_CLOCKWISE' })),
  rotateCounterclockwise: vi.fn(() =>
    createAction({ type: 'ROTATE_COUNTERCLOCKWISE' })
  ),
  softDrop: vi.fn(() => createAction({ type: 'SOFT_DROP' })),
  spawn: vi.fn(() => createAction({ type: 'SPAWN', rng: undefined })),
  tick: vi.fn(() => createAction({ type: 'TICK', rng: undefined })),
  togglePause: vi.fn(() => createAction({ type: 'TOGGLE_PAUSE' })),
}

const mockDispatch = vi.fn()

describe('App', () => {
  beforeEach(() => {
    window.localStorage.clear()
    mockDispatch.mockReset()
    for (const action of Object.values(mockActions)) {
      action.mockClear()
    }

    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(
      null as unknown as CanvasRenderingContext2D
    )
  })

  afterEach(() => {
    cleanup()
    vi.restoreAllMocks()
  })

  it('renders the start screen and can route to the leaderboard', () => {
    mockedUseGame.mockReturnValue({
      actions: mockActions,
      dispatch: mockDispatch,
      state: {
        activePiece: { position: { x: 4, y: 0 }, rotation: 0, type: 'T' },
        board: Array.from({ length: 20 }, () => Array.from({ length: 10 }, () => null)),
        level: 1,
        linesCleared: 0,
        phase: 'paused',
        queue: ['I', 'O', 'T'],
        score: 0,
      },
    })

    window.localStorage.setItem(
      HIGH_SCORES_STORAGE_KEY,
      JSON.stringify([
        {
          achievedAt: '2026-04-01T12:00:00.000Z',
          initials: 'AAA',
          score: 20000,
        },
      ])
    )

    render(<App />)

    expect(screen.getByRole('heading', { name: APP_TITLE })).toBeInTheDocument()
    expect(screen.getByText("Drop in when you're ready.")).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'View Leaderboard' }))

    expect(screen.getByRole('region', { name: 'High scores' })).toBeInTheDocument()
    expect(screen.getByText('AAA')).toBeInTheDocument()
    expect(screen.getByText('20,000')).toBeInTheDocument()
  }, 30000)

  it('starts a run and renders the gameplay layout without reloading', () => {
    mockedUseGame.mockReturnValue({
      actions: mockActions,
      dispatch: mockDispatch,
      state: {
        activePiece: { position: { x: 4, y: 0 }, rotation: 0, type: 'T' },
        board: Array.from({ length: 20 }, () => Array.from({ length: 10 }, () => null)),
        level: 3,
        linesCleared: 18,
        phase: 'paused',
        queue: ['I', 'O', 'T'],
        score: 4200,
      },
    })

    render(<App />)

    fireEvent.click(screen.getAllByRole('button', { name: 'Start Game' })[0])

    expect(mockActions.restart).toHaveBeenCalled()
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'RESTART', rng: undefined })
    expect(screen.getByLabelText('Tetris board')).toBeInTheDocument()
    expect(screen.getByRole('region', { name: 'Game stats' })).toBeInTheDocument()
    expect(screen.getByLabelText('Next piece preview')).toBeInTheDocument()
  }, 30000)

  it('shows the game-over route with leaderboard navigation and restart without reload', () => {
    mockedUseGame.mockReturnValue({
      actions: mockActions,
      dispatch: mockDispatch,
      state: {
        activePiece: { position: { x: 4, y: 0 }, rotation: 0, type: 'T' },
        board: Array.from({ length: 20 }, () => Array.from({ length: 10 }, () => null)),
        level: 5,
        linesCleared: 32,
        phase: 'gameOver',
        queue: ['I', 'O', 'T'],
        score: 18450,
      },
    })

    render(<App />)

    fireEvent.click(screen.getAllByRole('button', { name: 'Start Game' })[0])

    expect(screen.getByRole('dialog', { name: 'Game over' })).toBeInTheDocument()

    const dialog = screen.getByRole('dialog', { name: 'Game over' })

    fireEvent.click(within(dialog).getByRole('button', { name: 'High Scores' }))

    expect(screen.getByRole('region', { name: 'High scores' })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Start New Run' }))

    expect(mockActions.restart).toHaveBeenCalledTimes(2)
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'RESTART', rng: undefined })
  }, 30000)
})
