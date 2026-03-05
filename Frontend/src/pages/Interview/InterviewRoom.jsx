import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { interviewService } from '../../services/interviewService';
import { aiService } from '../../services/aiService';
import { Loader, Send, Mic, Square } from 'lucide-react';

const TOTAL_QUESTIONS = 5;

export default function InterviewRoom() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [interview, setInterview] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [responses, setResponses] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [responseText, setResponseText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    initializeInterview();
  }, [id]);

  const initializeInterview = async () => {
    try {
      const interviewData = await interviewService.getInterview(id);
      setInterview(interviewData);

      const existingQuestions = await interviewService.getInterviewQuestions(id);
      if (existingQuestions.length === 0) {
        await generateNextQuestion(1);
      } else {
        setQuestions(existingQuestions);
        setCurrentQuestion(existingQuestions.length + 1);
      }

      const existingResponses = await interviewService.getResponses(id);
      setResponses(existingResponses);
    } catch (err) {
      setError('Failed to load interview');
      console.error(err);
    }
  };

  const generateNextQuestion = async (questionNum) => {
    try {
      const questionsToPass = questions.slice(0, Math.max(0, questionNum - 1));
      const result = await aiService.generateQuestion(
        interview.job_role,
        interview.job_domain,
        questionNum,
        questionsToPass
      );

      const newQuestion = await interviewService.addQuestion(
        id,
        questionNum,
        result.question_text,
        result.question_type
      );

      setQuestions([...questions, newQuestion]);
      return newQuestion;
    } catch (err) {
      setError('Failed to generate question');
      console.error(err);
    }
  };

  const handleSubmitResponse = async () => {
    if (!responseText.trim()) {
      setError('Please provide a response');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const currentQ = questions[currentQuestion - 1];
      const response = await interviewService.addResponse(id, currentQ.id, responseText);

      const feedback = await aiService.evaluateResponse(
        currentQ.question_text,
        responseText,
        interview.job_role
      );

      await interviewService.addFeedback(id, response.id, feedback);

      setResponses([...responses, { ...response, feedback }]);
      setResponseText('');

      if (currentQuestion < TOTAL_QUESTIONS) {
        const newQuestion = await generateNextQuestion(currentQuestion + 1);
        setCurrentQuestion(currentQuestion + 1);
      } else {
        const allFeedback = [feedback];
        for (let i = 0; i < responses.length; i++) {
          const resp = responses[i];
          const q = questions[i];
          const fb = await aiService.evaluateResponse(q.question_text, resp.response_text, interview.job_role);
          allFeedback.push(fb);
        }

        const synthesis = await aiService.synthesizeFeedback(allFeedback);
        await interviewService.updateInterviewScore(id, synthesis.overall_score, TOTAL_QUESTIONS);
        await interviewService.updateInterviewStatus(id, 'completed');

        navigate(`/interview/${id}/summary`);
      }
    } catch (err) {
      setError('Failed to submit response');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
  };

  if (!interview || questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <Loader className="animate-spin text-white" size={40} />
      </div>
    );
  }

  const currentQ = questions[currentQuestion - 1];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-white">Interview in Progress</h1>
            <span className="text-white/60">Question {currentQuestion} of {TOTAL_QUESTIONS}</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all"
              style={{ width: `${(currentQuestion / TOTAL_QUESTIONS) * 100}%` }}
            ></div>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 mb-6">
              <p className="text-blue-400 text-sm font-medium mb-3">{currentQ.question_type}</p>
              <h2 className="text-2xl font-bold text-white mb-6">{currentQ.question_text}</h2>

              <div className="space-y-4">
                <textarea
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  placeholder="Type your response here... (or use voice recording below)"
                  className="w-full h-32 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-white/20 focus:bg-white/10 resize-none"
                />

                <div className="flex gap-2">
                  <button
                    onClick={toggleRecording}
                    className={`flex-1 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition ${
                      isRecording
                        ? 'bg-red-500/20 border border-red-500 text-red-400'
                        : 'bg-white/5 border border-white/10 text-white hover:bg-white/10'
                    }`}
                  >
                    {isRecording ? <Square size={18} /> : <Mic size={18} />}
                    {isRecording ? 'Stop Recording' : 'Start Recording'}
                  </button>

                  <button
                    onClick={handleSubmitResponse}
                    disabled={loading || !responseText.trim()}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 rounded-lg font-medium hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2 transition"
                  >
                    {loading && <Loader size={18} className="animate-spin" />}
                    <Send size={18} />
                    {loading ? 'Submitting...' : 'Submit Response'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <h3 className="text-white font-bold mb-4">Interview Info</h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-white/60">Role</p>
                <p className="text-white">{interview.job_role}</p>
              </div>
              <div>
                <p className="text-white/60">Domain</p>
                <p className="text-white">{interview.job_domain}</p>
              </div>
              <div>
                <p className="text-white/60">Progress</p>
                <p className="text-white">{currentQuestion} / {TOTAL_QUESTIONS}</p>
              </div>
            </div>

            <button
              onClick={() => navigate('/dashboard')}
              className="w-full mt-6 bg-white/5 border border-white/10 text-white py-2 rounded-lg hover:bg-white/10 text-sm"
            >
              Exit Interview
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
