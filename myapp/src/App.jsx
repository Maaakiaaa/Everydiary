import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function DayItem({ item, onToggle }) {
  return (
    <div className={`day-item ${item.done ? 'done' : ''}`} onClick={() => onToggle(item.id)}>
      <div className="checkbox">{item.done ? '✓' : ''}</div>
      <div className="content">
        <div className="title">{item.title}</div>
        {item.note && <div className="note">{item.note}</div>}
      </div>
      <div className="meta">{item.time}</div>
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

  const [items, setItems] = useState([
    { id: 1, title: '出社・仕事', note: '朝礼とメール確認', time: '09:00', done: false },
    { id: 2, title: 'ランチの買い出し', note: '', time: '12:10', done: true },
    { id: 3, title: '勉強: React レイアウト', note: 'UI ワイヤーに合わせる', time: '20:00', done: false },
  ])

  function toggleDone(id) {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, done: !it.done } : it)))
  }

  function addItem() {
    const nextId = Math.max(0, ...items.map((i) => i.id)) + 1
    setItems((prev) => [{ id: nextId, title: '新しい出来事', note: '', time: '00:00', done: false }, ...prev])
  }

  return (
    <div className="app-root">
      <header className="app-header">
        <div className="branding">
          <img src={viteLogo} className="logo" alt="Vite logo" />
          <input className="title-input" value={title} onChange={onChangeTitle} />
        </div>
        <div className="header-right">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </div>
      </header>

      <div className="layout">
        <aside className="sidebar">
          <div className="day-list">
            {days.map((d) => (
              <button key={d.id} className={`day-btn ${selectedDay === d.id ? 'active' : ''}`} onClick={() => setSelectedDay(d.id)}>
                {d.label}
              </button>
            ))}
          </div>
        </aside>

        <main className="main">
          <section className="day-card">
            <div className="card-header">
              <h2>今日の出来事</h2>
              <div className="card-actions">
                <button className="add-btn" onClick={addItem}>＋ 追加</button>
              </div>
            </div>

            <div className="card-body">
              {items.length === 0 ? (
                <div className="empty">この日は記録がありません</div>
              ) : (
                <div className="items">
                  {items.map((it) => (
                    <DayItem key={it.id} item={it} onToggle={toggleDone} />
                  ))}
                </div>
              )}
            </div>

            <div className="card-footer">下にスワイプで過去／未来を確認</div>
          </section>
        </main>
      </div>
    </div>
  )
}

export default App
