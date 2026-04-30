import type { TetrominoType } from '../types/game'

export const BOARD_BACKGROUND = '#06101d'

export const TETROMINO_COLORS: Readonly<Record<TetrominoType, string>> = {
  I: '#5ee4ff',
  O: '#ffd166',
  T: '#b794f6',
  S: '#4ee6a3',
  Z: '#ff6b87',
  J: '#6f9bff',
  L: '#ff9f5c',
}
