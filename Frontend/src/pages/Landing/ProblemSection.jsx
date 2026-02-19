import { AlertCircle, BookOpen, Users } from 'lucide-react'

export default function ProblemSection() {
  const problems = [
    {
      icon: AlertCircle,
      title: 'Interview Anxiety',
      description: 'Most candidates feel nervous during interviews, leading to poor performance even when they know the answers.'
    },
    {
      icon: BookOpen,
      title: 'Static Question Banks',
      description: 'Generic practice materials don\'t match real interview scenarios or your specific role requirements.'
    },
    {
      icon: Users,
      title: 'Lack of Personalization',
      description: 'One-size-fits-all interview prep ignores your unique background, skills, and experience level.'
    }
  ]

  return (
    <section className="py-20 px-4 bg-slate-900/50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-white">The Interview Problem</h2>
          <p className="text-xl text-gray-400">
            Traditional interview prep falls short. Here's why candidates struggle.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {problems.map((problem, index) => {
            const Icon = problem.icon
            return (
              <div
                key={index}
                className="p-8 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-primary/20 hover:border-primary/50 transition transform hover:scale-105"
              >
                <div className="w-14 h-14 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="text-primary" size={28} />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">{problem.title}</h3>
                <p className="text-gray-400">{problem.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
