import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { GameOverModal } from './GameOverModal'

describe('GameOverModal', () => {
  it('renders nothing when not visible', () => {
    const { container } = render(
      <GameOverModal finalScore={1200} onPlayAgain={() => {}} visible={false} />
    )

    expect(container).toBeEmptyDOMElement()
  })

  it('renders the final score and play again action when visible', () => {
    const onPlayAgain = vi.fn()

    render(
      <GameOverModal finalScore={18450} onPlayAgain={onPlayAgain} visible />
    )

    expect(screen.getByRole('dialog', { name: 'Game over' })).toBeInTheDocument()
    expect(screen.getByText('18,450')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Play Again' }))

    expect(onPlayAgain).toHaveBeenCalledTimes(1)
  }, 15000)
})
