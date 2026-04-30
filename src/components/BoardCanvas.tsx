import { useEffect, useRef } from 'react'
import {
  BOARD_HEIGHT,
  BOARD_WIDTH,
  collides,
  getAbsolutePieceCells,
} from '../engine/board'
import type { ActivePiece, Matrix } from '../types/game'
import { BOARD_BACKGROUND, TETROMINO_COLORS } from './boardCanvasTheme'
const CELL_PADDING = 1
const DEFAULT_CELL_SIZE = 32
const GHOST_ALPHA = 0.18

export interface BoardCanvasProps {
  activePiece: ActivePiece
  board: Matrix
  cellSize?: number
  className?: string
}

function getGhostPiece(board: Matrix, activePiece: ActivePiece): ActivePiece {
  let ghostPiece = activePiece

  while (true) {
    const nextGhostPiece: ActivePiece = {
      ...ghostPiece,
      position: {
        ...ghostPiece.position,
        y: ghostPiece.position.y + 1,
      },
    }

    if (collides(board, nextGhostPiece)) {
      return ghostPiece
    }

    ghostPiece = nextGhostPiece
  }
}

export function BoardCanvas({
  activePiece,
  board,
  cellSize = DEFAULT_CELL_SIZE,
  className,
}: BoardCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const width = BOARD_WIDTH * cellSize
  const height = BOARD_HEIGHT * cellSize

  useEffect(() => {
    const canvas = canvasRef.current

    if (!canvas) {
      return
    }

    const context = canvas.getContext('2d')

    if (!context) {
      return
    }

    const ghostPiece = getGhostPiece(board, activePiece)

    context.clearRect(0, 0, width, height)
    context.fillStyle = BOARD_BACKGROUND
    context.fillRect(0, 0, width, height)

    const drawCells = (
      cells: { x: number; y: number }[],
      color: string,
      alpha = 1
    ) => {
      context.fillStyle = color
      context.globalAlpha = alpha

      for (const cell of cells) {
        context.fillRect(
          cell.x * cellSize + CELL_PADDING,
          cell.y * cellSize + CELL_PADDING,
          cellSize - CELL_PADDING * 2,
          cellSize - CELL_PADDING * 2
        )
      }

      context.globalAlpha = 1
    }

    for (let y = 0; y < board.length; y += 1) {
      for (let x = 0; x < board[y].length; x += 1) {
        const cell = board[y][x]

        if (cell === null) {
          continue
        }

        drawCells([{ x, y }], TETROMINO_COLORS[cell])
      }
    }

    drawCells(
      getAbsolutePieceCells(ghostPiece),
      TETROMINO_COLORS[activePiece.type],
      GHOST_ALPHA
    )
    drawCells(getAbsolutePieceCells(activePiece), TETROMINO_COLORS[activePiece.type])
  }, [activePiece, board, cellSize, height, width])

  return (
    <canvas
      ref={canvasRef}
      aria-label="Tetris board"
      className={className}
      height={height}
      width={width}
    />
  )
}

export default BoardCanvas
