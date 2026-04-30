import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { HIGH_SCORES_STORAGE_KEY, type StorageLike } from '../lib/highScores'
import { GameOverModal } from './GameOverModal'

class MemoryStorage implements StorageLike {
  private readonly values = new Map<string, string>()

  getItem(key: string): string | null {
    return this.values.get(key) ?? null
  }

  setItem(key: string, value: string): void {
    this.values.set(key, value)
  }
}

describe('GameOverModal', () => {
  afterEach(() => {
    cleanup()
  })

  it('renders nothing when not visible', () => {
    const { container } = render(
      <GameOverModal finalScore={1200} onPlayAgain={() => {}} visible={false} />
    )

    expect(container).toBeEmptyDOMElement()
  })

  it('renders the final score and play again action when visible', () => {
    const onPlayAgain = vi.fn()
    const onViewHighScores = vi.fn()

    render(
      <GameOverModal
        finalScore={18450}
        onPlayAgain={onPlayAgain}
        onViewHighScores={onViewHighScores}
        visible
      />
    )

    expect(screen.getByRole('dialog', { name: 'Game over' })).toBeInTheDocument()
    expect(screen.getByText('18,450')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Play Again' }))
    fireEvent.click(screen.getByRole('button', { name: 'High Scores' }))

    expect(onPlayAgain).toHaveBeenCalledTimes(1)
    expect(onViewHighScores).toHaveBeenCalledTimes(1)
  }, 15000)

  it('prompts for initials and persists a qualifying high score', () => {
    const storage = new MemoryStorage()
    const onHighScoresSaved = vi.fn()

    render(
      <GameOverModal
        finalScore={18450}
        highScoreStorage={storage}
        onHighScoresSaved={onHighScoresSaved}
        onPlayAgain={() => {}}
        visible
      />
    )

    const input = screen.getByLabelText('New High Score')

    fireEvent.change(input, { target: { value: 'a1b2c3' } })

    expect((input as HTMLInputElement).value).toBe('ABC')

    fireEvent.click(screen.getByRole('button', { name: 'Save' }))

    expect(screen.getByText('Score saved to the local top 10.')).toBeInTheDocument()
    expect(onHighScoresSaved).toHaveBeenCalledTimes(1)
    expect(storage.getItem(HIGH_SCORES_STORAGE_KEY)).toContain('"initials":"ABC"')
    expect(storage.getItem(HIGH_SCORES_STORAGE_KEY)).toContain('"score":18450')
  }, 15000)

  it('does not prompt when the score does not qualify for a full leaderboard', () => {
    const storage = new MemoryStorage()

    storage.setItem(
      HIGH_SCORES_STORAGE_KEY,
      JSON.stringify(
        Array.from({ length: 10 }, (_, index) => ({
          achievedAt: `2026-03-${String(index + 1).padStart(2, '0')}T12:00:00.000Z`,
          initials: `P${index}`,
          score: 1000 - index * 100,
        }))
      )
    )

    render(
      <GameOverModal
        finalScore={100}
        highScoreStorage={storage}
        onPlayAgain={() => {}}
        visible
      />
    )

    expect(screen.queryByLabelText('New High Score')).not.toBeInTheDocument()
  }, 15000)

  it('re-reads stored scores for later game-over sessions', () => {
    const storage = new MemoryStorage()

    const { rerender } = render(
      <GameOverModal
        finalScore={1200}
        highScoreStorage={storage}
        onPlayAgain={() => {}}
        visible
      />
    )

    expect(screen.getByLabelText('New High Score')).toBeInTheDocument()

    storage.setItem(
      HIGH_SCORES_STORAGE_KEY,
      JSON.stringify(
        Array.from({ length: 10 }, (_, index) => ({
          achievedAt: `2026-04-${String(index + 1).padStart(2, '0')}T12:00:00.000Z`,
          initials: `P${index}`,
          score: 2000 - index * 100,
        }))
      )
    )

    rerender(
      <GameOverModal
        finalScore={100}
        highScoreStorage={storage}
        onPlayAgain={() => {}}
        visible
      />
    )

    expect(screen.queryByLabelText('New High Score')).not.toBeInTheDocument()
  }, 15000)
})
