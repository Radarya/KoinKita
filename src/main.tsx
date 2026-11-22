import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { LanguageProvider } from './lib/LanguageContext.tsx';
import { ErrorBoundary } from './ErrorBoundary.tsx';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { Analytics } from '@vercel/analytics/react';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <LanguageProvider>
        <App />
        <SpeedInsights />
        <Analytics />
      </LanguageProvider>
    </ErrorBoundary>
  </StrictMode>,
);
