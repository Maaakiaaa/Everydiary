import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Home from './pages/Home'
import DayView from './pages/DayView'
import Settings from './pages/Settings'
import Episode from './pages/Episode'

function DayItem({ item, onToggle }) {
  return (
    <div className={`day-item ${item.done ? 'done' : ''}`} onClick={() => onToggle(item.id)}>
      <div className="checkbox">{item.done ? '✓' : ''}</div>
      <div className="content">
        <div className="title">{item.title}</div>
        {item.note && <div className="note">{item.note}</div>}
      </div>
      <div className="meta">{item.date}</div>
    </div>
  )
}

function App() {
  const [days] = useState(() => {
    // sample days for UI
    const today = new Date()
    const fmt = (d) => d.toLocaleDateString()
    return [
      { id: 'd3', label: fmt(new Date(today.getTime() - 2 * 24 * 3600 * 1000)) },
      { id: 'd2', label: fmt(new Date(today.getTime() - 1 * 24 * 3600 * 1000)) },
      { id: 'd1', label: fmt(today) },
      { id: 'd0', label: fmt(new Date(today.getTime() + 1 * 24 * 3600 * 1000)) },
    ]
  })

  const [selectedDay, setSelectedDay] = useState(days[2].id)
  const [title, setTitle] = useState(() => {
    try {
      return localStorage.getItem('everydiary:title') || 'EveryDiary'
    } catch (e) {
      return 'EveryDiary'
    }
  })

  function onChangeTitle(e) {
    const v = e.target.value
    setTitle(v)
    try {
      localStorage.setItem('everydiary:title', v)
    } catch (e) {
      // ignore
    }
  }

  // items persisted to localStorage under key 'everydiary:items'
  const [items, setItems] = useState(() => {
    try {
      const raw = localStorage.getItem('everydiary:items')
      if (raw) return JSON.parse(raw)
    } catch (e) {
      // ignore parse errors
    }
    return []
  })

  useEffect(() => {
    try {
      localStorage.setItem('everydiary:items', JSON.stringify(items))
    } catch (e) {
      // ignore
    }
  }, [items])

  function toggleDone(id) {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, done: !it.done } : it)))
  }

  // addItem accepts title and date (YYYY-MM-DD); time removed
  function addItem(title = '新しい出来事', date = new Date().toISOString().slice(0, 10)) {
    const nextId = Math.max(0, ...items.map((i) => i.id)) + 1
    const newItem = { id: nextId, title, note: '', date, done: false }
    setItems((prev) => [newItem, ...prev])
  }

  function deleteItem(id) {
    setItems((prev) => prev.filter((it) => it.id !== id))
  }

  function editItem(id, patch) {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, ...patch } : it)))
  }

  // Small Header component that can use the router location hook
  function AppHeader({ title, onChangeTitle }) {
    const location = useLocation()
    const isHome = location.pathname === '/'
    const todayLabel = new Date().toLocaleDateString()

    return (
      <header className="app-header">
        <div className="branding">
          <img src={viteLogo} className="logo" alt="Vite logo" />
          <div className="home-branding">
            <h1 className="home-title">目標と記録</h1>
            <div className="home-sub">日々の目標と記録をつける</div>
          </div>
        </div>
        <nav className="header-nav">
          <Link to="/" className="nav-link">
           <img src="/public/Home.png" alt="Home" style={{ width: '24px', height: '24px' }} />
          </Link>
          <Link to="/day" className="nav-link">
            <img src="/public/Plus circle.png" alt="Plus circle" style={{ width: '24px', height: '24px' }} />
          </Link>
          <Link to="/episode" className="nav-link">
            <img src="/public/comment.png" alt="Episode" style={{ width: '24px', height: '24px' }} />
          </Link>
          <Link to="/settings" className="nav-link">
            <img src="/public/settig.png" alt="Settings" style={{ width: '24px', height: '24px' }} />
          </Link>
        </nav>
        <div className="header-right">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </div>
      </header>
    )
  }

  return (
    <BrowserRouter>
      <div className="app-root">
        <AppHeader title={title} onChangeTitle={onChangeTitle} />

        <main className="main">
          <Routes>
            <Route path="/" element={<Home items={items} onToggle={toggleDone} onAdd={addItem} onDelete={deleteItem} onEdit={editItem} showAdd={false} showRemaining={true} listAll={true} showDatePicker={false} />} />
            <Route path="/day" element={<DayView items={items} onToggle={toggleDone} onAdd={addItem} onDelete={deleteItem} onEdit={editItem} />} />
            <Route path="/episode" element={<Episode />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
