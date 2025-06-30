import { registerSW } from 'virtual:pwa-register'
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import './i18n'
registerSW()
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
