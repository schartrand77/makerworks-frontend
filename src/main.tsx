import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import App from '@/App';
import ErrorBoundary from '@/components/system/ErrorBoundary';
import { ToastProvider } from '@/context/ToastProvider';
import { UserProvider } from '@/context/UserContext';
import queryClient from '@/api/queryClient';
import '@/index.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error('[MakerWorks] ❌ No #root element found in DOM.');
  const fallback = document.createElement('div');
  fallback.style.color = 'red';
  fallback.style.fontFamily = 'monospace';
  fallback.style.margin = '2rem';
  fallback.innerText =
    '⚠️ MakerWorks frontend failed to load. Check the browser console for details.';
  document.body.appendChild(fallback);
  throw new Error('No #root element found');
}

console.debug('[MakerWorks] ✅ Found root element:', rootElement);

createRoot(rootElement).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <UserProvider>
          <ToastProvider>
            <ErrorBoundary>
              <App />
            </ErrorBoundary>
          </ToastProvider>
        </UserProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>
);

console.debug('[MakerWorks] ✅ App render initialized.');
