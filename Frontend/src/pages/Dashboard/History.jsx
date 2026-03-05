import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { interviewService } from '../../services/interviewService';
import { Clock } from 'lucide-react';

export default function History() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, [user]);

  const loadHistory = async () => {
    try {
      const userInterviews = await interviewService.getUserInterviews(user.id);
      setInterviews(userInterviews);
    } catch (error) {
      console.error('Failed to load history:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Interview History</h1>
          <p className="text-white/60">All your interview attempts</p>
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
            className="bg-blue-500/20 border border-blue-500 text-blue-400 py-3 rounded-lg font-medium hover:opacity-90"
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

        {loading ? (
          <p className="text-white/60">Loading...</p>
        ) : interviews.length === 0 ? (
          <div className="text-center py-12 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl">
            <Clock className="mx-auto text-white/40 mb-4" size={48} />
            <p className="text-white/60">No interviews yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {interviews.map((interview) => (
              <div
                key={interview.id}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 cursor-pointer hover:border-white/20 transition"
                onClick={() => {
                  if (interview.status === 'completed') {
                    navigate(`/interview/${interview.id}/summary`);
                  }
                }}
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-white">
                        {interview.job_role}
                      </h3>
                      <span className="px-3 py-1 rounded-lg text-sm font-medium bg-white/10">
                        {interview.job_domain}
                      </span>
                    </div>
                    <p className="text-white/60 text-sm">
                      {new Date(interview.created_at).toLocaleDateString()} at{' '}
                      {new Date(interview.created_at).toLocaleTimeString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-6">
                    <div>
                      <p className="text-white/60 text-sm">Questions</p>
                      <p className="text-white font-bold">
                        {interview.completed_questions || 0}/{interview.total_questions || 5}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-white/60 text-sm mb-1">Score</p>
                      <p className={`text-2xl font-bold ${
                        interview.overall_score >= 80 ? 'text-green-400' :
                        interview.overall_score >= 70 ? 'text-yellow-400' :
                        interview.overall_score > 0 ? 'text-red-400' : 'text-white/40'
                      }`}>
                        {interview.overall_score || '-'}
                      </p>
                    </div>

                    <span className={`px-3 py-1 rounded-lg text-sm font-medium ${
                      interview.status === 'completed'
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {interview.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
