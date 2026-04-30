import { render } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createEmptyBoard } from '../engine/board'
import type { ActivePiece } from '../types/game'
import { BoardCanvas } from './BoardCanvas'
import { TETROMINO_COLORS } from './boardCanvasTheme'

interface DrawOperation {
  fillStyle: string
  globalAlpha: number
  x: number
  y: number
}

function createPiece(overrides: Partial<ActivePiece> = {}): ActivePiece {
  return {
    type: 'T',
    rotation: 0,
    position: { x: 4, y: 0 },
    ...overrides,
  }
}

describe('BoardCanvas', () => {
  const drawOperations: DrawOperation[] = []
  const clearRect = vi.fn()

  beforeEach(() => {
    drawOperations.length = 0
    clearRect.mockReset()

    const context = {
      clearRect,
      fillRect(x: number, y: number) {
        drawOperations.push({
          fillStyle: this.fillStyle,
          globalAlpha: this.globalAlpha,
          x,
          y,
        })
      },
      fillStyle: '',
      get globalAlpha() {
        return this._globalAlpha ?? 1
      },
      set globalAlpha(value: number) {
        this._globalAlpha = value
      },
      _globalAlpha: 1,
    }

    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(
      context as unknown as CanvasRenderingContext2D
    )
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('draws settled cells, the active piece, and a ghost piece', () => {
    const board = createEmptyBoard()
    board[19][0] = 'L'

    render(<BoardCanvas activePiece={createPiece()} board={board} cellSize={16} />)

    const settledDraws = drawOperations.filter(
      (operation) => operation.fillStyle === TETROMINO_COLORS.L
    )
    const activeDraws = drawOperations.filter(
      (operation) =>
        operation.fillStyle === TETROMINO_COLORS.T && operation.globalAlpha === 1
    )
    const ghostDraws = drawOperations.filter(
      (operation) =>
        operation.fillStyle === TETROMINO_COLORS.T && operation.globalAlpha < 1
    )

    expect(clearRect).toHaveBeenCalledTimes(1)
    expect(settledDraws.length).toBe(1)
    expect(activeDraws.length).toBe(4)
    expect(ghostDraws.length).toBe(4)
  })

  it('redraws the canvas when the state changes', () => {
    const board = createEmptyBoard()
    const firstPiece = createPiece()
    const nextPiece = createPiece({ position: { x: 4, y: 1 } })
    const { rerender } = render(
      <BoardCanvas activePiece={firstPiece} board={board} cellSize={16} />
    )

    expect(clearRect).toHaveBeenCalledTimes(1)

    rerender(<BoardCanvas activePiece={nextPiece} board={board} cellSize={16} />)

    expect(clearRect).toHaveBeenCalledTimes(2)
  })
})
