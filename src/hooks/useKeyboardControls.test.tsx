import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { GameAction } from '../engine/reducer'
import {
  INITIAL_REPEAT_DELAY_MS,
  REPEAT_INTERVAL_MS,
  useKeyboardControls,
  type KeyboardActions,
} from './useKeyboardControls'

function createAction(type: GameAction['type']): GameAction {
  switch (type) {
    case 'MOVE_LEFT':
    case 'MOVE_RIGHT':
    case 'ROTATE_CLOCKWISE':
    case 'SOFT_DROP':
    case 'TOGGLE_PAUSE':
      return { type }
    case 'HARD_DROP':
    case 'RESTART':
      return { type, rng: undefined }
    default:
      throw new Error(`Unsupported action type in test: ${type}`)
  }
}

function createKeyboardActions(): KeyboardActions {
  return {
    hardDrop: () => createAction('HARD_DROP'),
    moveLeft: () => createAction('MOVE_LEFT'),
    moveRight: () => createAction('MOVE_RIGHT'),
    restart: () => createAction('RESTART'),
    rotateClockwise: () => createAction('ROTATE_CLOCKWISE'),
    softDrop: () => createAction('SOFT_DROP'),
    togglePause: () => createAction('TOGGLE_PAUSE'),
  }
}

describe('useKeyboardControls', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('dispatches single-fire controls on keydown', () => {
    const dispatch = vi.fn()

    renderHook(() =>
      useKeyboardControls({
        actions: createKeyboardActions(),
        dispatch,
      })
    )

    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { code: 'ArrowUp' }))
      window.dispatchEvent(new KeyboardEvent('keydown', { code: 'Space' }))
      window.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyP' }))
      window.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyR' }))
    })

    expect(dispatch.mock.calls.map(([action]) => action.type)).toEqual([
      'ROTATE_CLOCKWISE',
      'HARD_DROP',
      'TOGGLE_PAUSE',
      'RESTART',
    ])
  })

  it('does not repeat single-fire controls for repeated keydown events', () => {
    const dispatch = vi.fn()

    renderHook(() =>
      useKeyboardControls({
        actions: createKeyboardActions(),
        dispatch,
      })
    )

    act(() => {
      window.dispatchEvent(
        new KeyboardEvent('keydown', { code: 'ArrowUp', repeat: true })
      )
      window.dispatchEvent(
        new KeyboardEvent('keydown', { code: 'Space', repeat: true })
      )
      window.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyP', repeat: true }))
      window.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyR', repeat: true }))
    })

    expect(dispatch).not.toHaveBeenCalled()
  })

  it('applies DAS-style repeat timing for left, right, and down', () => {
    const dispatch = vi.fn()

    renderHook(() =>
      useKeyboardControls({
        actions: createKeyboardActions(),
        dispatch,
      })
    )

    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { code: 'ArrowLeft' }))
    })

    expect(dispatch.mock.calls.map(([action]) => action.type)).toEqual(['MOVE_LEFT'])

    act(() => {
      vi.advanceTimersByTime(INITIAL_REPEAT_DELAY_MS - 1)
    })

    expect(dispatch).toHaveBeenCalledTimes(1)

    act(() => {
      vi.advanceTimersByTime(1 + REPEAT_INTERVAL_MS * 2)
    })

    expect(dispatch.mock.calls.map(([action]) => action.type)).toEqual([
      'MOVE_LEFT',
      'MOVE_LEFT',
      'MOVE_LEFT',
    ])

    act(() => {
      window.dispatchEvent(new KeyboardEvent('keyup', { code: 'ArrowLeft' }))
      vi.advanceTimersByTime(REPEAT_INTERVAL_MS * 3)
    })

    expect(dispatch).toHaveBeenCalledTimes(3)
  })

  it('keeps only one repeater active per key until keyup', () => {
    const dispatch = vi.fn()

    renderHook(() =>
      useKeyboardControls({
        actions: createKeyboardActions(),
        dispatch,
      })
    )

    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { code: 'ArrowDown' }))
      window.dispatchEvent(new KeyboardEvent('keydown', { code: 'ArrowDown' }))
      vi.advanceTimersByTime(INITIAL_REPEAT_DELAY_MS + REPEAT_INTERVAL_MS)
    })

    expect(dispatch.mock.calls.map(([action]) => action.type)).toEqual([
      'SOFT_DROP',
      'SOFT_DROP',
    ])
  })

  it('stops all repeaters when the window blurs', () => {
    const dispatch = vi.fn()

    renderHook(() =>
      useKeyboardControls({
        actions: createKeyboardActions(),
        dispatch,
      })
    )

    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { code: 'ArrowRight' }))
      vi.advanceTimersByTime(INITIAL_REPEAT_DELAY_MS)
      window.dispatchEvent(new Event('blur'))
      vi.advanceTimersByTime(REPEAT_INTERVAL_MS * 3)
    })

    expect(dispatch.mock.calls.map(([action]) => action.type)).toEqual([
      'MOVE_RIGHT',
    ])
  })
})
