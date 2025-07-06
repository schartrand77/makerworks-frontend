import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from '@/App'
import ErrorBoundary from '@/components/system/ErrorBoundary'
import '@/index.css'

function mountApp(): void {
  try {
    console.debug('[MakerWorks] Mounting App...')
    const rootElement = document.getElementById('root')

    if (!rootElement) {
      console.error('[MakerWorks] ❌ No #root element found in DOM.')
      throw new Error('No #root element found')
    }

    console.debug('[MakerWorks] ✅ Found root element:', rootElement)

    // Log environment variables (sanitized)
    console.debug('[MakerWorks] ENV:', {
      VITE_AUTHENTIK_LOGIN_URL: import.meta.env.VITE_AUTHENTIK_LOGIN_URL,
      VITE_AUTHENTIK_REGISTER_URL: import.meta.env.VITE_AUTHENTIK_REGISTER_URL,
      MODE: import.meta.env.MODE,
    })

    createRoot(rootElement).render(
      <StrictMode>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </StrictMode>
    )

    console.debug('[MakerWorks] ✅ App render initialized.')
  } catch (error) {
    console.error('[MakerWorks] ❌ Failed to mount App:', error)
    const fallback = document.createElement('div')
    fallback.style.color = 'red'
    fallback.style.fontFamily = 'monospace'
    fallback.style.margin = '2rem'
    fallback.innerText = '⚠️ MakerWorks frontend failed to load. Check the browser console for details.'
    document.body.appendChild(fallback)
  }
}

mountApp()
