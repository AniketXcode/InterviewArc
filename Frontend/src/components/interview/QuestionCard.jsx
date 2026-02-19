import { MessageCircle, Zap } from 'lucide-react'

export default function QuestionCard({ question }) {
  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border border-primary/20 h-full flex flex-col">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
            <MessageCircle className="text-primary" size={20} />
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide">Current Question</p>
            <p className="text-sm font-semibold text-white">{question.category}</p>
          </div>
        </div>
      </div>

      {/* Question Text */}
      <div className="flex-1">
        <p className="text-xl font-bold text-white leading-relaxed mb-8">
          {question.text}
        </p>

        {/* Difficulty Badge */}
        <div className="flex items-center gap-2 mb-6">
          <Zap size={16} className="text-accent" />
          <span className="text-sm font-semibold text-accent">{question.difficulty}</span>
        </div>
      </div>

      {/* Tips Section */}
      <div className="pt-6 border-t border-primary/20">
        <p className="text-xs text-gray-400 uppercase tracking-wide mb-3">Tips for answering:</p>
        <ul className="space-y-2 text-sm text-gray-300">
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 bg-accent rounded-full mt-1.5 flex-shrink-0"></span>
            <span>Structure your answer clearly</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 bg-accent rounded-full mt-1.5 flex-shrink-0"></span>
            <span>Provide concrete examples</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 bg-accent rounded-full mt-1.5 flex-shrink-0"></span>
            <span>Show your thought process</span>
          </li>
        </ul>
      </div>
    </div>
  )
}
