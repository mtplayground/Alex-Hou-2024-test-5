import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { PauseOverlay } from './PauseOverlay'

describe('PauseOverlay', () => {
  it('renders nothing when not visible', () => {
    const { container } = render(<PauseOverlay visible={false} />)

    expect(container).toBeEmptyDOMElement()
  })

  it('renders the paused overlay when visible', () => {
    render(<PauseOverlay visible />)

    expect(screen.getByRole('status', { name: 'Paused' })).toBeInTheDocument()
    expect(screen.getByText('Game On Hold')).toBeInTheDocument()
  })
})
