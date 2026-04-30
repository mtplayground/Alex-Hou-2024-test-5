import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ControlsPanel } from './ControlsPanel'

describe('ControlsPanel', () => {
  it('renders the expected control bindings', () => {
    render(<ControlsPanel />)

    const panel = screen.getByRole('region', { name: 'Controls' })

    expect(within(panel).getByText('Move left')).toBeInTheDocument()
    expect(within(panel).getByText('Move right')).toBeInTheDocument()
    expect(within(panel).getByText('Rotate')).toBeInTheDocument()
    expect(within(panel).getByText('Soft drop')).toBeInTheDocument()
    expect(within(panel).getByText('Hard drop')).toBeInTheDocument()
    expect(within(panel).getByText('Pause')).toBeInTheDocument()
    expect(within(panel).getByText('Restart')).toBeInTheDocument()

    expect(within(panel).getByText('←')).toBeInTheDocument()
    expect(within(panel).getByText('→')).toBeInTheDocument()
    expect(within(panel).getByText('↑')).toBeInTheDocument()
    expect(within(panel).getByText('↓')).toBeInTheDocument()
    expect(within(panel).getByText('Space')).toBeInTheDocument()
    expect(within(panel).getByText('P')).toBeInTheDocument()
    expect(within(panel).getByText('R')).toBeInTheDocument()
  })
})
