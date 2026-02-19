import { Award } from 'lucide-react'

export default function ScoreDisplay({ score }) {
  // score is 0-10
  let status = 'Excellent'
  let statusColor = 'text-success'
  let ringColor = 'from-success to-accent'

  if (score < 5) {
    status = 'Good'
    statusColor = 'text-warning'
    ringColor = 'from-warning to-accent'
  } else if (score < 7) {
    status = 'Very Good'
    statusColor = 'text-accent'
    ringColor = 'from-accent to-primary'
  } else if (score < 8.5) {
    status = 'Excellent'
    statusColor = 'text-success'
    ringColor = 'from-success to-accent'
  } else {
    status = 'Outstanding'
    statusColor = 'text-success'
    ringColor = 'from-success via-accent to-primary'
  }

  const percentage = (score / 10) * 100

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-48 h-48 mb-6">
        {/* Background Circle */}
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="none" stroke="#334155" strokeWidth="8" />
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="url(#scoreGradient)"
            strokeWidth="8"
            strokeDasharray={`${(percentage / 100) * 283} 283`}
            className="transition-all duration-500"
          />
          <defs>
            <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#00d4ff" />
            </linearGradient>
          </defs>
        </svg>

        {/* Center Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <Award className="text-primary mb-2" size={32} />
          <p className="text-5xl font-bold text-white">{score}</p>
          <p className="text-gray-400">out of 10</p>
        </div>
      </div>

      <p className={`text-2xl font-bold ${statusColor}`}>{status}</p>
      <p className="text-gray-400 text-center mt-2">
        Your interview performance was outstanding. Keep practicing to improve further.
      </p>
    </div>
  )
}
