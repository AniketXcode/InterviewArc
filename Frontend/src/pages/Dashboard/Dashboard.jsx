import { useState } from 'react';
import {
  TrendingUp,
  Calendar,
  Award,
  Zap,
  Target,
  Activity,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  Play
} from 'lucide-react';

export default function Dashboard() {
  const [selectedMetric, setSelectedMetric] = useState('all');

  const stats = [
    {
      icon: <Award />,
      label: 'Average Score',
      value: '7.6',
      change: '+0.4',
      trend: 'up',
      color: 'from-primary to-accent'
    },
    {
      icon: <Activity />,
      label: 'Interviews Completed',
      value: '12',
      change: '+3',
      trend: 'up',
      color: 'from-accent to-primary'
    },
    {
      icon: <TrendingUp />,
      label: 'Improvement Score',
      value: '18%',
      change: '+5%',
      trend: 'up',
      color: 'from-success to-primary'
    },
    {
      icon: <Target />,
      label: 'Consistency',
      value: '92%',
      change: '+2%',
      trend: 'up',
      color: 'from-warning to-accent'
    }
  ];

  const recentInterviews = [
    {
      id: 1,
      role: 'Senior Software Engineer',
      date: '2 days ago',
      score: 8.2,
      status: 'excellent',
      duration: '35m'
    },
    {
      id: 2,
      role: 'Product Manager',
      date: '1 week ago',
      score: 7.5,
      status: 'good',
      duration: '40m'
    },
    {
      id: 3,
      role: 'Data Scientist',
      date: '2 weeks ago',
      score: 7.1,
      status: 'good',
      duration: '30m'
    },
    {
      id: 4,
      role: 'DevOps Engineer',
      date: '3 weeks ago',
      score: 6.8,
      status: 'fair',
      duration: '45m'
    }
  ];

  const skillBreakdown = [
    { skill: 'Communication', score: 8.2, target: 8.5 },
    { skill: 'Technical Knowledge', score: 7.5, target: 8.0 },
    { skill: 'Problem Solving', score: 7.8, target: 8.5 },
    { skill: 'Confidence', score: 7.2, target: 8.0 },
    { skill: 'Behavioral Fit', score: 7.9, target: 8.5 }
  ];

  const recommendations = [
    {
      title: 'Practice System Design',
      description: 'Work on architectural thinking for better technical scores',
      priority: 'high',
      progress: 35
    },
    {
      title: 'Study New Technologies',
      description: 'Learn latest frameworks and tools in your field',
      priority: 'medium',
      progress: 60
    },
    {
      title: 'Behavioral Interview Prep',
      description: 'Polish your STAR method storytelling',
      priority: 'medium',
      progress: 45
    }
  ];

  const getScoreBadge = (score) => {
    if (score >= 8) return { color: 'text-success', bg: 'bg-success/10', label: 'Excellent' };
    if (score >= 7) return { color: 'text-accent', bg: 'bg-accent/10', label: 'Good' };
    return { color: 'text-warning', bg: 'bg-warning/10', label: 'Fair' };
  };

  return (
    <div className="min-h-screen bg-background text-text">
      {/* Fixed background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-accent/5 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <div className="sticky top-0 z-40 backdrop-blur-xl border-b border-border bg-background/80">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <p className="text-text-secondary text-sm mt-1">Track your interview prep progress</p>
            </div>
            <button className="px-6 py-3 bg-gradient-to-r from-primary to-primary-light rounded-full font-semibold hover:shadow-md-glass transition flex items-center gap-2">
              <Play size={18} />
              <span className="hidden sm:inline">Start Interview</span>
              <span className="sm:hidden">Start</span>
            </button>
          </div>

          {/* Date Selector */}
          <div className="flex gap-3 items-center">
            <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-surface border border-border hover:bg-border transition text-sm">
              <Calendar size={16} />
              Last 30 Days
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        
        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-surface border border-border rounded-2xl p-6 hover:border-primary/50 transition group">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} p-3 mb-4 group-hover:scale-110 transition`}>
                <div className="text-white">{stat.icon}</div>
              </div>
              <p className="text-text-secondary text-sm mb-2">{stat.label}</p>
              <div className="flex items-end justify-between">
                <h3 className="text-3xl font-bold">{stat.value}</h3>
                <div className={`flex items-center gap-1 text-sm ${stat.trend === 'up' ? 'text-success' : 'text-danger'}`}>
                  {stat.trend === 'up' ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                  <span className="font-semibold">{stat.change}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Left Column: Growth Chart and Skills */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Performance Trend */}
            <div className="bg-surface border border-border rounded-3xl p-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold">Performance Trend</h2>
                  <p className="text-text-secondary text-sm mt-1">Your scores over time</p>
                </div>
                <button className="p-2 hover:bg-border rounded-lg transition">
                  <MoreHorizontal size={20} />
                </button>
              </div>

              {/* Simple Line Chart Visualization */}
              <div className="h-48 relative">
                <svg className="w-full h-full" viewBox="0 0 600 200" preserveAspectRatio="xMidYMid meet">
                  {/* Grid */}
                  <line x1="50" y1="150" x2="550" y2="150" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                  <line x1="50" y1="100" x2="550" y2="100" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                  <line x1="50" y1="50" x2="550" y2="50" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                  
                  {/* Data Line */}
                  <polyline
                    points="50,120 100,110 150,130 200,95 250,105 300,85 350,75 400,80 450,65 500,55 550,60"
                    fill="none"
                    stroke="url(#chartGradient)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  
                  {/* Fill */}
                  <polygon
                    points="50,120 100,110 150,130 200,95 250,105 300,85 350,75 400,80 450,65 500,55 550,60 550,150 50,150"
                    fill="url(#areaGradient)"
                    opacity="0.1"
                  />

                  {/* Data Points */}
                  <circle cx="550" cy="60" r="4" fill="#6366f1" />
                  <circle cx="500" cy="55" r="4" fill="#6366f1" />
                  <circle cx="450" cy="65" r="4" fill="#06b6d4" />

                  <defs>
                    <linearGradient id="chartGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#6366f1" />
                      <stop offset="100%" stopColor="#06b6d4" />
                    </linearGradient>
                    <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#6366f1" />
                      <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              <div className="mt-6 flex gap-8">
                <div>
                  <p className="text-text-secondary text-sm">Average Score</p>
                  <p className="text-2xl font-bold mt-1">7.6/10</p>
                </div>
                <div>
                  <p className="text-text-secondary text-sm">Trend</p>
                  <p className="text-2xl font-bold mt-1 text-success">↗ +18%</p>
                </div>
              </div>
            </div>

            {/* Skill Breakdown */}
            <div className="bg-surface border border-border rounded-3xl p-8">
              <h2 className="text-2xl font-bold mb-8">Skill Breakdown</h2>
              <div className="space-y-6">
                {skillBreakdown.map((item, idx) => (
                  <div key={idx}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold">{item.skill}</span>
                      <div className="text-right">
                        <span className="font-bold text-primary">{item.score}</span>
                        <span className="text-text-tertiary text-sm ml-2">/ {item.target}</span>
                      </div>
                    </div>
                    <div className="w-full bg-border rounded-full h-2">
                      <div
                        className="h-2 rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
                        style={{ width: `${(item.score / item.target) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Recent & Recommendations */}
          <div className="space-y-8">
            
            {/* Recent Interviews */}
            <div className="bg-surface border border-border rounded-3xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Recent Interviews</h2>
                <a href="#" className="text-primary text-sm hover:underline flex items-center gap-1">
                  View All <ChevronRight size={16} />
                </a>
              </div>

              <div className="space-y-4">
                {recentInterviews.map((interview) => {
                  const badge = getScoreBadge(interview.score);
                  return (
                    <div key={interview.id} className="p-4 bg-background/50 border border-border/50 rounded-xl hover:border-primary/50 transition cursor-pointer group">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-sm leading-tight">{interview.role}</h4>
                          <p className="text-xs text-text-tertiary mt-1">{interview.date}</p>
                        </div>
                        <div className={`px-2 py-1 rounded-lg text-xs font-semibold ${badge.bg} ${badge.color}`}>
                          {interview.score}
                        </div>
                      </div>
                      <p className="text-xs text-text-secondary">{interview.duration}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-surface border border-border rounded-3xl p-6">
              <h2 className="text-xl font-bold mb-6">Next Steps</h2>
              <div className="space-y-4">
                {recommendations.map((rec, idx) => (
                  <div key={idx} className="p-4 bg-background/50 border border-border/50 rounded-xl">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-sm">{rec.title}</h4>
                        <p className="text-xs text-text-secondary mt-1">{rec.description}</p>
                      </div>
                      <div className={`px-2 py-1 rounded-lg text-xs font-semibold ${
                        rec.priority === 'high' ? 'bg-danger/10 text-danger' : 'bg-warning/10 text-warning'
                      }`}>
                        {rec.priority}
                      </div>
                    </div>
                    <div className="w-full bg-border rounded-full h-1.5">
                      <div
                        className="h-1.5 rounded-full bg-gradient-to-r from-primary to-accent"
                        style={{ width: `${rec.progress}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-text-tertiary mt-2">{rec.progress}% Complete</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
