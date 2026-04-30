import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('App', () => {
  it('renders the baseline application message and tailwind utility classes', () => {
    render(<App />)

    expect(
      screen.getByRole('heading', { name: 'Alex Hou 2024 Test 5' })
    ).toBeInTheDocument()
    expect(
      screen.getByText('Vite, React, TypeScript, and Tailwind CSS are initialized.')
    ).toBeInTheDocument()
    expect(screen.getByText('Tailwind Ready')).toHaveClass('bg-cyan-400')
  })
})
