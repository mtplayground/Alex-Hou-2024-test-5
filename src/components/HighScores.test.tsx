import { cleanup, render, screen, within } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { HighScores } from './HighScores'

describe('HighScores', () => {
  afterEach(() => {
    cleanup()
  })

  it('renders an empty state when there are no stored scores', () => {
    render(<HighScores entries={[]} />)

    const panel = screen.getByRole('region', { name: 'High scores' })

    expect(
      within(panel).getByText('No scores recorded yet. Finish a run to claim the first spot.')
    ).toBeInTheDocument()
  })

  it('renders the stored top scores in a ranked table', () => {
    render(
      <HighScores
        entries={[
          {
            achievedAt: '2026-04-01T12:00:00.000Z',
            initials: 'AAA',
            score: 18450,
          },
          {
            achievedAt: '2026-03-15T12:00:00.000Z',
            initials: 'BEE',
            score: 9200,
          },
        ]}
      />
    )

    const panel = screen.getByRole('region', { name: 'High scores' })

    expect(within(panel).getByText('Rank')).toBeInTheDocument()
    expect(within(panel).getByText('Player')).toBeInTheDocument()
    expect(within(panel).getByText('Score')).toBeInTheDocument()
    expect(within(panel).getByText('Date')).toBeInTheDocument()

    expect(within(panel).getByText('#1')).toBeInTheDocument()
    expect(within(panel).getByText('#2')).toBeInTheDocument()
    expect(within(panel).getByText('AAA')).toBeInTheDocument()
    expect(within(panel).getByText('BEE')).toBeInTheDocument()
    expect(within(panel).getByText('18,450')).toBeInTheDocument()
    expect(within(panel).getByText('9,200')).toBeInTheDocument()
    expect(within(panel).getByText('Apr 01, 2026')).toBeInTheDocument()
    expect(within(panel).getByText('Mar 15, 2026')).toBeInTheDocument()
  })
})
