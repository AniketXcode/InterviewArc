import { useState, useEffect } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  Clock,
  AlertCircle,
  Send,
  X,
  Pause,
  Play,
  Copy,
  Check
} from 'lucide-react';

export default function InterviewRoom() {
  const [isListening, setIsListening] = useState(false);
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes
  const [stressLevel, setStressLevel] = useState(35);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      text: "Hello! I'm your AI interviewer. Let's start with a classic question. Tell me about yourself and your background.",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isPaused, setIsPaused] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev > 0 ? prev - 1 : 0);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      text: inputValue,
      timestamp: new Date()
    };

    setMessages([...messages, userMessage]);
    setInputValue('');

    // Simulate AI response
    setTimeout(() => {
      const aiMessage = {
        id: messages.length + 2,
        type: 'ai',
        text: 'That\'s a great response! Let me dig deeper. Can you tell me about a challenging project you worked on recently?',
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, aiMessage]);
    }, 1000);

    // Slightly increase stress on user message
    setStressLevel((prev) => Math.min(prev + 2, 100));
  };

  const handleVoiceInput = () => {
    setIsListening(!isListening);
    if (!isListening) {
      setTimeout(() => {
        const userMessage = {
          id: messages.length + 1,
          type: 'user',
          text: "I've worked on several projects, including a real-time analytics dashboard that processed millions of events.",
          timestamp: new Date()
        };
        setMessages([...messages, userMessage]);
        setIsListening(false);

        setTimeout(() => {
          const aiMessage = {
            id: messages.length + 2,
            type: 'ai',
            text: 'Impressive! Walk me through your architecture decisions for handling that scale.',
            timestamp: new Date()
          };
          setMessages((prev) => [...prev, aiMessage]);
        }, 1000);
      }, 2000);
    }
  };

  const handleEndInterview = () => {
    console.log('Ending interview');
    // Navigate to InterviewSummary
  };

  const copyQuestion = () => {
    const lastAIMessage = [...messages].reverse().find((m) => m.type === 'ai');
    if (lastAIMessage) {
      navigator.clipboard.writeText(lastAIMessage.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="h-screen bg-background text-text flex flex-col overflow-hidden">
      {/* Header */}
      <div className="sticky top-0 z-40 backdrop-blur-xl border-b border-border bg-background/80 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent"></div>
            <span className="font-bold text-lg hidden sm:inline">InterviewArc</span>
          </div>

          <div className="flex items-center gap-6">
            {/* Timer */}
            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              timeLeft < 300 ? 'bg-danger/10 text-danger' : 'bg-surface'
            }`}>
              <Clock size={18} />
              <span className="font-mono font-semibold">{formatTime(timeLeft)}</span>
            </div>

            {/* Pause Button */}
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="p-2 hover:bg-surface rounded-lg transition"
            >
              {isPaused ? <Play size={20} /> : <Pause size={20} />}
            </button>

            {/* End Interview Button */}
            <button
              onClick={handleEndInterview}
              className="p-2 hover:bg-danger/10 hover:text-danger rounded-lg transition"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden flex">
        {/* Left side: Question Card */}
        <div className="hidden lg:flex lg:w-1/3 flex-col bg-gradient-to-b from-surface/50 to-background border-r border-border p-6 gap-4">
          <div className="flex-1 overflow-y-auto">
            <div className="bg-surface border border-primary/30 rounded-2xl p-8 sticky top-0">
              <h3 className="text-sm font-semibold text-primary uppercase mb-4">Current Question</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <AlertCircle size={20} className="text-primary flex-shrink-0 mt-1" />
                  <p className="text-lg leading-relaxed">
                    {messages.filter((m) => m.type === 'ai').pop()?.text || 'Waiting for question...'}
                  </p>
                </div>
              </div>

              <button
                onClick={copyQuestion}
                className="mt-6 w-full p-3 rounded-lg border border-border hover:bg-surface transition flex items-center justify-center gap-2 text-sm"
              >
                {copied ? (
                  <>
                    <Check size={16} className="text-success" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy size={16} />
                    Copy Question
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Stress Level Indicator */}
          <div className="bg-surface border border-border rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold">Stress Level</h4>
              <span className="text-2xl font-bold text-accent">{stressLevel}%</span>
            </div>
            <div className="w-full bg-border rounded-full h-2">
              <div
                className={`h-2 rounded-full transition ${
                  stressLevel > 70 ? 'bg-danger' : stressLevel > 40 ? 'bg-warning' : 'bg-success'
                }`}
                style={{ width: `${stressLevel}%` }}
              ></div>
            </div>
            <p className="text-xs text-text-secondary mt-3">
              {stressLevel > 70 ? 'Take a deep breath, you got this!' : stressLevel > 40 ? 'You\'re doing well' : 'Great composure!'}
            </p>
          </div>
        </div>

        {/* Center: Chat Interface */}
        <div className="flex-1 flex flex-col">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-8 space-y-6">
            {messages.length === 0 ? (
              <div className="h-full flex items-center justify-center text-center">
                <div>
                  <Mic className="mx-auto mb-4 text-primary opacity-50" size={48} />
                  <h3 className="text-xl font-semibold">Ready to start?</h3>
                  <p className="text-text-secondary mt-2">Use voice or type your responses</p>
                </div>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-4 animate-slide-up ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-md rounded-2xl px-6 py-4 ${
                      message.type === 'user'
                        ? 'bg-gradient-to-r from-primary/30 to-accent/30 border border-primary/30'
                        : 'bg-surface border border-border'
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.text}</p>
                    <p className="text-xs text-text-tertiary mt-2">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Input Area */}
          <div className="sticky bottom-0 border-t border-border bg-background/80 backdrop-blur-xl px-4 sm:px-8 py-6">
            <div className="max-w-2xl mx-auto space-y-4">
              {/* Voice Input */}
              <div className="flex gap-3">
                <button
                  onClick={handleVoiceInput}
                  className={`flex-1 py-4 rounded-full font-semibold transition flex items-center justify-center gap-2 ${
                    isListening
                      ? 'bg-danger text-text'
                      : 'bg-gradient-to-r from-primary to-primary-light text-text hover:shadow-md-glass'
                  }`}
                >
                  {isListening ? (
                    <>
                      <MicOff size={20} />
                      <span>Stop Listening</span>
                      <div className="flex gap-1 ml-2">
                        <div className="w-1 h-3 bg-text rounded-full animate-pulse"></div>
                        <div className="w-1 h-3 bg-text rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-1 h-3 bg-text rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                    </>
                  ) : (
                    <>
                      <Mic size={20} />
                      <span className="hidden sm:inline">Speak Your Answer</span>
                      <span className="sm:hidden">Voice</span>
                    </>
                  )}
                </button>
              </div>

              {/* Text Input */}
              <div className="flex gap-3">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Or type your response..."
                  className="flex-1 bg-surface border border-border rounded-full px-6 py-3 text-text placeholder-text-tertiary focus:outline-none focus:border-primary transition"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim()}
                  className="p-3 rounded-full bg-gradient-to-r from-primary to-primary-light hover:shadow-md-glass disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <Send size={20} className="text-text" />
                </button>
              </div>

              <p className="text-xs text-text-tertiary text-center">
                Press Space or tap the mic to use voice recognition
              </p>
            </div>
          </div>
        </div>

        {/* Right side: Mobile Stress Level (on mobile only) */}
        <div className="lg:hidden flex items-end pb-6 pr-4">
          <div className="bg-surface border border-border rounded-xl p-4 w-24">
            <div className="text-xs text-text-secondary mb-2">Stress</div>
            <div className="text-2xl font-bold text-accent">{stressLevel}%</div>
            <Volume2 size={16} className="mt-2 text-primary" />
          </div>
        </div>
      </div>
    </div>
  );
}
