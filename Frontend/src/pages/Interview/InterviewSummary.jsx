import { useState } from 'react';
import {
  Download,
  Share2,
  TrendingUp,
  ArrowRight,
  Check,
  AlertCircle,
  BarChart3,
  Zap,
  MessageSquare,
  Voice,
  Eye,
  Lightbulb
} from 'lucide-react';

export default function InterviewSummary() {
  const [selectedTab, setSelectedTab] = useState('overview');

  const score = 7.8;
  const maxScore = 10;
  const scorePercentage = (score / maxScore) * 100;

  const metrics = [
    { label: 'Communication', value: 8.2, trend: 'up' },
    { label: 'Technical Knowledge', value: 7.5, trend: 'down' },
    { label: 'Problem Solving', value: 8.0, trend: 'up' },
    { label: 'Confidence', value: 7.2, trend: 'neutral' }
  ];

  const strengths = [
    'Clear articulation and excellent explanations',
    'Strong knowledge of system design patterns',
    'Good recovery from mistakes',
    'Relevant examples from past projects'
  ];

  const improvements = [
    'Could provide more specific metrics and numbers',
    'Brush up on newer technologies in your field',
    'Take time to structure thoughts before answering',
    'Practice more behavioral interview questions'
  ];

  const tips = [
    {
      icon: <Lightbulb />,
      title: 'Practice Structured Answers',
      description: 'Use the STAR method for behavioral questions'
    },
    {
      icon: <Voice />,
      title: 'Work on Pacing',
      description: 'Slow down slightly and avoid filler words'
    },
    {
      icon: <BarChart3 />,
      title: 'Learn About Company',
      description: 'Research specific tools and tech stack'
    },
    {
      icon: <Eye />,
      title: 'Practice Mock Interviews',
      description: 'Repeat this interview to track improvement'
    }
  ];

  return (
    <div className="min-h-screen bg-background text-text">
      {/* Fixed background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-success/5 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <div className="sticky top-0 z-40 backdrop-blur-xl border-b border-border bg-background/80">
        <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent"></div>
            <span className="font-bold text-lg">InterviewArc</span>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-surface rounded-lg transition flex items-center gap-2 text-sm">
              <Share2 size={18} />
              <span className="hidden sm:inline">Share</span>
            </button>
            <button className="p-2 hover:bg-surface rounded-lg transition flex items-center gap-2 text-sm">
              <Download size={18} />
              <span className="hidden sm:inline">Download</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        
        {/* Score Card */}
        <div className="mb-12 bg-gradient-to-br from-surface via-surface to-surface-light border border-primary/30 rounded-3xl p-8 sm:p-12 backdrop-blur-sm">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">Interview Complete</h1>
          <p className="text-text-secondary mb-8">Here's your comprehensive feedback</p>

          <div className="grid sm:grid-cols-2 gap-8 items-center">
            {/* Score Circle */}
            <div className="flex justify-center">
              <div className="relative w-48 h-48">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="96"
                    cy="96"
                    r="88"
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.1)"
                    strokeWidth="4"
                  />
                  <circle
                    cx="96"
                    cy="96"
                    r="88"
                    fill="none"
                    stroke="url(#scoreGradient)"
                    strokeWidth="4"
                    strokeDasharray={`${(scorePercentage / 100) * 552} 552`}
                    className="transition-all duration-1000"
                  />
                  <defs>
                    <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#6366f1" />
                      <stop offset="100%" stopColor="#06b6d4" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                      {score}
                    </div>
                    <div className="text-sm text-text-secondary">out of 10</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Score Interpretation */}
            <div>
              <div className="mb-6">
                <p className="text-lg text-text-secondary mb-2">Overall Assessment</p>
                <p className="text-2xl font-bold">You're on the right track!</p>
                <p className="text-text-secondary mt-3">
                  Your performance shows strong fundamentals with room for targeted improvements. Focus on the areas below to boost your score.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Check size={20} className="text-success" />
                  <span className="text-sm">Clear communication</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={20} className="text-success" />
                  <span className="text-sm">Good technical depth</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={20} className="text-success" />
                  <span className="text-sm">Professional demeanor</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-border">
          <button
            onClick={() => setSelectedTab('overview')}
            className={`px-6 py-4 font-semibold transition border-b-2 ${
              selectedTab === 'overview'
                ? 'border-primary text-primary'
                : 'border-transparent text-text-secondary hover:text-text'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setSelectedTab('metrics')}
            className={`px-6 py-4 font-semibold transition border-b-2 ${
              selectedTab === 'metrics'
                ? 'border-primary text-primary'
                : 'border-transparent text-text-secondary hover:text-text'
            }`}
          >
            Detailed Metrics
          </button>
          <button
            onClick={() => setSelectedTab('feedback')}
            className={`px-6 py-4 font-semibold transition border-b-2 ${
              selectedTab === 'feedback'
                ? 'border-primary text-primary'
                : 'border-transparent text-text-secondary hover:text-text'
            }`}
          >
            Feedback
          </button>
        </div>

        {/* Tab Content */}
        {selectedTab === 'overview' && (
          <div className="space-y-8 animate-fade-in">
            {/* Quick Metrics */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Quick Metrics</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {metrics.map((metric) => (
                  <MetricCard key={metric.label} metric={metric} />
                ))}
              </div>
            </div>

            {/* Strengths & Improvements */}
            <div className="grid sm:grid-cols-2 gap-8">
              <div className="bg-surface border border-border rounded-2xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Check className="text-success" size={24} />
                  <h3 className="text-xl font-bold">Your Strengths</h3>
                </div>
                <ul className="space-y-4">
                  {strengths.map((strength, idx) => (
                    <li key={idx} className="flex gap-3">
                      <div className="w-2 h-2 rounded-full bg-success mt-2 flex-shrink-0"></div>
                      <span className="text-text-secondary">{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-surface border border-border rounded-2xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <AlertCircle className="text-warning" size={24} />
                  <h3 className="text-xl font-bold">Areas to Improve</h3>
                </div>
                <ul className="space-y-4">
                  {improvements.map((improvement, idx) => (
                    <li key={idx} className="flex gap-3">
                      <div className="w-2 h-2 rounded-full bg-warning mt-2 flex-shrink-0"></div>
                      <span className="text-text-secondary">{improvement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'metrics' && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-2xl font-bold mb-8">Performance Breakdown</h2>
            {metrics.map((metric) => (
              <div key={metric.label} className="bg-surface border border-border rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-lg">{metric.label}</h3>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">{metric.value}</div>
                    <div className="flex items-center gap-1 text-xs text-success">
                      <TrendingUp size={14} />
                      <span>{metric.trend === 'up' ? '+0.3' : metric.trend === 'down' ? '-0.2' : '→'} vs last interview</span>
                    </div>
                  </div>
                </div>
                <div className="w-full bg-border rounded-full h-2">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-1000"
                    style={{ width: `${metric.value * 10}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedTab === 'feedback' && (
          <div className="space-y-8 animate-fade-in">
            <div>
              <h2 className="text-2xl font-bold mb-8">Actionable Tips</h2>
              <div className="grid sm:grid-cols-2 gap-6">
                {tips.map((tip, idx) => (
                  <div key={idx} className="bg-surface border border-border rounded-2xl p-8 hover:border-primary/50 transition">
                    <div className="text-primary mb-4">{tip.icon}</div>
                    <h4 className="font-bold text-lg mb-2">{tip.title}</h4>
                    <p className="text-text-secondary text-sm">{tip.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Communication Analysis */}
            <div className="bg-surface border border-border rounded-2xl p-8">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <MessageSquare size={24} className="text-accent" />
                Communication Analysis
              </h3>
              <div className="space-y-4">
                <CommunicationMetric label="Speaking Pace" percentage={78} />
                <CommunicationMetric label="Clarity" percentage={82} />
                <CommunicationMetric label="Confidence" percentage={72} />
                <CommunicationMetric label="Structure" percentage={75} />
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-16 flex flex-col sm:flex-row gap-4 sticky bottom-0 bg-background/80 backdrop-blur-xl border-t border-border px-6 py-6 -mx-6 -mb-12">
          <button className="flex-1 px-6 py-3 rounded-full border border-border hover:bg-surface transition font-semibold">
            Try Another Interview
          </button>
          <button className="flex-1 px-6 py-3 rounded-full bg-gradient-to-r from-primary to-primary-light font-semibold hover:shadow-md-glass transition flex items-center justify-center gap-2">
            Go to Dashboard
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ metric }) {
  return (
    <div className="bg-surface border border-border rounded-2xl p-6 hover:border-primary/50 transition group">
      <div className="flex items-end justify-between mb-4">
        <h4 className="font-semibold text-sm">{metric.label}</h4>
        <TrendingUp size={18} className={`${metric.trend === 'up' ? 'text-success' : metric.trend === 'down' ? 'text-danger' : 'text-text-tertiary'}`} />
      </div>
      <div className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
        {metric.value}
      </div>
      <p className="text-xs text-text-secondary mt-2">compared to your average</p>
    </div>
  );
}

function CommunicationMetric({ label, percentage }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="font-medium text-sm">{label}</span>
        <span className="text-sm font-semibold text-primary">{percentage}%</span>
      </div>
      <div className="w-full bg-border rounded-full h-2">
        <div
          className="h-2 rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-1000"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
}
