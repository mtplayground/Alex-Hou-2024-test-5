import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { APP_TITLE } from './config/env'
import './index.css'

const container = document.getElementById('root')

if (!container) {
  throw new Error('Root container "#root" was not found.')
}

document.title = APP_TITLE

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
