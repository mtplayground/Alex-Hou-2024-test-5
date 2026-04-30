import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Hud } from './Hud'

describe('Hud', () => {
  it('renders the current score, level, and lines cleared', () => {
    render(<Hud level={4} linesCleared={12} score={18450} />)

    const panel = screen.getByRole('region', { name: 'Game stats' })

    expect(within(panel).getByText('Score')).toBeInTheDocument()
    expect(within(panel).getByText('Level')).toBeInTheDocument()
    expect(within(panel).getByText('Lines')).toBeInTheDocument()
    expect(within(panel).getByText('18,450')).toBeInTheDocument()
    expect(within(panel).getByText('4')).toBeInTheDocument()
    expect(within(panel).getByText('12')).toBeInTheDocument()
  })
})
