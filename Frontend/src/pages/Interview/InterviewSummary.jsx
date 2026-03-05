import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { interviewService } from '../../services/interviewService';
import { ChartBar as BarChart3, Loader, ArrowRight } from 'lucide-react';

export default function InterviewSummary() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [interview, setInterview] = useState(null);
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSummary();
  }, [id]);

  const loadSummary = async () => {
    try {
      const interviewData = await interviewService.getInterview(id);
      setInterview(interviewData);

      const feedbackData = await interviewService.getFeedback(id);
      setFeedback(feedbackData);
    } catch (error) {
      console.error('Failed to load summary:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !interview) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <Loader className="animate-spin text-white" size={40} />
      </div>
    );
  }

  const scoreColor = interview.overall_score >= 80 ? 'text-green-400' : interview.overall_score >= 70 ? 'text-yellow-400' : 'text-red-400';
  const avgScore = Math.round(feedback.reduce((sum, f) => sum + (f.communication_score || 0), 0) / feedback.length);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Interview Complete!</h1>
          <p className="text-white/60">Here's your performance summary</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center">
            <BarChart3 className="mx-auto text-blue-400 mb-4" size={32} />
            <p className="text-white/60 text-sm mb-2">Overall Score</p>
            <p className={`text-5xl font-bold ${scoreColor}`}>{interview.overall_score}</p>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center">
            <p className="text-white/60 text-sm mb-2">Questions Completed</p>
            <p className="text-5xl font-bold text-white">{interview.completed_questions}</p>
            <p className="text-white/60 text-xs mt-2">out of {interview.total_questions || 5}</p>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center">
            <p className="text-white/60 text-sm mb-2">Average Clarity Score</p>
            <p className="text-5xl font-bold text-cyan-400">{avgScore}</p>
          </div>
        </div>

        <div className="space-y-6 mb-8">
          {feedback.map((item, index) => (
            <div key={item.id} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <span className="text-blue-400 font-bold">Q{index + 1}</span>
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium">Question {index + 1}</p>
                  <p className="text-white/60 text-sm">Communication Score: {item.communication_score || 0}</p>
                </div>
                <div className={`text-3xl font-bold ${
                  (item.communication_score || 0) >= 80 ? 'text-green-400' :
                  (item.communication_score || 0) >= 70 ? 'text-yellow-400' : 'text-red-400'
                }`}>
                  {item.communication_score || 0}
                </div>
              </div>

              {item.strengths && (
                <div className="mb-3">
                  <p className="text-white/80 text-sm font-medium mb-1">Strengths:</p>
                  <p className="text-white/60 text-sm">{item.strengths}</p>
                </div>
              )}

              {item.weaknesses && (
                <div className="mb-3">
                  <p className="text-white/80 text-sm font-medium mb-1">Areas to Improve:</p>
                  <p className="text-white/60 text-sm">{item.weaknesses}</p>
                </div>
              )}

              {item.improvement_tips && (
                <div>
                  <p className="text-white/80 text-sm font-medium mb-1">Tips:</p>
                  <p className="text-white/60 text-sm">{item.improvement_tips}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => navigate('/interview/setup')}
            className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 rounded-lg font-medium hover:opacity-90 flex items-center justify-center gap-2"
          >
            Try Another Interview
            <ArrowRight size={20} />
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="flex-1 bg-white/5 border border-white/10 text-white py-3 rounded-lg font-medium hover:bg-white/10"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
