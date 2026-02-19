import { Volume2 } from 'lucide-react'

export default function FillerWordStats({ stats }) {
  const maxCount = Math.max(...Object.values(stats))
  const totalFillerWords = Object.values(stats).reduce((a, b) => a + b, 0)

  const words = [
    { word: 'Um', key: 'um', label: 'um' },
    { word: 'Like', key: 'like', label: 'like' },
    { word: 'Ah', key: 'ah', label: 'ah' },
    { word: 'You Know', key: 'you_know', label: 'you_know' }
  ]

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border border-primary/20">
      <div className="flex items-center gap-3 mb-6">
        <Volume2 className="text-accent" size={24} />
        <h3 className="text-2xl font-bold text-white">Filler Words Analysis</h3>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {words.map(({ word, key, label }) => {
          const count = stats[label] || 0
          const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0

          return (
            <div key={key} className="p-4 bg-slate-700/50 rounded-lg border border-primary/20">
              <p className="text-gray-400 text-sm mb-2">{word}</p>
              <p className="text-3xl font-bold text-white mb-3">{count}</p>
              <div className="h-1 bg-slate-600 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all ${
                    count > 3 ? 'bg-danger' : count > 1 ? 'bg-warning' : 'bg-success'
                  }`}
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="bg-slate-700/50 rounded-lg p-4 border border-primary/20">
        <p className="text-gray-400 text-sm mb-2">Total Filler Words</p>
        <p className="text-3xl font-bold text-white mb-4">{totalFillerWords}</p>
        <p className="text-gray-300 text-sm">
          {totalFillerWords === 0
            ? '✓ Excellent! No filler words detected.'
            : totalFillerWords <= 5
            ? '✓ Good control of filler words. Keep practicing.'
            : '⚠ Consider reducing filler words for more confident speech.'}
        </p>
      </div>

      <div className="mt-6 p-4 bg-primary/10 border border-primary/20 rounded-lg">
        <p className="text-accent font-semibold text-sm mb-2">Pro Tip</p>
        <p className="text-gray-300 text-sm">
          Record yourself speaking and listen back to identify patterns. Try pausing briefly instead of using filler words - it's more professional and builds tension.
        </p>
      </div>
    </div>
  )
}
