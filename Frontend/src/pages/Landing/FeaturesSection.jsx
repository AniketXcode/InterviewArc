import { FileText, Zap, BarChart3, Mic } from 'lucide-react'

export default function FeaturesSection() {
  const features = [
    {
      icon: FileText,
      title: 'Resume-Aware AI',
      description: 'AI analyzes your resume and tailors interview questions to your specific experience and skills.'
    },
    {
      icon: Zap,
      title: 'Adaptive Difficulty',
      description: 'Questions adjust in real-time based on your performance, matching your skill level precisely.'
    },
    {
      icon: BarChart3,
      title: 'Career Analytics',
      description: 'Track your progress with detailed performance metrics, weak areas, and improvement suggestions.'
    },
    {
      icon: Mic,
      title: 'Voice Interviews',
      description: 'Practice with voice input to build confidence and improve your spoken communication skills.'
    }
  ]

  return (
    <section className="py-20 px-4 bg-secondary">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-white">Powerful Features</h2>
          <p className="text-xl text-gray-400">
            Everything you need to ace your next interview.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className="p-8 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-primary/20 hover:border-accent/50 transition"
              >
                <div className="w-16 h-16 bg-accent/20 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="text-accent" size={32} />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-white">{feature.title}</h3>
                <p className="text-gray-400 text-lg">{feature.description}</p>
              </div>
            )
          })}
        </div>

        {/* Why InterviewArc Section */}
        <div className="mt-20 bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-12 border border-primary/30">
          <h3 className="text-3xl font-bold mb-6 text-white">Why Choose InterviewArc?</h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <p className="text-gray-300 mb-4 text-lg">
                InterviewArc is the first platform that combines AI intelligence with real interview dynamics. Our adaptive algorithm learns from your performance and creates a personalized learning path.
              </p>
            </div>
            <div>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-gray-300">
                  <span className="w-2 h-2 bg-accent rounded-full"></span>
                  Interviews that feel real
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <span className="w-2 h-2 bg-accent rounded-full"></span>
                  Instant feedback on performance
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <span className="w-2 h-2 bg-accent rounded-full"></span>
                  Track your interview journey
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <span className="w-2 h-2 bg-accent rounded-full"></span>
                  All roles and experience levels
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
