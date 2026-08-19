import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AuthProvider } from './context/AuthContext'
import { GhostProvider } from './context/GhostContext'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <GhostProvider>
        <App />
      </GhostProvider>
    </AuthProvider>
  </StrictMode>,
)
