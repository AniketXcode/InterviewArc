import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { interviewService } from '../../services/interviewService';
import { BarChart3, LogOut, Plus, TrendingUp } from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, authService } = useAuth();
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalInterviews: 0,
    averageScore: 0,
    bestScore: 0,
  });

  useEffect(() => {
    loadDashboard();
  }, [user]);

  const loadDashboard = async () => {
    try {
      const userInterviews = await interviewService.getUserInterviews(user.id);
      setInterviews(userInterviews);

      const completed = userInterviews.filter(i => i.status === 'completed');
      const scores = completed.map(i => i.overall_score || 0);

      setStats({
        totalInterviews: userInterviews.length,
        averageScore: scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b) / scores.length) : 0,
        bestScore: scores.length > 0 ? Math.max(...scores) : 0,
      });
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authService.signOut();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Welcome back!</h1>
            <p className="text-white/60">{user?.email}</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => navigate('/interview/setup')}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 flex items-center gap-2"
            >
              <Plus size={20} />
              New Interview
            </button>
            <button
              onClick={handleLogout}
              className="bg-white/5 border border-white/10 text-white px-6 py-3 rounded-lg font-medium hover:bg-white/10 flex items-center gap-2"
            >
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <p className="text-white/60 text-sm mb-2">Total Interviews</p>
            <p className="text-4xl font-bold text-white">{stats.totalInterviews}</p>
          </div>
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <p className="text-white/60 text-sm mb-2">Average Score</p>
            <p className="text-4xl font-bold text-cyan-400">{stats.averageScore}</p>
          </div>
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <p className="text-white/60 text-sm mb-2">Best Score</p>
            <p className="text-4xl font-bold text-green-400">{stats.bestScore}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-blue-500/20 border border-blue-500 text-blue-400 py-3 rounded-lg font-medium hover:opacity-90"
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
            className="bg-white/5 border border-white/10 text-white py-3 rounded-lg font-medium hover:bg-white/10"
          >
            Insights
          </button>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <BarChart3 className="text-blue-400" size={24} />
            <h2 className="text-2xl font-bold text-white">Recent Interviews</h2>
          </div>

          {loading ? (
            <p className="text-white/60">Loading...</p>
          ) : interviews.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-white/60 mb-4">No interviews yet. Start practicing!</p>
              <button
                onClick={() => navigate('/interview/setup')}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-2 rounded-lg font-medium hover:opacity-90"
              >
                Start Your First Interview
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {interviews.slice(0, 5).map((interview) => (
                <div
                  key={interview.id}
                  className="flex items-center justify-between p-4 bg-white/[0.03] rounded-lg border border-white/5 hover:border-white/10 cursor-pointer transition"
                  onClick={() => {
                    if (interview.status === 'completed') {
                      navigate(`/interview/${interview.id}/summary`);
                    }
                  }}
                >
                  <div>
                    <p className="text-white font-medium">
                      {interview.job_role} - {interview.job_domain}
                    </p>
                    <p className="text-white/60 text-sm">
                      {new Date(interview.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-block px-3 py-1 rounded-lg text-sm font-medium ${
                      interview.status === 'completed'
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {interview.status}
                    </span>
                    {interview.overall_score > 0 && (
                      <p className="text-white font-bold mt-1">{interview.overall_score}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
