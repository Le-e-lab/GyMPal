import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import { PWA_EVENTS, PWA_GLOBALS } from './constants/pwa'
import './index.css'
import App from './App.jsx'

const updateSW = registerSW({
  immediate: true,
  onNeedRefresh() {
    window.dispatchEvent(new Event(PWA_EVENTS.updateReady))
  },
  onOfflineReady() {
    window.dispatchEvent(new Event(PWA_EVENTS.offlineReady))
  },
})

window[PWA_GLOBALS.applyUpdate] = () => {
  updateSW(true)
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
