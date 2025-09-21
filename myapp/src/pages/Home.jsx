import React from 'react'
import DayView from './DayView'

export default function Home(props) {
  // Reuse DayView so Home shows the same Today UI
  return (
    <div className="page home">
      <DayView {...props} />
    </div>
  )
}
