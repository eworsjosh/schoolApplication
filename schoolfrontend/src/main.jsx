import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import './index.css'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import { AuthProvider } from './portal/auth/AuthProvider.jsx'
import { SchoolConfigProvider } from './portal/auth/SchoolConfigContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <SchoolConfigProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </SchoolConfigProvider>
    </BrowserRouter>
  </StrictMode>,
)
