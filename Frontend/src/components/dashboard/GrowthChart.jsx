import { TrendingUp } from 'lucide-react'

export default function GrowthChart() {
  const data = [
    { week: 'Week 1', score: 6.2 },
    { week: 'Week 2', score: 6.5 },
    { week: 'Week 3', score: 6.8 },
    { week: 'Week 4', score: 7.1 },
    { week: 'Week 5', score: 7.4 },
    { week: 'Week 6', score: 7.3 },
    { week: 'Week 7', score: 7.6 },
    { week: 'Week 8', score: 7.9 }
  ]

  const maxScore = 10
  const minScore = Math.min(...data.map(d => d.score))
  const maxData = Math.max(...data.map(d => d.score))

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border border-primary/20">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-2xl font-bold text-white flex items-center gap-3">
          <TrendingUp className="text-accent" size={28} />
          Your Progress
        </h3>
        <p className="text-gray-400">Last 8 weeks</p>
      </div>

      {/* Chart */}
      <div className="relative h-64 mb-6">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 bottom-0 w-12 text-right text-xs text-gray-500 space-y-8">
          <div>10</div>
          <div>8</div>
          <div>6</div>
          <div>4</div>
        </div>

        {/* Grid */}
        <svg className="w-full h-full absolute inset-0" preserveAspectRatio="none">
          {[0, 0.25, 0.5, 0.75, 1].map((y, i) => (
            <line
              key={i}
              x1="0"
              y1={`${y * 100}%`}
              x2="100%"
              y2={`${y * 100}%`}
              stroke="#475569"
              strokeWidth="0.5"
            />
          ))}
        </svg>

        {/* Bars and line chart */}
        <div className="relative h-full flex items-end gap-2 px-12">
          {data.map((item, index) => {
            const height = ((item.score - minScore) / (maxData - minScore)) * 100
            return (
              <div
                key={index}
                className="flex-1 flex flex-col items-center group"
              >
                <div
                  className="w-full bg-gradient-to-t from-primary to-accent rounded-t-lg opacity-70 hover:opacity-100 transition"
                  style={{ height: `${height}%`, minHeight: '20px' }}
                >
                  <div className="h-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                    <span className="text-xs font-bold text-white">{item.score}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* X-axis labels */}
      <div className="flex gap-2 px-12">
        {data.map((item, index) => (
          <div key={index} className="flex-1 text-center text-xs text-gray-500">
            {item.week}
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-primary/20">
        <div>
          <p className="text-gray-400 text-sm">Highest Score</p>
          <p className="text-2xl font-bold text-success">7.9</p>
        </div>
        <div>
          <p className="text-gray-400 text-sm">Average</p>
          <p className="text-2xl font-bold text-accent">7.3</p>
        </div>
        <div>
          <p className="text-gray-400 text-sm">Improvement</p>
          <p className="text-2xl font-bold text-primary">+1.7</p>
        </div>
      </div>
    </div>
  )
}
