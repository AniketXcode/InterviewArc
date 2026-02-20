import { useState } from 'react';
import {
  ArrowRight,
  Upload,
  Briefcase,
  Award,
  Clock,
  ChevronRight,
  File,
  X,
  Check
} from 'lucide-react';

export default function SetupInterview() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    role: '',
    seniority: '',
    duration: '30',
    resume: null
  });
  const [resumeFile, setResumeFile] = useState(null);

  const roles = [
    'Software Engineer',
    'Product Manager',
    'Data Scientist',
    'DevOps Engineer',
    'UX Designer',
    'Business Analyst'
  ];

  const seniorityLevels = [
    { id: 'entry', label: 'Entry Level', years: '0-2 years' },
    { id: 'mid', label: 'Mid-Level', years: '2-5 years' },
    { id: 'senior', label: 'Senior', years: '5-10 years' },
    { id: 'lead', label: 'Lead/Principal', years: '10+ years' }
  ];

  const durations = ['15', '30', '45', '60'];

  const handleRoleSelect = (role) => {
    setFormData({ ...formData, role });
    if (step === 1) setStep(2);
  };

  const handleSenioritySelect = (seniorityId) => {
    setFormData({ ...formData, seniority: seniorityId });
    if (step === 2) setStep(3);
  };

  const handleResumeUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setResumeFile(file);
      setFormData({ ...formData, resume: file });
    }
  };

  const handleStartInterview = () => {
    console.log('Starting interview with:', formData);
    // Navigate to InterviewRoom
  };

  return (
    <div className="min-h-screen bg-background text-text">
      {/* Fixed background elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <div className="sticky top-0 z-40 backdrop-blur-xl border-b border-border bg-background/80">
        <div className="max-w-4xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent"></div>
            <span className="font-bold text-lg">InterviewArc</span>
          </div>
          <div className="text-sm text-text-secondary">
            Step {step} of 4
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-12">
        
        {/* Step 1: Role Selection */}
        {step >= 1 && (
          <div className="mb-16 animate-slide-up">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  step === 1 || formData.role ? 'bg-primary text-text' : 'bg-surface border border-border text-text-secondary'
                }`}>
                  {formData.role ? <Check size={20} /> : '1'}
                </div>
                <div>
                  <h2 className="text-2xl font-bold">What's your target role?</h2>
                  <p className="text-text-secondary text-sm mt-1">Select the position you're interviewing for</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {roles.map((role) => (
                <button
                  key={role}
                  onClick={() => handleRoleSelect(role)}
                  className={`p-4 rounded-xl border transition group ${
                    formData.role === role
                      ? 'bg-gradient-to-br from-primary/20 to-accent/20 border-primary/50'
                      : 'bg-surface border-border hover:border-border-light'
                  }`}
                >
                  <Briefcase className={`mb-3 ${formData.role === role ? 'text-primary' : 'text-text-secondary'}`} />
                  <div className="text-sm font-medium text-left">{role}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Seniority Level */}
        {step >= 2 && formData.role && (
          <div className="mb-16 animate-slide-up">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  step === 2 || formData.seniority ? 'bg-primary text-text' : 'bg-surface border border-border text-text-secondary'
                }`}>
                  {formData.seniority ? <Check size={20} /> : '2'}
                </div>
                <div>
                  <h2 className="text-2xl font-bold">What's your experience level?</h2>
                  <p className="text-text-secondary text-sm mt-1">This helps us calibrate question difficulty</p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {seniorityLevels.map((level) => (
                <button
                  key={level.id}
                  onClick={() => handleSenioritySelect(level.id)}
                  className={`p-6 rounded-xl border transition text-left group ${
                    formData.seniority === level.id
                      ? 'bg-gradient-to-br from-primary/20 to-accent/20 border-primary/50'
                      : 'bg-surface border-border hover:border-border-light'
                  }`}
                >
                  <Award className={`mb-3 ${formData.seniority === level.id ? 'text-primary' : 'text-text-secondary'}`} />
                  <div className="font-semibold">{level.label}</div>
                  <div className="text-sm text-text-secondary mt-1">{level.years}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Session Duration */}
        {step >= 3 && formData.role && formData.seniority && (
          <div className="mb-16 animate-slide-up">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold bg-surface border border-border text-text-secondary">
                  3
                </div>
                <div>
                  <h2 className="text-2xl font-bold">How long do you have?</h2>
                  <p className="text-text-secondary text-sm mt-1">Session duration in minutes</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {durations.map((duration) => (
                <button
                  key={duration}
                  onClick={() => setFormData({ ...formData, duration })}
                  className={`p-4 rounded-xl border transition flex items-center justify-center gap-2 font-semibold ${
                    formData.duration === duration
                      ? 'bg-gradient-to-br from-primary/20 to-accent/20 border-primary/50 text-primary'
                      : 'bg-surface border-border hover:border-border-light text-text-secondary'
                  }`}
                >
                  <Clock size={18} />
                  {duration}m
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Resume Upload */}
        {step >= 4 && formData.role && formData.seniority && (
          <div className="mb-16 animate-slide-up">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold bg-surface border border-border text-text-secondary">
                  4
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Upload your resume (optional)</h2>
                  <p className="text-text-secondary text-sm mt-1">We'll tailor questions to your background</p>
                </div>
              </div>
            </div>

            <ResumeUpload 
              file={resumeFile}
              onFileSelect={handleResumeUpload}
              onClear={() => {
                setResumeFile(null);
                setFormData({ ...formData, resume: null });
              }}
            />
          </div>
        )}

        {/* Navigation Buttons */}
        {step < 4 && (
          <div className="flex gap-4 sticky bottom-0 bg-background/80 backdrop-blur-xl border-t border-border px-6 py-6 -mx-6 -mb-12">
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="px-6 py-3 rounded-full border border-border hover:bg-surface transition"
              >
                Back
              </button>
            )}
            <div className="flex-1"></div>
            <button
              onClick={() => setStep(step + 1)}
              disabled={step === 1 && !formData.role || step === 2 && !formData.seniority}
              className="px-8 py-3 rounded-full bg-gradient-to-r from-primary to-primary-light font-semibold hover:shadow-md-glass disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              Continue
              <ArrowRight size={18} />
            </button>
          </div>
        )}

        {/* Step 4 Action Buttons */}
        {step >= 4 && (
          <div className="flex gap-4 sticky bottom-0 bg-background/80 backdrop-blur-xl border-t border-border px-6 py-6 -mx-6 -mb-12">
            <button
              onClick={() => setStep(3)}
              className="px-6 py-3 rounded-full border border-border hover:bg-surface transition"
            >
              Back
            </button>
            <div className="flex-1"></div>
            <button
              onClick={handleStartInterview}
              className="px-8 py-3 rounded-full bg-gradient-to-r from-primary to-primary-light font-semibold hover:shadow-md-glass flex items-center gap-2 text-text"
            >
              Start Interview
              <ArrowRight size={18} />
            </button>
          </div>
        )}

        {/* Progress indicator */}
        <div className="mt-20 flex justify-between items-center px-6">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex items-center">
              <div
                className={`w-3 h-3 rounded-full transition ${
                  step >= s ? 'bg-primary' : 'bg-border'
                }`}
              ></div>
              {s < 4 && (
                <div
                  className={`w-12 h-1 mx-2 transition ${
                    step > s ? 'bg-primary' : 'bg-border'
                  }`}
                ></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ResumeUpload({ file, onFileSelect, onClear }) {
  return (
    <div className="space-y-6">
      <div
        className="border-2 border-dashed border-primary/30 rounded-2xl p-12 text-center bg-gradient-to-br from-primary/5 to-accent/5 transition hover:border-primary/50 cursor-pointer group"
        onDragOver={(e) => {
          e.preventDefault();
          e.currentTarget.classList.add('border-primary');
        }}
        onDragLeave={(e) => {
          e.currentTarget.classList.remove('border-primary');
        }}
        onClick={() => document.getElementById('resume-input')?.click()}
      >
        <Upload className="mx-auto mb-4 text-primary group-hover:scale-110 transition" size={32} />
        <h3 className="text-lg font-semibold mb-2">Upload your resume</h3>
        <p className="text-sm text-text-secondary mb-6">
          Drag and drop or click to browse<br />
          <span className="text-xs text-text-tertiary">PDF or DOC (max 10MB)</span>
        </p>
        <input
          id="resume-input"
          type="file"
          onChange={onFileSelect}
          className="hidden"
          accept=".pdf,.doc,.docx"
        />
      </div>

      {file && (
        <div className="bg-surface border border-border rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <File className="text-primary" />
            <div className="text-left">
              <div className="font-semibold">{file.name}</div>
              <div className="text-xs text-text-secondary">{(file.size / 1024 / 1024).toFixed(2)} MB</div>
            </div>
          </div>
          <button
            onClick={onClear}
            className="p-2 hover:bg-border rounded-lg transition"
          >
            <X size={18} />
          </button>
        </div>
      )}

      <button
        onClick={() => document.getElementById('resume-input')?.click()}
        className="w-full py-3 rounded-xl border border-border hover:bg-surface transition font-medium"
      >
        {file ? 'Change Resume' : 'Skip for Now'}
      </button>
    </div>
  );
}
