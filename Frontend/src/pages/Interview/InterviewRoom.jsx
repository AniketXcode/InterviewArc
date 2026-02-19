import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mic, MicOff, Send, X, RotateCcw } from 'lucide-react'
import QuestionCard from '../../components/interview/QuestionCard'
import Timer from '../../components/interview/Timer'
import VoiceInput from '../../components/interview/VoiceInput'
import ChatInterface from '../../components/interview/ChatInterface'
import StressIndicator from '../../components/interview/StressIndicator'

export default function InterviewRoom() {
  const navigate = useNavigate()
  const [messages, setMessages] = useState([
    {
      type: 'ai',
      content: 'Hello! I\'m your AI interviewer. Let\'s discuss your experience with React. Tell me about your most recent project where you used React.',
      timestamp: new Date()
    }
  ])
  const [currentQuestion, setCurrentQuestion] = useState({
    text: 'Tell me about your most recent project where you used React.',
    category: 'Technical',
    difficulty: 'Mid-level'
  })
  const [userResponse, setUserResponse] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [showStressIndicator, setShowStressIndicator] = useState(true)
  const [stressLevel, setStressLevel] = useState(35) // 0-100
  const [timeRemaining, setTimeRemaining] = useState(15 * 60) // 15 minutes
  const [isInterviewActive, setIsInterviewActive] = useState(true)

  // Timer countdown
  useEffect(() => {
    if (!isInterviewActive) return
    
    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 0) {
          setIsInterviewActive(false)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isInterviewActive])

  // Simulate stress level changes based on silence
  useEffect(() => {
    const timer = setTimeout(() => {
      if (userResponse.length === 0 && isListening) {
        setStressLevel(prev => Math.min(100, prev + 2))
      }
    }, 1000)
    return () => clearTimeout(timer)
  }, [userResponse, isListening])

  const handleSendResponse = () => {
    if (!userResponse.trim()) return

    // Add user message
    const newMessages = [
      ...messages,
      {
        type: 'user',
        content: userResponse,
        timestamp: new Date()
      }
    ]

    // Simulate AI response
    const aiResponses = [
      'That\'s a great point. Can you elaborate on how you handled state management in that project?',
      'Interesting approach. What challenges did you face and how did you overcome them?',
      'That sounds like a solid implementation. How would you optimize this for performance?',
      'Good explanation. Let\'s move on to the next topic. Tell me about your experience with backend technologies.'
    ]

    const randomAiResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)]
    
    newMessages.push({
      type: 'ai',
      content: randomAiResponse,
      timestamp: new Date()
    })

    setMessages(newMessages)
    setUserResponse('')
    setStressLevel(prev => Math.max(0, prev - 5)) // Reduce stress when responding
  }

  const handleEndInterview = () => {
    navigate('/interview-summary', {
      state: {
        score: 7.5,
        messages,
        duration: 15,
        feedback: {
          strengths: ['Clear communication', 'Technical depth'],
          weaknesses: ['Could improve on follow-up questions'],
          fillerWords: { um: 3, like: 2, ah: 1 }
        }
      }
    })
  }

  if (timeRemaining === 0 || !isInterviewActive) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-secondary via-secondary to-slate-900 flex items-center justify-center p-4">
        <div className="max-w-md text-center">
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-white mb-2">Interview Ended</h2>
            <p className="text-gray-400">Your interview time has finished.</p>
          </div>
          <button
            onClick={handleEndInterview}
            className="w-full py-3 bg-primary text-white font-bold rounded-lg hover:bg-blue-700 transition"
          >
            View Results
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary via-secondary to-slate-900 p-4">
      <div className="max-w-7xl mx-auto h-screen flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-primary/20">
          <div>
            <h1 className="text-2xl font-bold text-white">AI Interview Session</h1>
            <p className="text-gray-400">React Developer - Mid Level</p>
          </div>
          <div className="flex items-center gap-4">
            {showStressIndicator && <StressIndicator level={stressLevel} />}
            <Timer timeRemaining={timeRemaining} />
            <button
              onClick={handleEndInterview}
              className="p-2 bg-danger/20 text-danger rounded-lg hover:bg-danger/30 transition"
              title="End interview"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-hidden">
          {/* Question Section */}
          <div className="lg:col-span-1 overflow-y-auto">
            <QuestionCard question={currentQuestion} />
          </div>

          {/* Chat/Conversation Section */}
          <div className="lg:col-span-2 flex flex-col">
            <ChatInterface messages={messages} />

            {/* Response Input Area */}
            <div className="mt-auto pt-6 space-y-4">
              {/* Voice Input */}
              <div className="flex gap-3">
                <VoiceInput
                  isListening={isListening}
                  onToggle={() => setIsListening(!isListening)}
                  onTranscript={(text) => setUserResponse(text)}
                />
                <button
                  onClick={() => setShowStressIndicator(!showStressIndicator)}
                  className="px-4 py-2 bg-slate-700/50 text-gray-300 rounded-lg hover:bg-slate-700 transition text-sm"
                >
                  {showStressIndicator ? 'Hide' : 'Show'} Stress
                </button>
              </div>

              {/* Text Input */}
              <div className="flex gap-3">
                <input
                  type="text"
                  value={userResponse}
                  onChange={(e) => setUserResponse(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendResponse()}
                  placeholder="Type your response or use voice input..."
                  className="flex-1 px-4 py-3 bg-slate-700/50 border border-primary/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary transition"
                />
                <button
                  onClick={handleSendResponse}
                  disabled={!userResponse.trim()}
                  className="px-6 py-3 bg-primary text-white font-bold rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Send size={20} />
                  Send
                </button>
              </div>

              {/* Tip */}
              <p className="text-xs text-gray-500">
                💡 Tip: Speak naturally and take your time to formulate comprehensive answers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
