import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './index.css'
import App from './pages/App.tsx'
import GenerateTeam from './pages/generate-team.tsx'
import Layout from './pages/Layout.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<App />} />
          <Route path="/generate-team" element={<GenerateTeam />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
