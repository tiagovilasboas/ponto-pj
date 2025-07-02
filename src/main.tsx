import './index.css';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './i18n';
import App from './App.tsx';

// Lazy load CSS não crítico após o primeiro render
const loadNonCriticalCSS = () => {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = '/styles/non-critical.css';
  link.media = 'print';
  link.onload = () => {
    link.media = 'all';
  };
  document.head.appendChild(link);
};

// Carregar CSS não crítico após um delay
setTimeout(loadNonCriticalCSS, 1000);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
