export const TETROMINO_TYPES = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'] as const

export type TetrominoType = (typeof TETROMINO_TYPES)[number]

export type RotationIndex = 0 | 1 | 2 | 3

export type CellValue = TetrominoType | null

export interface Point {
  x: number
  y: number
}
