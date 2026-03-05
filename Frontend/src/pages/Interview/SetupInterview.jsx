import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { interviewService } from '../../services/interviewService';
import { Upload, Loader, ChevronRight } from 'lucide-react';

const JOB_ROLES = ['Software Engineer', 'Product Manager', 'Data Scientist', 'Designer', 'Sales', 'Marketing'];
const JOB_DOMAINS = ['Frontend', 'Backend', 'Full Stack', 'DevOps', 'ML/AI', 'Mobile'];

export default function SetupInterview() {
  const [step, setStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('');
  const [resumeText, setResumeText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const text = await file.text();
      setResumeText(text);
    }
  };

  const handleStartInterview = async () => {
    if (!selectedRole || !selectedDomain) {
      setError('Please select both role and domain');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const interview = await interviewService.createInterview(
        user.id,
        selectedRole,
        selectedDomain,
        resumeText || null
      );
      navigate(`/interview/${interview.id}`);
    } catch (err) {
      setError('Failed to create interview');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Set Up Your Interview</h1>
          <p className="text-white/60">Step {step} of 3</p>
          <div className="mt-4 w-full bg-white/10 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all"
              style={{ width: `${(step / 3) * 100}%` }}
            ></div>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {step === 1 && (
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Select Job Role</h2>
            <div className="grid grid-cols-2 gap-4">
              {JOB_ROLES.map((role) => (
                <button
                  key={role}
                  onClick={() => setSelectedRole(role)}
                  className={`p-4 rounded-lg border-2 transition ${
                    selectedRole === role
                      ? 'bg-blue-500/20 border-blue-500'
                      : 'bg-white/5 border-white/10 hover:border-white/20'
                  } text-white`}
                >
                  {role}
                </button>
              ))}
            </div>
            <button
              onClick={() => {
                if (selectedRole) setStep(2);
                else setError('Please select a role');
              }}
              className="mt-8 w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 rounded-lg font-medium hover:opacity-90 flex items-center justify-center gap-2"
            >
              Continue <ChevronRight size={20} />
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Select Domain</h2>
            <div className="grid grid-cols-2 gap-4">
              {JOB_DOMAINS.map((domain) => (
                <button
                  key={domain}
                  onClick={() => setSelectedDomain(domain)}
                  className={`p-4 rounded-lg border-2 transition ${
                    selectedDomain === domain
                      ? 'bg-blue-500/20 border-blue-500'
                      : 'bg-white/5 border-white/10 hover:border-white/20'
                  } text-white`}
                >
                  {domain}
                </button>
              ))}
            </div>
            <div className="flex gap-4 mt-8">
              <button
                onClick={() => setStep(1)}
                className="flex-1 bg-white/5 border border-white/10 text-white py-3 rounded-lg font-medium hover:bg-white/10"
              >
                Back
              </button>
              <button
                onClick={() => {
                  if (selectedDomain) setStep(3);
                  else setError('Please select a domain');
                }}
                className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 rounded-lg font-medium hover:opacity-90 flex items-center justify-center gap-2"
              >
                Continue <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Upload Resume (Optional)</h2>
            <p className="text-white/60 mb-6">
              Upload your resume so the AI can tailor questions to your experience level.
            </p>

            <div className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center mb-8">
              <label className="cursor-pointer">
                <Upload className="mx-auto text-white/40 mb-4" size={32} />
                <p className="text-white font-medium">Click to upload or paste text</p>
                <p className="text-white/60 text-sm">PDF, DOC, or TXT</p>
                <input
                  type="file"
                  onChange={handleFileUpload}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.txt"
                />
              </label>
            </div>

            {resumeText && (
              <div className="bg-white/5 rounded-lg p-4 mb-6 max-h-40 overflow-y-auto">
                <p className="text-white/60 text-sm mb-2">Resume Preview:</p>
                <p className="text-white text-sm">{resumeText.substring(0, 200)}...</p>
              </div>
            )}

            <div className="flex gap-4">
              <button
                onClick={() => setStep(2)}
                className="flex-1 bg-white/5 border border-white/10 text-white py-3 rounded-lg font-medium hover:bg-white/10"
              >
                Back
              </button>
              <button
                onClick={handleStartInterview}
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 rounded-lg font-medium hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading && <Loader size={20} className="animate-spin" />}
                {loading ? 'Starting...' : 'Start Interview'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
