import { AlertCircle, Heart } from 'lucide-react'

export default function StressIndicator({ level }) {
  // level is 0-100
  let status = 'Calm'
  let statusColor = 'text-success'
  let barColor = 'bg-success'

  if (level > 70) {
    status = 'High'
    statusColor = 'text-danger'
    barColor = 'bg-danger'
  } else if (level > 40) {
    status = 'Moderate'
    statusColor = 'text-warning'
    barColor = 'bg-warning'
  }

  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-slate-700/50 rounded-lg border border-primary/20">
      <Heart size={20} className={statusColor} />
      <div className="flex-1">
        <p className="text-xs text-gray-400 mb-1">Stress Level</p>
        <div className="w-24 h-2 bg-slate-600 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${barColor}`}
            style={{ width: `${level}%` }}
          ></div>
        </div>
      </div>
      <p className={`text-sm font-bold ${statusColor}`}>{status}</p>
    </div>
  )
}
