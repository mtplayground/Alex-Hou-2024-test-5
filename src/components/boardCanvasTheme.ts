import type { TetrominoType } from '../types/game'

export const BOARD_BACKGROUND = '#020617'

export const TETROMINO_COLORS: Readonly<Record<TetrominoType, string>> = {
  I: '#38bdf8',
  O: '#facc15',
  T: '#c084fc',
  S: '#4ade80',
  Z: '#fb7185',
  J: '#60a5fa',
  L: '#fb923c',
}
