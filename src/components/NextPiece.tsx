import { useEffect, useRef } from 'react'
import { getTetrominoCells, getTetrominoMatrix } from '../engine/tetrominoes'
import type { RotationIndex, TetrominoType } from '../types/game'
import { BOARD_BACKGROUND, TETROMINO_COLORS } from './boardCanvasTheme'

const CELL_PADDING = 1
const DEFAULT_CELL_SIZE = 24
const PREVIEW_GRID_SIZE = 4

export interface NextPieceProps {
  cellSize?: number
  className?: string
  rotation?: RotationIndex
  tetrominoType: TetrominoType
}

export function NextPiece({
  cellSize = DEFAULT_CELL_SIZE,
  className,
  rotation = 0,
  tetrominoType,
}: NextPieceProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const width = PREVIEW_GRID_SIZE * cellSize
  const height = PREVIEW_GRID_SIZE * cellSize

  useEffect(() => {
    const canvas = canvasRef.current

    if (!canvas) {
      return
    }

    const context = canvas.getContext('2d')

    if (!context) {
      return
    }

    const matrix = getTetrominoMatrix(tetrominoType, rotation)
    const cells = getTetrominoCells(tetrominoType, rotation)
    const offsetX = Math.floor((PREVIEW_GRID_SIZE - matrix[0].length) / 2)
    const offsetY = Math.floor((PREVIEW_GRID_SIZE - matrix.length) / 2)

    context.clearRect(0, 0, width, height)
    context.fillStyle = BOARD_BACKGROUND
    context.fillRect(0, 0, width, height)
    context.fillStyle = TETROMINO_COLORS[tetrominoType]

    for (const cell of cells) {
      context.fillRect(
        (cell.x + offsetX) * cellSize + CELL_PADDING,
        (cell.y + offsetY) * cellSize + CELL_PADDING,
        cellSize - CELL_PADDING * 2,
        cellSize - CELL_PADDING * 2
      )
    }
  }, [cellSize, height, rotation, tetrominoType, width])

  return (
    <canvas
      ref={canvasRef}
      aria-label="Next piece preview"
      className={className}
      height={height}
      width={width}
    />
  )
}

export default NextPiece
