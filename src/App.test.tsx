import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('App', () => {
  it('renders the baseline application message', () => {
    render(<App />)

    expect(
      screen.getByRole('heading', { name: 'Alex Hou 2024 Test 5' })
    ).toBeInTheDocument()
    expect(
      screen.getByText('Vite, React, and TypeScript are initialized.')
    ).toBeInTheDocument()
  })
})
