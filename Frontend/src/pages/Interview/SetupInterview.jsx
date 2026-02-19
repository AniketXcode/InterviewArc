import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Upload, Play, Loader } from 'lucide-react'
import RoleSelector from '../../components/interview/RoleSelector'
import DifficultySelector from '../../components/interview/DifficultySelector'
import ResumeUpload from '../../components/interview/ResumeUpload'

export default function SetupInterview() {
  const [role, setRole] = useState('')
  const [difficulty, setDifficulty] = useState('')
  const [duration, setDuration] = useState('15')
  const [resumeFile, setResumeFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const roles = [
    { value: 'mern', label: 'MERN Stack Developer' },
    { value: 'java', label: 'Java Developer' },
    { value: 'fullstack', label: 'Full Stack Developer' },
    { value: 'frontend', label: 'Frontend Developer' },
    { value: 'backend', label: 'Backend Developer' },
    { value: 'devops', label: 'DevOps Engineer' },
    { value: 'data', label: 'Data Scientist' },
    { value: 'hr', label: 'HR Generalist' }
  ]

  const difficulties = [
    { value: 'junior', label: 'Junior', description: 'Entry-level, fundamentals' },
    { value: 'mid', label: 'Mid-level', description: 'Intermediate, hands-on' },
    { value: 'senior', label: 'Senior', description: 'Advanced, leadership' }
  ]

  const durations = [
    { value: '10', label: '10 mins' },
    { value: '15', label: '15 mins' },
    { value: '20', label: '20 mins' },
    { value: '30', label: '30 mins' }
  ]

  const handleStartInterview = async () => {
    if (!role || !difficulty) {
      alert('Please select role and difficulty level')
      return
    }

    setLoading(true)
    // Simulate loading and API call
    setTimeout(() => {
      setLoading(false)
      navigate('/interview', {
        state: {
          role,
          difficulty,
          duration,
          resumeFile
        }
      })
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary via-secondary to-slate-900 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">Setup Your Interview</h1>
          <p className="text-xl text-gray-400">Customize your AI interview experience</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Section - Setup Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Role Selection */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border border-primary/20">
              <h2 className="text-2xl font-bold text-white mb-6">Select Your Role</h2>
              <RoleSelector
                roles={roles}
                selectedRole={role}
                onRoleSelect={setRole}
              />
            </div>

            {/* Difficulty Selection */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border border-primary/20">
              <h2 className="text-2xl font-bold text-white mb-6">Choose Difficulty Level</h2>
              <DifficultySelector
                difficulties={difficulties}
                selectedDifficulty={difficulty}
                onDifficultySelect={setDifficulty}
              />
            </div>

            {/* Duration Selection */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border border-primary/20">
              <h2 className="text-2xl font-bold text-white mb-6">Interview Duration</h2>
              <div className="grid grid-cols-4 gap-3">
                {durations.map(d => (
                  <button
                    key={d.value}
                    onClick={() => setDuration(d.value)}
                    className={`py-3 px-4 rounded-lg font-semibold transition ${
                      duration === d.value
                        ? 'bg-primary text-white'
                        : 'bg-slate-700/50 text-gray-300 hover:bg-slate-700 border border-primary/20'
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Resume Upload */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border border-primary/20">
              <h2 className="text-2xl font-bold text-white mb-6">Upload Your Resume (Optional)</h2>
              <ResumeUpload onFileSelect={setResumeFile} />
              {resumeFile && (
                <div className="mt-4 p-4 bg-success/10 border border-success/30 rounded-lg flex items-center gap-3">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  <p className="text-success text-sm">{resumeFile.name} uploaded successfully</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Section - Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border border-accent/30 sticky top-8">
              <h3 className="text-xl font-bold text-white mb-6">Interview Summary</h3>
              
              <div className="space-y-4 mb-8">
                <div>
                  <p className="text-gray-400 text-sm">Role</p>
                  <p className="text-white font-semibold">
                    {role ? roles.find(r => r.value === role)?.label : 'Not selected'}
                  </p>
                </div>

                <div>
                  <p className="text-gray-400 text-sm">Difficulty</p>
                  <p className="text-white font-semibold capitalize">
                    {difficulty ? difficulties.find(d => d.value === difficulty)?.label : 'Not selected'}
                  </p>
                </div>

                <div>
                  <p className="text-gray-400 text-sm">Duration</p>
                  <p className="text-white font-semibold">{duration} minutes</p>
                </div>

                <div>
                  <p className="text-gray-400 text-sm">Resume</p>
                  <p className="text-white font-semibold">
                    {resumeFile ? 'Uploaded' : 'Not provided'}
                  </p>
                </div>
              </div>

              {/* Key Features */}
              <div className="mb-8 pb-8 border-b border-primary/20">
                <p className="text-gray-400 text-sm mb-4 font-semibold">What to expect:</p>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center gap-3 text-gray-300">
                    <span className="w-1.5 h-1.5 bg-accent rounded-full"></span>
                    Real-time AI feedback
                  </li>
                  <li className="flex items-center gap-3 text-gray-300">
                    <span className="w-1.5 h-1.5 bg-accent rounded-full"></span>
                    Adaptive questions
                  </li>
                  <li className="flex items-center gap-3 text-gray-300">
                    <span className="w-1.5 h-1.5 bg-accent rounded-full"></span>
                    Performance metrics
                  </li>
                  <li className="flex items-center gap-3 text-gray-300">
                    <span className="w-1.5 h-1.5 bg-accent rounded-full"></span>
                    Voice & text support
                  </li>
                </ul>
              </div>

              {/* Start Button */}
              <button
                onClick={handleStartInterview}
                disabled={!role || !difficulty || loading}
                className="w-full py-4 bg-gradient-to-r from-primary to-accent text-white font-bold rounded-lg hover:shadow-lg transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {loading ? (
                  <>
                    <Loader size={20} className="animate-spin" />
                    Preparing...
                  </>
                ) : (
                  <>
                    <Play size={20} />
                    Start Interview
                  </>
                )}
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">
                Click start when ready. You can end the interview anytime.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
