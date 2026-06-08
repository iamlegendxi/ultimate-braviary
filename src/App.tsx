import './App.css'
import { useState } from 'react'

export default function App() {
  const [showModal, setShowModal] = useState(false)


  return (
    <div className="app">
      <nav className="navbar">
        <div className="nav-links">
          <a href="#" className="nav-link active">Home</a>
          <a href="#" className="nav-link">Profile</a>
          <a href="#" className="nav-link">Options</a>
        </div>
      </nav>

      <main className="hero">
        <div className="hero-content">
          <div className="logo-wrapper">
            <img src="/site_logo.png" alt="Site Logo" className="site-logo" />
          </div>
          <h1 className="hero-title">Welcome to Ultimate Braviary!</h1>
          <p className="hero-subtitle">Big fan of League of Legends' Ultimate Bravery? Want to try it out for Pokemon? Flex on your Pokemon Showdown opponents with a randomized set generated below. </p>
          <button className="cta-button" onClick={() => setShowModal(true)}>Get Started</button>
        </div>
      </main>
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            <p className="modal-description">Consider logging in to keep track of your past teams and matches, or choose Generate Team to get straight to randomizing your team!</p>
            <div className="modal-actions">
              <button className="modal-button">Login</button>
              <button className="modal-button">Generate Team</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}