import { useEffect, useState } from 'react'
import './App.css'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const DEFAULT_TRADE_SKILLS = [
  'Plumbing',
  'Electrical',
  'Carpentry',
  'Painting',
  'Bricklaying',
  'Tiling',
  'Roofing',
  'Welding',
  'Landscaping',
  'Appliance repair',
  'HVAC',
  'Solar installation',
]

const AREA_OPTIONS = [
  { key: 'kayamandi', name: 'Kayamandi, Stellenbosch', latitude: -33.9218, longitude: 18.8513 },
  { key: 'cloetesville', name: 'Cloetesville, Stellenbosch', latitude: -33.9158, longitude: 18.8598 },
  { key: 'idash-valley', name: 'Idas Valley, Stellenbosch', latitude: -33.9251, longitude: 18.8648 },
  { key: 'mbekweni', name: 'Mbekweni, Paarl', latitude: -33.7069, longitude: 18.9915 },
  { key: 'paarl-east', name: 'Paarl East', latitude: -33.7321, longitude: 18.9957 },
  { key: 'newton', name: 'Newton, Wellington', latitude: -33.6506, longitude: 19.0062 },
]

const INITIAL_REGISTER_FORM = {
  username: '',
  email: '',
  first_name: '',
  last_name: '',
  password: '',
  location_name: AREA_OPTIONS[0].name,
  latitude: AREA_OPTIONS[0].latitude,
  longitude: AREA_OPTIONS[0].longitude,
  looking_for: '',
}

const INITIAL_PROFILE_FORM = {
  email: '',
  first_name: '',
  last_name: '',
  location_name: AREA_OPTIONS[0].name,
  latitude: AREA_OPTIONS[0].latitude,
  longitude: AREA_OPTIONS[0].longitude,
  skills: [],
  looking_for: '',
}

function App() {
  const [view, setView] = useState('login')
  const [tradeSkills, setTradeSkills] = useState(DEFAULT_TRADE_SKILLS)
  const [registerForm, setRegisterForm] = useState(INITIAL_REGISTER_FORM)
  const [profileForm, setProfileForm] = useState(INITIAL_PROFILE_FORM)
  const [loginForm, setLoginForm] = useState({ username: '', password: '' })
  const [selectedLocation, setSelectedLocation] = useState(AREA_OPTIONS[0].key)
  const [selectedSkills, setSelectedSkills] = useState([])
  const [session, setSession] = useState(null)
  const [matches, setMatches] = useState([])
  const [skillSearch, setSkillSearch] = useState('')
  const [clientSkillFilter, setClientSkillFilter] = useState('')
  const [formError, setFormError] = useState('')
  const [matchStatus, setMatchStatus] = useState('')
  const [profileStatus, setProfileStatus] = useState('')
  const [isBusy, setIsBusy] = useState(false)
  const [isLocating, setIsLocating] = useState(false)

  const visibleSkills = tradeSkills.filter((skill) =>
    skill.toLowerCase().includes(skillSearch.trim().toLowerCase()),
  )

  useEffect(() => {
    apiRequest('/trade-skills')
      .then((data) => {
        if (Array.isArray(data.skills) && data.skills.length > 0) {
          setTradeSkills(data.skills)
        }
      })
      .catch(() => undefined)
  }, [])

  useEffect(() => {
    if (!session || view !== 'dashboard') {
      return
    }

    const controller = new AbortController()
    const skillQuery =
      session.role === 'client' && clientSkillFilter
        ? `&skill=${encodeURIComponent(clientSkillFilter)}`
        : ''

    setMatchStatus('Loading nearby matches...')

    apiRequest(`/nearby?user_id=${session.id}${skillQuery}`, {
      signal: controller.signal,
    })
      .then((data) => {
        setMatches(data)
        setMatchStatus(data.length ? '' : 'No nearby matches found yet.')
      })
      .catch((error) => {
        if (error.name !== 'AbortError') {
          setMatchStatus(error.message)
        }
      })

    return () => controller.abort()
  }, [clientSkillFilter, session, view])

  function updateRegisterForm(event) {
    const { name, value } = event.target
    setRegisterForm((current) => ({ ...current, [name]: value }))
  }

  function updateProfileForm(event) {
    const { name, value } = event.target
    setProfileForm((current) => ({ ...current, [name]: value }))
  }

  function updateLoginForm(event) {
    const { name, value } = event.target
    setLoginForm((current) => ({ ...current, [name]: value }))
  }

  function chooseLocation(event) {
    const area = AREA_OPTIONS.find((option) => option.key === event.target.value)
    if (!area) {
      return
    }

    setSelectedLocation(area.key)
    setRegisterForm((current) => ({
      ...current,
      location_name: area.name,
      latitude: area.latitude,
      longitude: area.longitude,
    }))
  }

  function chooseProfileLocation(event) {
    const area = AREA_OPTIONS.find((option) => option.name === event.target.value)
    if (!area) {
      return
    }

    setProfileForm((current) => ({
      ...current,
      location_name: area.name,
      latitude: area.latitude,
      longitude: area.longitude,
    }))
  }

  function useCurrentLocation() {
    if (!navigator.geolocation) {
      setFormError('Location is not available in this browser.')
      return
    }

    setFormError('')
    setIsLocating(true)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setSelectedLocation('current')
        setRegisterForm((current) => ({
          ...current,
          location_name: 'Current location',
          latitude: Number(position.coords.latitude.toFixed(6)),
          longitude: Number(position.coords.longitude.toFixed(6)),
        }))
        setIsLocating(false)
      },
      () => {
        setFormError('Location permission was not granted.')
        setIsLocating(false)
      },
    )
  }

  function toggleSkill(skill) {
    setSelectedSkills((current) =>
      current.includes(skill)
        ? current.filter((selectedSkill) => selectedSkill !== skill)
        : [...current, skill],
    )
  }

  function toggleProfileSkill(skill) {
    setProfileForm((current) => ({
      ...current,
      skills: current.skills.includes(skill)
        ? current.skills.filter((selectedSkill) => selectedSkill !== skill)
        : [...current.skills, skill],
    }))
  }

  function validateRegisterForm() {
    const requiredFields = [
      'username',
      'email',
      'first_name',
      'last_name',
      'password',
      'location_name',
    ]

    return requiredFields.every((field) => registerForm[field].trim())
  }

  async function chooseRole(role) {
    setFormError('')

    if (!validateRegisterForm()) {
      setFormError('Complete your account and location details first.')
      return
    }

    if (role === 'worker') {
      setView('skills')
      return
    }

    await registerUser({
      ...registerForm,
      role: 'client',
      skills: [],
      looking_for: registerForm.looking_for || null,
    })
  }

  async function registerWorker() {
    setFormError('')

    if (selectedSkills.length === 0) {
      setFormError('Select at least one trade skill.')
      return
    }

    await registerUser({
      ...registerForm,
      role: 'worker',
      skills: selectedSkills,
      looking_for: null,
    })
  }

  async function registerUser(payload) {
    setIsBusy(true)
    try {
      const data = await apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify(payload),
      })
      setSession(data.user)
      setProfileForm(createProfileForm(data.user))
      setMatches([])
      setClientSkillFilter('')
      setView('dashboard')
    } catch (error) {
      setFormError(error.message)
    } finally {
      setIsBusy(false)
    }
  }

  async function login(event) {
    event.preventDefault()
    setFormError('')
    setIsBusy(true)

    try {
      const data = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify(loginForm),
      })
      setSession(data.user)
      setProfileForm(createProfileForm(data.user))
      setMatches([])
      setClientSkillFilter('')
      setView('dashboard')
    } catch (error) {
      setFormError(error.message)
    } finally {
      setIsBusy(false)
    }
  }

  function logout() {
    setSession(null)
    setLoginForm({ username: '', password: '' })
    setMatches([])
    setView('login')
  }

  function openProfile() {
    setFormError('')
    setProfileStatus('')
    setProfileForm(createProfileForm(session))
    setView('profile')
  }

  async function saveProfile(event) {
    event.preventDefault()
    setFormError('')
    setProfileStatus('')

    if (!profileForm.first_name.trim() || !profileForm.last_name.trim() || !profileForm.email.trim()) {
      setFormError('Complete your name and email before saving.')
      return
    }

    if (session.role === 'worker' && profileForm.skills.length === 0) {
      setFormError('Select at least one trade skill.')
      return
    }

    setIsBusy(true)
    try {
      const data = await apiRequest(`/users/${session.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          email: profileForm.email,
          first_name: profileForm.first_name,
          last_name: profileForm.last_name,
          location_name: profileForm.location_name,
          latitude: profileForm.latitude,
          longitude: profileForm.longitude,
          skills: session.role === 'worker' ? profileForm.skills : undefined,
          looking_for: session.role === 'client' ? profileForm.looking_for : undefined,
        }),
      })
      setSession(data.user)
      setProfileForm(createProfileForm(data.user))
      setProfileStatus('Profile saved.')
    } catch (error) {
      setFormError(error.message)
    } finally {
      setIsBusy(false)
    }
  }

  function applySkillSearch() {
    setClientSkillFilter(skillSearch.trim())
  }

  function startRegister() {
    setFormError('')
    setRegisterForm(INITIAL_REGISTER_FORM)
    setSelectedLocation(AREA_OPTIONS[0].key)
    setSelectedSkills([])
    setSkillSearch('')
    setProfileStatus('')
    setView('register')
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <button className="brand-button" type="button" onClick={() => setView(session ? 'dashboard' : 'login')}>
          TRADE TWO
        </button>
        {session ? (
          <div className="session-actions">
            <button className="profile-name-button" type="button" onClick={openProfile}>
              {session.first_name} {session.last_name} · {formatRole(session.role)}
            </button>
            <button className="ghost-button" type="button" onClick={logout}>
              Log out
            </button>
          </div>
        ) : (
          <div className="session-actions">
            <button className="ghost-button" type="button" onClick={() => setView('login')}>
              Login
            </button>
            <button className="primary-button" type="button" onClick={startRegister}>
              Register
            </button>
          </div>
        )}
      </header>

      {view === 'login' && (
        <section className="auth-layout">
          <div className="intro-panel">
            <p className="eyebrow">Local trade network</p>
            <h1>Find nearby work or nearby workers.</h1>
            <p>
              Workers register their trade skills. Clients search for the skill they need and see
              matching workers close to their location.
            </p>
          </div>

          <form className="auth-panel" onSubmit={login}>
            <div>
              <p className="eyebrow">Welcome back</p>
              <h2>Login</h2>
            </div>
            <label>
              Username
              <input
                name="username"
                value={loginForm.username}
                onChange={updateLoginForm}
                placeholder="neo_plumber"
                required
              />
            </label>
            <label>
              Password
              <input
                name="password"
                type="password"
                value={loginForm.password}
                onChange={updateLoginForm}
                placeholder="password"
                required
              />
            </label>
            {formError && <p className="error-text">{formError}</p>}
            <button className="primary-button full-width" disabled={isBusy} type="submit">
              {isBusy ? 'Logging in...' : 'Login'}
            </button>
            <button className="text-button" type="button" onClick={startRegister}>
              Create an account
            </button>
          </form>
        </section>
      )}

      {view === 'register' && (
        <section className="form-screen">
          <div className="screen-heading">
            <p className="eyebrow">Register</p>
            <h1>Create your account</h1>
          </div>

          <div className="form-grid">
            <label>
              First name
              <input
                name="first_name"
                value={registerForm.first_name}
                onChange={updateRegisterForm}
                placeholder="Anele"
              />
            </label>
            <label>
              Last name
              <input
                name="last_name"
                value={registerForm.last_name}
                onChange={updateRegisterForm}
                placeholder="E."
              />
            </label>
            <label>
              Username
              <input
                name="username"
                value={registerForm.username}
                onChange={updateRegisterForm}
                placeholder="anele_trade"
              />
            </label>
            <label>
              Email
              <input
                name="email"
                type="email"
                value={registerForm.email}
                onChange={updateRegisterForm}
                placeholder="you@example.com"
              />
            </label>
            <label>
              Password
              <input
                name="password"
                type="password"
                value={registerForm.password}
                onChange={updateRegisterForm}
                placeholder="Choose a password"
              />
            </label>
            <label>
              Area
              <select value={selectedLocation} onChange={chooseLocation}>
                {selectedLocation === 'current' && <option value="current">Current location</option>}
                {AREA_OPTIONS.map((area) => (
                  <option key={area.key} value={area.key}>
                    {area.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="location-row">
            <button className="ghost-button" type="button" onClick={useCurrentLocation} disabled={isLocating}>
              {isLocating ? 'Finding location...' : 'Use my location'}
            </button>
            <span>{registerForm.location_name}</span>
          </div>

          <label className="wide-label">
            Trade needed
            <select name="looking_for" value={registerForm.looking_for} onChange={updateRegisterForm}>
              <option value="">Not sure yet</option>
              {tradeSkills.map((skill) => (
                <option key={skill} value={skill}>
                  {skill}
                </option>
              ))}
            </select>
          </label>

          {formError && <p className="error-text">{formError}</p>}

          <div className="role-actions">
            <button className="secondary-action" type="button" onClick={() => chooseRole('client')} disabled={isBusy}>
              Continue as client
            </button>
            <button className="primary-button" type="button" onClick={() => chooseRole('worker')}>
              Continue as worker
            </button>
          </div>
        </section>
      )}

      {view === 'skills' && (
        <section className="form-screen">
          <div className="screen-heading">
            <p className="eyebrow">Worker skills</p>
            <h1>Select your trade work</h1>
          </div>

          <div className="skill-grid">
            {tradeSkills.map((skill) => (
              <button
                className={selectedSkills.includes(skill) ? 'skill-chip selected' : 'skill-chip'}
                key={skill}
                type="button"
                onClick={() => toggleSkill(skill)}
              >
                {skill}
              </button>
            ))}
          </div>

          {formError && <p className="error-text">{formError}</p>}

          <div className="role-actions">
            <button className="ghost-button" type="button" onClick={() => setView('register')}>
              Back
            </button>
            <button className="primary-button" type="button" onClick={registerWorker} disabled={isBusy}>
              {isBusy ? 'Creating worker...' : 'Register worker'}
            </button>
          </div>
        </section>
      )}

      {view === 'profile' && session && (
        <form className="form-screen" onSubmit={saveProfile}>
          <div className="screen-heading">
            <p className="eyebrow">Profile</p>
            <h1>Edit profile</h1>
          </div>

          <div className="form-grid">
            <label>
              First name
              <input
                name="first_name"
                value={profileForm.first_name}
                onChange={updateProfileForm}
                placeholder="First name"
              />
            </label>
            <label>
              Last name
              <input
                name="last_name"
                value={profileForm.last_name}
                onChange={updateProfileForm}
                placeholder="Last name"
              />
            </label>
            <label>
              Email
              <input
                name="email"
                type="email"
                value={profileForm.email}
                onChange={updateProfileForm}
                placeholder="you@example.com"
              />
            </label>
            <label>
              Area
              <select value={profileForm.location_name} onChange={chooseProfileLocation}>
                {AREA_OPTIONS.map((area) => (
                  <option key={area.key} value={area.name}>
                    {area.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {session.role === 'worker' ? (
            <div className="profile-section">
              <p className="field-label">Trade skills</p>
              <div className="skill-grid">
                {tradeSkills.map((skill) => (
                  <button
                    className={profileForm.skills.includes(skill) ? 'skill-chip selected' : 'skill-chip'}
                    key={skill}
                    type="button"
                    onClick={() => toggleProfileSkill(skill)}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <label className="wide-label">
              Trade needed
              <select name="looking_for" value={profileForm.looking_for} onChange={updateProfileForm}>
                <option value="">Not sure yet</option>
                {tradeSkills.map((skill) => (
                  <option key={skill} value={skill}>
                    {skill}
                  </option>
                ))}
              </select>
            </label>
          )}

          {formError && <p className="error-text">{formError}</p>}
          {profileStatus && <p className="status-text">{profileStatus}</p>}

          <div className="role-actions">
            <button className="ghost-button" type="button" onClick={() => setView('dashboard')}>
              Back
            </button>
            <button className="primary-button" type="submit" disabled={isBusy}>
              {isBusy ? 'Saving...' : 'Save profile'}
            </button>
          </div>
        </form>
      )}

      {view === 'dashboard' && session && (
        <section className="dashboard">
          <div className="dashboard-heading">
            <div>
              <p className="eyebrow">{session.location_name}</p>
              <h1>
                {session.role === 'worker' ? 'Nearby clients' : 'Nearby workers'}
              </h1>
            </div>
            <div className="profile-summary">
              {session.role === 'worker' ? session.skills.join(', ') : session.looking_for || 'Client'}
            </div>
          </div>

          {session.role === 'client' && (
            <div className="search-panel">
              <label>
                Search by trade skill
                <div className="search-row">
                  <input
                    value={skillSearch}
                    onChange={(event) => setSkillSearch(event.target.value)}
                    placeholder="Electrical, plumbing, painting..."
                  />
                  <button className="primary-button" type="button" onClick={applySkillSearch}>
                    Search
                  </button>
                </div>
              </label>

              <div className="quick-skills">
                {visibleSkills.map((skill) => (
                  <button
                    className={clientSkillFilter === skill ? 'skill-chip selected' : 'skill-chip'}
                    key={skill}
                    type="button"
                    onClick={() => {
                      setSkillSearch(skill)
                      setClientSkillFilter(skill)
                    }}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>
          )}

          {clientSkillFilter && session.role === 'client' && (
            <div className="active-filter">
              Showing workers with <strong>{clientSkillFilter}</strong>
              <button
                className="text-button"
                type="button"
                onClick={() => {
                  setClientSkillFilter('')
                  setSkillSearch('')
                }}
              >
                Clear
              </button>
            </div>
          )}

          {matchStatus && <p className="status-text">{matchStatus}</p>}

          <div className="match-list">
            {matches.map((person) => (
              <article className="person-card" key={person.id}>
                <div>
                  <h2>
                    {person.first_name} {person.last_name}
                  </h2>
                  <a className="person-email" href={`mailto:${person.email}`}>
                    {person.email}
                  </a>
                  <p>{person.location_name} · {person.distance_km} km away</p>
                </div>
                {person.role === 'worker' ? (
                  <div className="mini-skill-list">
                    {person.skills.map((skill) => (
                      <span key={skill}>{skill}</span>
                    ))}
                  </div>
                ) : (
                  <p className="need-label">Needs {person.looking_for || 'trade help'}</p>
                )}
              </article>
            ))}
          </div>
        </section>
      )}
    </main>
  )
}

async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  })

  if (!response.ok) {
    let message = 'Something went wrong.'
    try {
      const data = await response.json()
      message = data.detail || message
    } catch {
      message = response.statusText || message
    }
    throw new Error(message)
  }

  return response.json()
}

function formatRole(role) {
  return role === 'worker' ? 'Worker' : 'Client'
}

function createProfileForm(user) {
  if (!user) {
    return INITIAL_PROFILE_FORM
  }

  return {
    email: user.email || '',
    first_name: user.first_name || '',
    last_name: user.last_name || '',
    location_name: user.location_name || AREA_OPTIONS[0].name,
    latitude: user.latitude ?? AREA_OPTIONS[0].latitude,
    longitude: user.longitude ?? AREA_OPTIONS[0].longitude,
    skills: user.skills || [],
    looking_for: user.looking_for || '',
  }
}

export default App
