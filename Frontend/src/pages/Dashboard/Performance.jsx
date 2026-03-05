import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { interviewService } from '../../services/interviewService';
import { TrendingUp } from 'lucide-react';

export default function Performance() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    avgScore: 0,
    trend: 0,
    bestRole: '',
    totalQuestions: 0,
  });

  useEffect(() => {
    loadPerformance();
  }, [user]);

  const loadPerformance = async () => {
    try {
      const userInterviews = await interviewService.getUserInterviews(user.id);
      setInterviews(userInterviews);

      const completed = userInterviews.filter(i => i.status === 'completed');
      const scores = completed.map(i => i.overall_score || 0);

      if (scores.length > 0) {
        const avgScore = Math.round(scores.reduce((a, b) => a + b) / scores.length);
        const trend = scores.length > 1 ? scores[0] - scores[scores.length - 1] : 0;

        const roleScores = {};
        completed.forEach(i => {
          if (!roleScores[i.job_role]) roleScores[i.job_role] = [];
          roleScores[i.job_role].push(i.overall_score || 0);
        });

        let bestRole = '';
        let bestAvg = 0;
        Object.entries(roleScores).forEach(([role, scores]) => {
          const avg = scores.reduce((a, b) => a + b) / scores.length;
          if (avg > bestAvg) {
            bestAvg = avg;
            bestRole = role;
          }
        });

        const totalQuestions = completed.reduce((sum, i) => sum + (i.completed_questions || 0), 0);

        setStats({
          avgScore,
          trend,
          bestRole,
          totalQuestions,
        });
      }
    } catch (error) {
      console.error('Failed to load performance:', error);
    } finally {
      setLoading(false);
    }
  };

  const completed = interviews.filter(i => i.status === 'completed');
  const byRole = {};
  completed.forEach(i => {
    if (!byRole[i.job_role]) byRole[i.job_role] = [];
    byRole[i.job_role].push(i);
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Performance Analytics</h1>
          <p className="text-white/60">Detailed insights into your interview performance</p>
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
            className="bg-blue-500/20 border border-blue-500 text-blue-400 py-3 rounded-lg font-medium hover:opacity-90"
          >
            Performance
          </button>
          <button
            onClick={() => navigate('/dashboard/insights')}
            className="bg-white/5 border border-white/10 text-white py-3 rounded-lg font-medium hover:bg-white/10"
          >
            Insights
          </button>
        </div>

        {loading ? (
          <p className="text-white/60">Loading...</p>
        ) : completed.length === 0 ? (
          <div className="text-center py-12 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl">
            <TrendingUp className="mx-auto text-white/40 mb-4" size={48} />
            <p className="text-white/60">No completed interviews yet</p>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                <p className="text-white/60 text-sm mb-2">Average Score</p>
                <p className="text-4xl font-bold text-cyan-400">{stats.avgScore}</p>
                <p className="text-white/60 text-xs mt-2">
                  {stats.trend > 0 ? '↑' : stats.trend < 0 ? '↓' : '→'} {Math.abs(stats.trend)} points
                </p>
              </div>
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                <p className="text-white/60 text-sm mb-2">Best Role</p>
                <p className="text-2xl font-bold text-white">{stats.bestRole || 'N/A'}</p>
              </div>
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                <p className="text-white/60 text-sm mb-2">Total Questions</p>
                <p className="text-4xl font-bold text-green-400">{stats.totalQuestions}</p>
              </div>
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                <p className="text-white/60 text-sm mb-2">Interviews Completed</p>
                <p className="text-4xl font-bold text-blue-400">{completed.length}</p>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Performance by Role</h2>
              <div className="space-y-4">
                {Object.entries(byRole).map(([role, roleInterviews]) => {
                  const roleScores = roleInterviews.map(i => i.overall_score || 0);
                  const roleAvg = Math.round(roleScores.reduce((a, b) => a + b) / roleScores.length);
                  const maxScore = Math.max(...roleScores);
                  const minScore = Math.min(...roleScores);

                  return (
                    <div key={role} className="p-4 bg-white/[0.03] rounded-lg border border-white/5">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-white font-medium">{role}</p>
                        <span className="text-white/60 text-sm">{roleInterviews.length} interviews</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2 mb-3">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full"
                          style={{ width: `${roleAvg}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-sm text-white/60">
                        <span>Avg: {roleAvg}</span>
                        <span>Best: {maxScore}</span>
                        <span>Worst: {minScore}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
