import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

export default function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center px-4 py-20 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 bg-primary/20 rounded-full blur-3xl -top-48 -left-48"></div>
        <div className="absolute w-96 h-96 bg-accent/20 rounded-full blur-3xl -bottom-48 -right-48"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <div className="mb-8">
          <span className="inline-block px-4 py-2 bg-primary/20 text-accent rounded-full text-sm font-semibold mb-4">
            AI-Powered Interview Platform
          </span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight text-white slide-in-up">
          Master Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Interview Skills</span>
        </h1>

        <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-2xl mx-auto">
          Practice with AI that adapts to your level, understands your resume, and provides real-time feedback on your performance.
        </p>

        <div className="flex gap-4 justify-center flex-wrap mb-12">
          <Link
            to="/register"
            className="px-8 py-4 bg-primary text-white rounded-lg font-bold hover:bg-blue-700 transition transform hover:scale-105 flex items-center gap-2 text-lg"
          >
            Start Free Interview <ArrowRight size={24} />
          </Link>
          <button className="px-8 py-4 border-2 border-primary text-primary rounded-lg font-bold hover:bg-primary/10 transition text-lg">
            Watch Demo
          </button>
        </div>

        <div className="grid grid-cols-3 gap-8 mt-16 text-center">
          <div>
            <p className="text-3xl font-bold text-primary">10K+</p>
            <p className="text-gray-400">Active Users</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-accent">95%</p>
            <p className="text-gray-400">Success Rate</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-primary">24/7</p>
            <p className="text-gray-400">Practice Ready</p>
          </div>
        </div>
      </div>
    </section>
  )
}
