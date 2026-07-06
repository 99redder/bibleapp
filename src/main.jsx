import React from 'react'
import ReactDOM from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import App from './App.jsx'
import './index.css'

registerSW({
  onNeedRefresh(updateSW) {
    window.dispatchEvent(new CustomEvent('bible-planner-update-ready', {
      detail: { updateSW }
    }))
  },
  onOfflineReady() {
    // The app shell is ready for offline use.
  }
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
