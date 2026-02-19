import { useEffect, useRef } from 'react'
import { Bot } from 'lucide-react'

export default function ChatInterface({ messages }) {
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-primary/20 flex flex-col h-full">
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-6 pr-2">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                message.type === 'user'
                  ? 'bg-primary text-white'
                  : 'bg-slate-700 text-gray-100 flex items-start gap-3'
              }`}
            >
              {message.type === 'ai' && (
                <Bot size={20} className="text-accent flex-shrink-0 mt-0.5" />
              )}
              <div>
                <p className="text-sm">{message.content}</p>
                <p className={`text-xs mt-1 ${
                  message.type === 'user' ? 'text-blue-100' : 'text-gray-400'
                }`}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Conversation Stats */}
      <div className="border-t border-primary/20 pt-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-xs text-gray-400">Messages</p>
            <p className="text-lg font-bold text-white">{messages.length}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-400">Response Time</p>
            <p className="text-lg font-bold text-accent">~2s avg</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-400">Engagement</p>
            <p className="text-lg font-bold text-primary">High</p>
          </div>
        </div>
      </div>
    </div>
  )
}
