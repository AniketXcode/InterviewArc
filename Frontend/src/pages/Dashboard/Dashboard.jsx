import { Link } from 'react-router-dom'
import { BarChart3, TrendingUp, Zap, LogOut, PlayCircle } from 'lucide-react'
import GrowthChart from '../../components/dashboard/GrowthChart'
import SkillsHeatmap from '../../components/dashboard/SkillsHeatmap'
import SessionHistory from '../../components/dashboard/SessionHistory'

export default function Dashboard() {
  const userStats = {
    totalInterviews: 12,
    averageScore: 7.3,
    improvementRate: '+15%',
    streak: 5
  }

  const recentSessions = [
    {
      id: 1,
      role: 'React Developer',
      date: '2 days ago',
      score: 8.2,
      difficulty: 'Mid-level',
      duration: 20
    },
    {
      id: 2,
      role: 'Full Stack Developer',
      date: '4 days ago',
      score: 7.1,
      difficulty: 'Mid-level',
      duration: 15
    },
    {
      id: 3,
      role: 'Frontend Developer',
      date: '1 week ago',
      score: 6.8,
      difficulty: 'Junior',
      duration: 10
    },
    {
      id: 4,
      role: 'Node.js Backend',
      date: '1 week ago',
      score: 7.9,
      difficulty: 'Senior',
      duration: 30
    },
    {
      id: 5,
      role: 'React Developer',
      date: '2 weeks ago',
      score: 6.5,
      difficulty: 'Mid-level',
      duration: 15
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary via-secondary to-slate-900 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header with Profile */}
        <div className="flex items-center justify-between mb-12 pb-6 border-b border-primary/20">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Welcome Back, Alex!</h1>
            <p className="text-gray-400">Here's your interview performance overview</p>
          </div>
          <div className="flex gap-3">
            <Link
              to="/setup-interview"
              className="px-6 py-3 bg-primary text-white font-bold rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
            >
              <PlayCircle size={20} />
              New Interview
            </Link>
            <button className="px-6 py-3 bg-slate-700/50 text-white font-bold rounded-lg hover:bg-slate-700 transition flex items-center gap-2 border border-primary/20">
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-primary/20">
            <p className="text-gray-400 text-sm mb-2">Total Interviews</p>
            <p className="text-4xl font-bold text-white mb-2">{userStats.totalInterviews}</p>
            <p className="text-accent text-sm">Keep practicing daily</p>
          </div>

          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-accent/20">
            <p className="text-gray-400 text-sm mb-2">Average Score</p>
            <p className="text-4xl font-bold text-accent mb-2">{userStats.averageScore}</p>
            <p className="text-gray-400 text-sm">/10.0</p>
          </div>

          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-success/20">
            <p className="text-gray-400 text-sm mb-2">Improvement</p>
            <p className="text-4xl font-bold text-success mb-2">{userStats.improvementRate}</p>
            <p className="text-gray-400 text-sm">Last 30 days</p>
          </div>

          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-warning/20">
            <p className="text-gray-400 text-sm mb-2">Current Streak</p>
            <p className="text-4xl font-bold text-warning mb-2">{userStats.streak}</p>
            <p className="text-gray-400 text-sm">days</p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* Growth Chart */}
          <div className="lg:col-span-2">
            <GrowthChart />
          </div>

          {/* Skills Heatmap */}
          <div>
            <SkillsHeatmap />
          </div>
        </div>

        {/* Session History */}
        <div>
          <SessionHistory sessions={recentSessions} />
        </div>

        {/* Recommendations */}
        <div className="mt-8 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border border-primary/20">
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <Zap className="text-accent" size={28} />
            Recommendations for Your Next Interview
          </h3>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-4 bg-slate-700/50 rounded-lg border border-primary/20">
              <p className="text-accent font-semibold mb-2">Focus Area: System Design</p>
              <p className="text-gray-300 text-sm">
                Your scores on system design questions average 6.5. Practice more design patterns and architecture discussions.
              </p>
              <Link
                to="/setup-interview"
                className="text-primary text-sm font-semibold hover:text-accent transition inline-block mt-3"
              >
                Practice System Design →
              </Link>
            </div>

            <div className="p-4 bg-slate-700/50 rounded-lg border border-primary/20">
              <p className="text-accent font-semibold mb-2">Communication Skills</p>
              <p className="text-gray-300 text-sm">
                Work on reducing filler words and speaking more concisely. Record yourself for feedback.
              </p>
              <Link
                to="/setup-interview"
                className="text-primary text-sm font-semibold hover:text-accent transition inline-block mt-3"
              >
                Practice Now →
              </Link>
            </div>

            <div className="p-4 bg-slate-700/50 rounded-lg border border-primary/20">
              <p className="text-accent font-semibold mb-2">Technical Depth</p>
              <p className="text-gray-300 text-sm">
                Strengthen your knowledge in React hooks and state management patterns.
              </p>
              <Link
                to="/setup-interview"
                className="text-primary text-sm font-semibold hover:text-accent transition inline-block mt-3"
              >
                Interview on React →
              </Link>
            </div>

            <div className="p-4 bg-slate-700/50 rounded-lg border border-primary/20">
              <p className="text-accent font-semibold mb-2">Behavioral Questions</p>
              <p className="text-gray-300 text-sm">
                Your behavioral interview scores are strong. Keep using STAR method for best results.
              </p>
              <Link
                to="/setup-interview"
                className="text-primary text-sm font-semibold hover:text-accent transition inline-block mt-3"
              >
                Practice More →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
