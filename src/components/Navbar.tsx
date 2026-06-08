import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-links">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/faq" className="nav-link">FAQ</Link>
        <Link to="/about" className="nav-link">About</Link>
      </div>
    </nav>
  )
}