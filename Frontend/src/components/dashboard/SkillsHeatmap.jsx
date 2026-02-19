import { Zap } from 'lucide-react'

export default function SkillsHeatmap() {
  const skills = [
    { name: 'React', score: 8.2 },
    { name: 'JavaScript', score: 7.9 },
    { name: 'Communication', score: 7.3 },
    { name: 'Problem Solving', score: 7.6 },
    { name: 'System Design', score: 6.5 },
    { name: 'Node.js', score: 7.8 },
    { name: 'Databases', score: 7.1 },
    { name: 'Behavioral', score: 8.0 }
  ]

  const getColor = (score) => {
    if (score >= 8) return 'from-success to-accent'
    if (score >= 7) return 'from-accent to-primary'
    if (score >= 6) return 'from-warning to-accent'
    return 'from-danger to-warning'
  }

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border border-primary/20 h-full">
      <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
        <Zap className="text-primary" size={28} />
        Skills
      </h3>

      <div className="space-y-3">
        {skills.map((skill, index) => (
          <div key={index}>
            <div className="flex items-center justify-between mb-1">
              <p className="text-gray-300 text-sm font-semibold">{skill.name}</p>
              <p className="text-primary text-sm font-bold">{skill.score}/10</p>
            </div>
            <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r ${getColor(skill.score)} transition-all`}
                style={{ width: `${(skill.score / 10) * 100}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-primary/20">
        <p className="text-gray-400 text-xs mb-3">Overall Proficiency</p>
        <div className="flex items-end gap-1 h-8">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(level => (
            <div
              key={level}
              className={`flex-1 rounded-t ${
                level <= 7
                  ? 'bg-gradient-to-t from-primary to-accent'
                  : 'bg-slate-600'
              }`}
              style={{ height: `${level * 12.5}%` }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  )
}
