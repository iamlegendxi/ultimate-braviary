import './App.css'

export default function App() {
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
          <button className="cta-button">Get Started</button>
        </div>
      </main>
    </div>
  )
}