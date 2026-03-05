import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { interviewService } from '../../services/interviewService';
import { Lightbulb } from 'lucide-react';

export default function Insights() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [interviews, setInterviews] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [insights, setInsights] = useState({
    topWeakness: '',
    topStrength: '',
    recommendations: [],
  });

  useEffect(() => {
    loadInsights();
  }, [user]);

  const loadInsights = async () => {
    try {
      const userInterviews = await interviewService.getUserInterviews(user.id);
      setInterviews(userInterviews);

      const allFeedback = [];
      for (const interview of userInterviews) {
        const fb = await interviewService.getFeedback(interview.id);
        allFeedback.push(...fb);
      }
      setFeedback(allFeedback);

      if (allFeedback.length > 0) {
        const weaknesses = {};
        const strengths = {};

        allFeedback.forEach(f => {
          if (f.weaknesses) {
            f.weaknesses.split(',').forEach(w => {
              weaknesses[w.trim()] = (weaknesses[w.trim()] || 0) + 1;
            });
          }
          if (f.strengths) {
            f.strengths.split(',').forEach(s => {
              strengths[s.trim()] = (strengths[s.trim()] || 0) + 1;
            });
          }
        });

        const topWeakness = Object.entries(weaknesses).sort((a, b) => b[1] - a[1])[0]?.[0] || 'None';
        const topStrength = Object.entries(strengths).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Good communication';

        const recommendations = [
          'Practice the STAR method for behavioral questions',
          'Record yourself and listen for filler words',
          'Research the company and role thoroughly',
          'Practice technical concepts relevant to the role',
          'Do a mock interview with a friend',
        ];

        setInsights({
          topWeakness,
          topStrength,
          recommendations,
        });
      }
    } catch (error) {
      console.error('Failed to load insights:', error);
    } finally {
      setLoading(false);
    }
  };

  const completed = interviews.filter(i => i.status === 'completed');
  const totalScore = completed.reduce((sum, i) => sum + (i.overall_score || 0), 0);
  const avgScore = completed.length > 0 ? Math.round(totalScore / completed.length) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">AI-Powered Insights</h1>
          <p className="text-white/60">Personalized recommendations based on your performance</p>
        </div>

        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-white/5 border border-white/10 text-white py-3 rounded-lg font-medium hover:bg-white/10"
          >
            Overview
          </button>
          <button
            onClick={() => navigate('/dashboard/history')}
            className="bg-white/5 border border-white/10 text-white py-3 rounded-lg font-medium hover:bg-white/10"
          >
            History
          </button>
          <button
            onClick={() => navigate('/dashboard/performance')}
            className="bg-white/5 border border-white/10 text-white py-3 rounded-lg font-medium hover:bg-white/10"
          >
            Performance
          </button>
          <button
            onClick={() => navigate('/dashboard/insights')}
            className="bg-blue-500/20 border border-blue-500 text-blue-400 py-3 rounded-lg font-medium hover:opacity-90"
          >
            Insights
          </button>
        </div>

        {loading ? (
          <p className="text-white/60">Loading...</p>
        ) : completed.length === 0 ? (
          <div className="text-center py-12 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl">
            <Lightbulb className="mx-auto text-white/40 mb-4" size={48} />
            <p className="text-white/60">Complete some interviews to see insights</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                <p className="text-white/60 text-sm mb-2">Overall Performance</p>
                <p className="text-4xl font-bold text-cyan-400">{avgScore}</p>
                <p className="text-white/60 text-xs mt-2">Based on {completed.length} interviews</p>
              </div>
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                <p className="text-white/60 text-sm mb-2">Top Strength</p>
                <p className="text-xl font-bold text-green-400">{insights.topStrength}</p>
              </div>
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                <p className="text-white/60 text-sm mb-2">Area to Improve</p>
                <p className="text-xl font-bold text-yellow-400">{insights.topWeakness}</p>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Personalized Recommendations</h2>
              <div className="space-y-4">
                {insights.recommendations.map((rec, idx) => (
                  <div key={idx} className="flex gap-4 p-4 bg-white/[0.03] rounded-lg border border-white/5">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                      <span className="text-blue-400 font-bold text-sm">{idx + 1}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-white">{rec}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
                <h3 className="text-xl font-bold text-white mb-4">Quick Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-white/60">Total Interviews</span>
                    <span className="text-white font-bold">{interviews.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Completed</span>
                    <span className="text-white font-bold">{completed.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">In Progress</span>
                    <span className="text-white font-bold">{interviews.length - completed.length}</span>
                  </div>
                  <div className="flex justify-between pt-3 border-t border-white/10">
                    <span className="text-white/60">Success Rate</span>
                    <span className="text-white font-bold">{completed.length > 0 ? Math.round((completed.filter(i => i.overall_score >= 70).length / completed.length) * 100) : 0}%</span>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
                <h3 className="text-xl font-bold text-white mb-4">Next Steps</h3>
                <ul className="space-y-3 text-white/60 text-sm">
                  <li>• Complete more interviews to track progress</li>
                  <li>• Focus on your identified weaknesses</li>
                  <li>• Practice with different job roles</li>
                  <li>• Review detailed feedback after each interview</li>
                  <li>• Keep improving your communication skills</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
