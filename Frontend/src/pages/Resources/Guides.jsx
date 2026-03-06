import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Lightbulb, Users, Zap } from 'lucide-react';

const GUIDES = [
  {
    id: 1,
    title: 'The STAR Method',
    description: 'Master the Situation, Task, Action, Result framework',
    category: 'Behavioral',
    icon: Lightbulb,
    content: [
      'Situation: Describe the context and challenge',
      'Task: Explain what you were responsible for',
      'Action: Detail the specific steps you took',
      'Result: Share the outcome and impact',
      'Pro tip: Quantify your results with metrics',
    ],
  },
  {
    id: 2,
    title: 'Technical Interview Prep',
    description: 'Prepare for coding and technical questions',
    category: 'Technical',
    icon: Zap,
    content: [
      'Review common data structures and algorithms',
      'Practice on LeetCode or HackerRank',
      'Explain your approach before coding',
      'Write clean, well-commented code',
      'Test edge cases and optimize solutions',
    ],
  },
  {
    id: 3,
    title: 'Communication Skills',
    description: 'Improve clarity and confidence in your delivery',
    category: 'Communication',
    icon: Users,
    content: [
      'Speak clearly and at a moderate pace',
      'Avoid filler words (um, uh, like, you know)',
      'Make eye contact and use confident body language',
      'Listen actively to the interviewer',
      'Ask clarifying questions when unsure',
    ],
  },
  {
    id: 4,
    title: 'Company Research',
    description: 'Research and prepare for specific companies',
    category: 'Preparation',
    icon: BookOpen,
    content: [
      'Understand the company mission and values',
      'Research recent news and achievements',
      'Study the job description thoroughly',
      'Prepare role-specific examples',
      'Have questions ready about the role and company',
    ],
  },
];

export default function Guides() {
  const navigate = useNavigate();
  const [selectedGuide, setSelectedGuide] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Interview Preparation Guides</h1>
          <p className="text-white/60">Master the skills you need to ace your interviews</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {GUIDES.map((guide) => {
            const Icon = guide.icon;
            return (
              <div
                key={guide.id}
                onClick={() => setSelectedGuide(guide)}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 cursor-pointer hover:border-white/20 transition"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-3 bg-blue-500/20 rounded-lg">
                    <Icon className="text-blue-400" size={24} />
                  </div>
                  <div className="flex-1">
                    <p className="text-blue-400 text-sm font-medium">{guide.category}</p>
                    <h3 className="text-xl font-bold text-white">{guide.title}</h3>
                  </div>
                </div>
                <p className="text-white/60 text-sm">{guide.description}</p>
              </div>
            );
          })}
        </div>

        {selectedGuide && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-900 border border-white/10 rounded-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <button
                onClick={() => setSelectedGuide(null)}
                className="float-right text-white/60 hover:text-white mb-4"
              >
                ✕
              </button>

              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-blue-500/20 rounded-lg">
                  <selectedGuide.icon className="text-blue-400" size={28} />
                </div>
                <div>
                  <p className="text-blue-400 text-sm font-medium">{selectedGuide.category}</p>
                  <h2 className="text-3xl font-bold text-white">{selectedGuide.title}</h2>
                </div>
              </div>

              <div className="space-y-4">
                {selectedGuide.content.map((item, idx) => (
                  <div key={idx} className="flex gap-4 p-4 bg-white/[0.03] rounded-lg border border-white/5">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                      <span className="text-blue-400 font-bold text-sm">{idx + 1}</span>
                    </div>
                    <p className="text-white/80 pt-1">{item}</p>
                  </div>
                ))}
              </div>

              <button
                onClick={() => {
                  setSelectedGuide(null);
                  navigate('/interview/setup');
                }}
                className="w-full mt-8 bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 rounded-lg font-medium hover:opacity-90"
              >
                Practice Now
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
