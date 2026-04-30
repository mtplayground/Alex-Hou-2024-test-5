import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from './App'
import { APP_TITLE } from './config/env'

describe('App', () => {
  it(
    'renders the configured application title and tailwind utility classes',
    () => {
      render(<App />)

      expect(screen.getByRole('heading', { name: APP_TITLE })).toBeInTheDocument()
      expect(
        screen.getByText('Vite, React, TypeScript, and Tailwind CSS are initialized.')
      ).toBeInTheDocument()
      expect(screen.getByText('Tailwind Ready')).toHaveClass('bg-cyan-400')
    },
    15000
  )
})
