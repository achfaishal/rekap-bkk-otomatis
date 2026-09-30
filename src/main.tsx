import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { App } from './App'
import { BkkProvider } from './state/BkkContext'
import './styles.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <BkkProvider>
        <App />
      </BkkProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
