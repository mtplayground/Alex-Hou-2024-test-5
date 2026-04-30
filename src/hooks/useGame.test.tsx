import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useGame } from './useGame'

function createDeterministicRng(values: number[]): () => number {
  let index = 0

  return () => {
    const value = values[index] ?? 0
    index += 1
    return value
  }
}

describe('useGame', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('creates reducer-backed initial state', () => {
    const { result } = renderHook(() =>
      useGame({ rng: createDeterministicRng([0, 0, 0, 0, 0, 0, 0]) })
    )

    expect(result.current.state.phase).toBe('playing')
    expect(result.current.state.level).toBe(1)
    expect(result.current.state.queue.length).toBeGreaterThan(0)
  })

  it('dispatches reducer actions through the hook', () => {
    const { result } = renderHook(() =>
      useGame({ rng: createDeterministicRng([0, 0, 0, 0, 0, 0, 0]) })
    )

    const startX = result.current.state.activePiece.position.x

    act(() => {
      result.current.dispatch(result.current.actions.moveLeft())
    })

    expect(result.current.state.activePiece.position.x).toBe(startX - 1)
  })

  it('advances gravity on the level-based interval', () => {
    const { result } = renderHook(() =>
      useGame({ rng: createDeterministicRng([0, 0, 0, 0, 0, 0, 0]) })
    )

    const startY = result.current.state.activePiece.position.y

    act(() => {
      vi.advanceTimersByTime(1000)
    })

    expect(result.current.state.activePiece.position.y).toBe(startY + 1)
  })

  it('restarts with a fresh game state', () => {
    const { result } = renderHook(() =>
      useGame({ rng: createDeterministicRng([0, 0, 0, 0, 0, 0, 0]) })
    )

    act(() => {
      result.current.dispatch(result.current.actions.hardDrop())
    })

    expect(result.current.state.score).toBeGreaterThan(0)

    act(() => {
      result.current.dispatch(result.current.actions.restart())
    })

    expect(result.current.state.score).toBe(0)
    expect(result.current.state.linesCleared).toBe(0)
    expect(result.current.state.level).toBe(1)
    expect(result.current.state.phase).toBe('playing')
  })
})
