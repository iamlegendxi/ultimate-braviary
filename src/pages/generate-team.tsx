import { useState } from 'react'
import './styles/generate-team.css'

const GENERATIONS = ['1', '2', '3', '4', '5', '6', '7', '8', '9']
const TIERS = ['String1', 'String2', 'String3']

export default function GenerateTeam() {
  const [generation, setGeneration] = useState('')
  const [tier, setTier] = useState('')
  const [checkboxes, setCheckboxes] = useState({
    allowLegendaries: false,
    allowNFE: false,
    forceAttackingMove: false,
  })

  const toggleCheckbox = (key: keyof typeof checkboxes) => {
    setCheckboxes((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <div className="generate-page">
      <nav className="navbar">
        <div className="nav-links">
          <a href="/" className="nav-link">Home</a>
          <a href="/profile" className="nav-link">Profile</a>
          <a href="/options" className="nav-link">Options</a>
        </div>
      </nav>

      <main className="generate-main">
        <div className="generate-container">
          <h1 className="generate-title">Generate your team!</h1>

          <div className="form-card">
            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="generation">Generation</label>
                <div className="select-wrapper">
                  <select
                    id="generation"
                    className="form-select"
                    value={generation}
                    onChange={(e) => setGeneration(e.target.value)}
                  >
                    <option value="" disabled>Select...</option>
                    {GENERATIONS.map((g) => (
                      <option key={g} value={g}>Generation {g}</option>
                    ))}
                  </select>
                  <span className="select-arrow">▾</span>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="tier">Tier</label>
                <div className="select-wrapper">
                  <select
                    id="tier"
                    className="form-select"
                    value={tier}
                    onChange={(e) => setTier(e.target.value)}
                  >
                    <option value="" disabled>Select...</option>
                    {TIERS.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                  <span className="select-arrow">▾</span>
                </div>
              </div>
            </div>

            <div className="form-divider" />

            <div className="checkbox-group">
              {(['allowLegendaries', 'allowNFE', 'forceAttackingMove'] as const).map((key) => (
                <label key={key} className="checkbox-label">
                  <input
                    type="checkbox"
                    className="checkbox-input"
                    checked={checkboxes[key]}
                    onChange={() => toggleCheckbox(key)}
                  />
                  <span className="checkbox-custom" />
                  <span className="checkbox-text">{key}</span>
                </label>
              ))}
            </div>

            <button className="generate-button">
              Generate
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}