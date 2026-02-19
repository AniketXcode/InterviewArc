import { Link } from 'react-router-dom'
import { ArrowRight, Zap, Brain, BarChart3, Mic } from 'lucide-react'
import Hero from './Hero'
import ProblemSection from './ProblemSection'
import FeaturesSection from './FeaturesSection'

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary via-secondary to-slate-900">
      <Hero />
      <ProblemSection />
      <FeaturesSection />
      
      {/* CTA Section */}
      <section className="py-20 px-4 text-center bg-primary/10">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold mb-6 text-white">Ready to Ace Your Interviews?</h2>
          <p className="text-lg text-gray-300 mb-8">
            Start practicing with AI-powered interviews today and get detailed feedback instantly.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              to="/register"
              className="px-8 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-blue-700 transition flex items-center gap-2"
            >
              Get Started <ArrowRight size={20} />
            </Link>
            <Link
              to="/login"
              className="px-8 py-3 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary/10 transition"
            >
              Login
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
