import { Calendar, Clock, TrendingUp } from 'lucide-react'

export default function SessionHistory({ sessions }) {
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Junior':
        return 'bg-success/10 text-success'
      case 'Mid-level':
        return 'bg-accent/10 text-accent'
      case 'Senior':
        return 'bg-danger/10 text-danger'
      default:
        return 'bg-primary/10 text-primary'
    }
  }

  const getScoreColor = (score) => {
    if (score >= 8) return 'text-success'
    if (score >= 7) return 'text-accent'
    if (score >= 6) return 'text-warning'
    return 'text-danger'
  }

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border border-primary/20">
      <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
        <Calendar className="text-accent" size={28} />
        Recent Sessions
      </h3>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-primary/20">
              <th className="text-left py-3 px-4 text-gray-400 text-sm font-semibold">Role</th>
              <th className="text-left py-3 px-4 text-gray-400 text-sm font-semibold">Date</th>
              <th className="text-left py-3 px-4 text-gray-400 text-sm font-semibold">Difficulty</th>
              <th className="text-left py-3 px-4 text-gray-400 text-sm font-semibold">Duration</th>
              <th className="text-left py-3 px-4 text-gray-400 text-sm font-semibold">Score</th>
              <th className="text-left py-3 px-4 text-gray-400 text-sm font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((session, index) => (
              <tr
                key={index}
                className="border-b border-primary/10 hover:bg-slate-700/30 transition"
              >
                <td className="py-4 px-4 text-white font-semibold">{session.role}</td>
                <td className="py-4 px-4 text-gray-400 text-sm">{session.date}</td>
                <td className="py-4 px-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(session.difficulty)}`}>
                    {session.difficulty}
                  </span>
                </td>
                <td className="py-4 px-4 text-gray-400 text-sm flex items-center gap-2">
                  <Clock size={16} />
                  {session.duration} min
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    <span className={`text-lg font-bold ${getScoreColor(session.score)}`}>
                      {session.score}
                    </span>
                    <TrendingUp size={16} className={getScoreColor(session.score)} />
                  </div>
                </td>
                <td className="py-4 px-4">
                  <button className="text-primary text-sm font-semibold hover:text-accent transition">
                    View →
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* View All Button */}
      <div className="mt-6 text-center">
        <button className="text-primary font-semibold hover:text-accent transition">
          View All Sessions →
        </button>
      </div>
    </div>
  )
}
