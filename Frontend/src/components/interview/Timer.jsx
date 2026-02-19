import { Clock } from 'lucide-react'

export default function Timer({ timeRemaining }) {
  const minutes = Math.floor(timeRemaining / 60)
  const seconds = timeRemaining % 60
  
  const isWarning = timeRemaining < 300 // Less than 5 minutes
  const isCritical = timeRemaining < 60  // Less than 1 minute

  const displayTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`

  return (
    <div className={`flex items-center gap-3 px-6 py-3 rounded-lg font-bold text-lg ${
      isCritical 
        ? 'bg-danger/20 text-danger' 
        : isWarning 
        ? 'bg-warning/20 text-warning' 
        : 'bg-primary/20 text-primary'
    }`}>
      <Clock size={24} />
      <span>{displayTime}</span>
    </div>
  )
}
