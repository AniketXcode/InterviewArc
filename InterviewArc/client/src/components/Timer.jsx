import React from 'react'
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'

function Timer({ timeLeft = 0, totalTime = 60 }) {
  const safeTotal = totalTime > 0 ? totalTime : 1
  const safeTimeLeft = Math.max(0, timeLeft)
  const percentage = Math.min(100, (safeTimeLeft / safeTotal) * 100)

  const minutes = Math.floor(safeTimeLeft / 60)
  const seconds = safeTimeLeft % 60
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`

  const urgencyRatio = safeTimeLeft / safeTotal
  const pathColor =
    urgencyRatio <= 0.2 ? '#ef4444' : urgencyRatio <= 0.45 ? '#f59e0b' : '#10b981'
  const textColor = urgencyRatio <= 0.2 ? '#b91c1c' : '#0f172a'
  const statusLabel =
    urgencyRatio <= 0.2 ? 'Wrap up now' : urgencyRatio <= 0.45 ? 'Stay focused' : 'Good pace'

  return (
    <div className='w-28'>
      <div className='mx-auto h-24 w-24'>
        <CircularProgressbar
          value={percentage}
          text={formattedTime}
          styles={buildStyles({
            textSize: '15px',
            pathColor,
            textColor,
            trailColor: '#e5e7eb',
            pathTransitionDuration: 0.5
          })}
        />
      </div>

      <p className='mt-3 text-center text-xs font-medium uppercase tracking-[0.14em] text-slate-400'>
        Time left
      </p>
      <p className='mt-1 text-center text-xs font-medium text-slate-500'>{statusLabel}</p>
    </div>
  )
}

export default Timer
