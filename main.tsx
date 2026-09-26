import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App'
import { SettingsProvider } from './hooks/useSettings'
import { TimersProvider } from './hooks/useTimers'
import { StopwatchProvider } from './hooks/useStopwatch'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <SettingsProvider>
        <TimersProvider>
          <StopwatchProvider>
            <App />
          </StopwatchProvider>
        </TimersProvider>
      </SettingsProvider>
    </BrowserRouter>
  </StrictMode>
)
