import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// One-time migration: clear any old unversioned content store so the new
// versioned localStorage format (with guaranteed live items) initialises cleanly.
const stored = localStorage.getItem('educast_content_store')
if (stored) {
  try {
    const parsed = JSON.parse(stored)
    // Old format had no `version` key — remove it so service re-seeds from mockData
    if (!parsed.version) {
      localStorage.removeItem('educast_content_store')
    }
  } catch {
    localStorage.removeItem('educast_content_store')
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)
