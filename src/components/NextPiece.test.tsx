import { render } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { BOARD_BACKGROUND, TETROMINO_COLORS } from './boardCanvasTheme'
import { NextPiece } from './NextPiece'

interface DrawOperation {
  fillStyle: string
  x: number
  y: number
}

describe('NextPiece', () => {
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
          x,
          y,
        })
      },
      fillStyle: '',
    }

    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(
      context as unknown as CanvasRenderingContext2D
    )
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('draws the upcoming tetromino in a centered preview canvas', () => {
    render(<NextPiece tetrominoType="O" cellSize={16} />)

    const backgroundDraws = drawOperations.filter(
      (operation) => operation.fillStyle === BOARD_BACKGROUND
    )
    const pieceDraws = drawOperations.filter(
      (operation) => operation.fillStyle === TETROMINO_COLORS.O
    )

    expect(clearRect).toHaveBeenCalledTimes(1)
    expect(backgroundDraws.length).toBe(1)
    expect(pieceDraws.length).toBe(4)
  })

  it('redraws when the previewed piece changes', () => {
    const { rerender } = render(<NextPiece tetrominoType="I" cellSize={16} />)

    expect(clearRect).toHaveBeenCalledTimes(1)

    rerender(<NextPiece tetrominoType="T" cellSize={16} />)

    expect(clearRect).toHaveBeenCalledTimes(2)
  })
})
