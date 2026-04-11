import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import './index.css'
import FinanceFlowStandalone from './FinanceFlowStandalone.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <FinanceFlowStandalone />
    </HashRouter>
  </StrictMode>,
)
