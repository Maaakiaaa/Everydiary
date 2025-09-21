import React from 'react'

function DayItem({ item, onToggle, onDelete, showRemaining = false }) {
  // compute days until item's date from today
  let remaining = null
  if (showRemaining && item.date) {
    const today = new Date()
    // normalize to start of day
    const t0 = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    const parts = item.date.split('-')
    const target = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]))
    const diffMs = target - t0
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))
    if (diffDays > 0) {
      remaining = `あと${diffDays}日`
    } else if (diffDays === 0) {
      remaining = `今日`
    }
  }

  return (
    <div className={`day-item ${item.done ? 'done' : ''}`}>
      <div className="checkbox" onClick={() => onToggle(item.id)}>{item.done ? '✓' : ''}</div>
      <div className="content">
        <div className="title">{item.title}</div>
        {item.note && <div className="note">{item.note}</div>}
      </div>
      <div className="meta">
        <span className="time">{item.time}</span>
        {remaining && <span className="days-remaining">{remaining}</span>}
      </div>
      <button className="small-btn" onClick={() => onDelete(item.id)}>削除</button>
    </div>
  )
}

export default function DayView({ items = [], onToggle = () => {}, onAdd = () => {}, onDelete = () => {}, onEdit = () => {}, showAdd = true, showRemaining = false, listAll = false, showDatePicker = true }) {
  const todayIso = new Date().toISOString().slice(0, 10)
  const [selectedDate, setSelectedDate] = React.useState(todayIso)
  const [newTitle, setNewTitle] = React.useState('')

  const filtered = listAll ? items : items.filter((it) => it.date === selectedDate)

  function handleAdd() {
    if (!newTitle.trim()) return
    onAdd(newTitle.trim(), selectedDate)
    setNewTitle('')
  }

  return (
    <section className="day-card">
      <div className="card-header">
        <div style={{display:'flex',gap:16,alignItems:'center'}}>
          <h2>目標一覧</h2>
          {showDatePicker ? (
            <input type="date" className="date-picker" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
          ) : (
            <div className="date-display">{selectedDate.replace(/-/g, '/')}</div>
          )}
        </div>
        {showAdd && (
          <div className="card-actions">
            <div className="add-inline">
              <input className="small-input" placeholder="目標を入力" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
              <button type="button" className="add-btn" onClick={handleAdd}>＋ 追加</button>
            </div>
          </div>
        )}
      </div>

      <div className="card-body">
        {filtered.length === 0 ? (
          <div className="empty">この日は記録がありません</div>
        ) : (
          <div className="items">
            {filtered.map((it) => (
              <DayItem key={it.id} item={it} onToggle={onToggle} onDelete={onDelete} showRemaining={showRemaining} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
