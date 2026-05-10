/**
 * Application entry point (Vite + React).
 *
 * - `createRoot` (React 18+) mounts the tree into `public/index.html`’s `<div id="root">`.
 * - `StrictMode` enables extra checks in development (e.g. effects may run twice) to surface
 *   unsafe patterns; it has no production performance impact beyond tree creation.
 * - Global styles load once here so tokens (`:root`, `[data-theme]`) apply before paint.
 */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './styles/globals.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
