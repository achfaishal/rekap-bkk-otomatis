import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import { App } from './App'
import { BkkProvider } from './state/BkkContext'
import './styles.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HashRouter>
      <BkkProvider>
        <App />
      </BkkProvider>
    </HashRouter>
  </React.StrictMode>,
)
