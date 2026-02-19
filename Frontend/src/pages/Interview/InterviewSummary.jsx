import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Download, Share2, ArrowRight, Star } from 'lucide-react'
import ScoreDisplay from '../../components/feedback/ScoreDisplay'
import FillerWordStats from '../../components/feedback/FillerWordStats'
import FeedbackSection from '../../components/feedback/FeedbackSection'

export default function InterviewSummary() {
  const location = useLocation()
  const [copied, setCopied] = useState(false)

  // Mock data - in production, this would come from location.state
  const summaryData = location.state || {
    score: 7.5,
    duration: 15,
    feedback: {
      strengths: [
        'Clear and concise explanations',
        'Strong technical knowledge',
        'Good problem-solving approach',
        'Excellent communication'
      ],
      weaknesses: [
        'Could elaborate more on experience',
        'Missing some real-world examples',
        'Pacing could be improved'
      ],
      fillerWords: {
        um: 3,
        like: 2,
        ah: 1,
        you_know: 0
      },
      communicationScore: 8,
      technicalScore: 7,
      confidenceScore: 7
    },
    messages: []
  }

  const handleDownloadReport = () => {
    // Simulate PDF download
    console.log('Downloading report...')
  }

  const handleShare = () => {
    setCopied(true)
    navigator.clipboard.writeText(window.location.href)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary via-secondary to-slate-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">Interview Complete</h1>
          <p className="text-xl text-gray-400">Here's your detailed feedback</p>
        </div>

        {/* Score Card */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border border-primary/20 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Score Display */}
            <div className="text-center md:text-left">
              <ScoreDisplay score={summaryData.score} />
              <p className="text-gray-400 mt-4">
                Based on <span className="text-accent font-semibold">{summaryData.duration} minutes</span> of interview
              </p>
            </div>

            {/* Quick Stats */}
            <div className="space-y-4">
              <div className="p-4 bg-slate-700/50 rounded-lg border border-primary/20">
                <p className="text-gray-400 text-sm mb-1">Communication</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-slate-600 rounded-full overflow-hidden">
                    <div className="h-full bg-accent" style={{ width: `${summaryData.feedback.communicationScore * 10}%` }}></div>
                  </div>
                  <span className="text-white font-bold">{summaryData.feedback.communicationScore}/10</span>
                </div>
              </div>

              <div className="p-4 bg-slate-700/50 rounded-lg border border-primary/20">
                <p className="text-gray-400 text-sm mb-1">Technical Knowledge</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-slate-600 rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: `${summaryData.feedback.technicalScore * 10}%` }}></div>
                  </div>
                  <span className="text-white font-bold">{summaryData.feedback.technicalScore}/10</span>
                </div>
              </div>

              <div className="p-4 bg-slate-700/50 rounded-lg border border-primary/20">
                <p className="text-gray-400 text-sm mb-1">Confidence</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-slate-600 rounded-full overflow-hidden">
                    <div className="h-full bg-warning" style={{ width: `${summaryData.feedback.confidenceScore * 10}%` }}></div>
                  </div>
                  <span className="text-white font-bold">{summaryData.feedback.confidenceScore}/10</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feedback Sections */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Strengths */}
          <FeedbackSection
            title="Strengths"
            items={summaryData.feedback.strengths}
            type="success"
            icon="✓"
          />

          {/* Weaknesses */}
          <FeedbackSection
            title="Areas for Improvement"
            items={summaryData.feedback.weaknesses}
            type="warning"
            icon="!"
          />
        </div>

        {/* Filler Words Stats */}
        <div className="mb-8">
          <FillerWordStats stats={summaryData.feedback.fillerWords} />
        </div>

        {/* Detailed Insights */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border border-primary/20 mb-8">
          <h3 className="text-2xl font-bold text-white mb-6">Detailed Insights</h3>
          
          <div className="space-y-6">
            <div>
              <h4 className="text-lg font-bold text-accent mb-3">Communication</h4>
              <p className="text-gray-300 leading-relaxed">
                Your communication was clear and well-structured. You explained concepts effectively and maintained good pacing throughout the interview. Try to avoid hesitations and use more confident language when discussing your expertise.
              </p>
            </div>

            <div className="border-t border-primary/20 pt-6">
              <h4 className="text-lg font-bold text-accent mb-3">Technical Depth</h4>
              <p className="text-gray-300 leading-relaxed">
                You demonstrated solid technical knowledge. Consider providing more specific examples from real projects and diving deeper into edge cases and optimization techniques. This will help you stand out in technical interviews.
              </p>
            </div>

            <div className="border-t border-primary/20 pt-6">
              <h4 className="text-lg font-bold text-accent mb-3">Next Steps</h4>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 bg-accent rounded-full mt-2 flex-shrink-0"></span>
                  <span>Practice speaking with fewer filler words - record yourself practicing</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 bg-accent rounded-full mt-2 flex-shrink-0"></span>
                  <span>Prepare specific STAR method examples for common questions</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 bg-accent rounded-full mt-2 flex-shrink-0"></span>
                  <span>Research the company more thoroughly before interviews</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 bg-accent rounded-full mt-2 flex-shrink-0"></span>
                  <span>Practice mock interviews regularly to build confidence</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <button
            onClick={handleDownloadReport}
            className="px-6 py-3 bg-slate-700/50 text-white font-bold rounded-lg hover:bg-slate-700 transition flex items-center justify-center gap-2 border border-primary/20"
          >
            <Download size={20} />
            Download Report
          </button>

          <button
            onClick={handleShare}
            className="px-6 py-3 bg-slate-700/50 text-white font-bold rounded-lg hover:bg-slate-700 transition flex items-center justify-center gap-2 border border-primary/20"
          >
            <Share2 size={20} />
            {copied ? 'Copied!' : 'Share'}
          </button>

          <Link
            to="/setup-interview"
            className="px-6 py-3 bg-primary text-white font-bold rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2"
          >
            Practice Again
            <ArrowRight size={20} />
          </Link>
        </div>

        {/* Go to Dashboard */}
        <div className="text-center">
          <p className="text-gray-400 mb-4">
            View all your interviews and track your progress
          </p>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-primary font-bold hover:text-accent transition"
          >
            Go to Dashboard
            <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    </div>
  )
}
