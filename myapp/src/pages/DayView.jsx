import React from 'react'

function DayItem({ item, onToggle, onDelete }) {
  return (
    <div className={`day-item ${item.done ? 'done' : ''}`}>
      <div className="checkbox" onClick={() => onToggle(item.id)}>{item.done ? '✓' : ''}</div>
      <div className="content">
        <div className="title">{item.title}</div>
        {item.note && <div className="note">{item.note}</div>}
      </div>
      <div className="meta">{item.time}</div>
      <button className="small-btn" onClick={() => onDelete(item.id)}>削除</button>
    </div>
  )
}

export default function DayView({ items = [], onToggle = () => {}, onAdd = () => {}, onDelete = () => {}, onEdit = () => {} }) {
  const todayIso = new Date().toISOString().slice(0, 10)
  const [selectedDate, setSelectedDate] = React.useState(todayIso)
  const [newTitle, setNewTitle] = React.useState('')
  const [newTime, setNewTime] = React.useState('09:00')

  const filtered = items.filter((it) => it.date === selectedDate)

  function handleAdd() {
    if (!newTitle.trim()) return
    onAdd(newTitle.trim(), newTime, selectedDate)
    setNewTitle('')
    setNewTime('09:00')
  }

  return (
    <section className="day-card">
      <div className="card-header">
        <div style={{display:'flex',gap:16,alignItems:'center'}}>
          <h2>目標一覧</h2>
          <input type="date" className="date-picker" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
        </div>
        <div className="card-actions">
          <div className="add-inline">
            <input className="small-input" placeholder="目標を入力" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
            <input className="small-input" type="time" value={newTime} onChange={(e) => setNewTime(e.target.value)} />
            <button className="add-btn" onClick={handleAdd}>＋ 追加</button>
          </div>
        </div>
      </div>

      <div className="card-body">
        {filtered.length === 0 ? (
          <div className="empty">この日は記録がありません</div>
        ) : (
          <div className="items">
            {filtered.map((it) => (
              <DayItem key={it.id} item={it} onToggle={onToggle} onDelete={onDelete} />
            ))}
          </div>
        )}
      </div>

      <div className="card-footer">下にスワイプで過去／未来を確認</div>
    </section>
  )
}
