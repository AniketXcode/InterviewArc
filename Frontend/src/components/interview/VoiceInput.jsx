import { Mic, MicOff } from 'lucide-react'

export default function VoiceInput({ isListening, onToggle, onTranscript }) {
  const handleClick = () => {
    onToggle()
    // Simulate voice input - in production, use Web Speech API
    if (!isListening) {
      setTimeout(() => {
        onTranscript('I worked on a React project where I implemented a complex dashboard with real-time data visualization.')
      }, 2000)
    }
  }

  return (
    <button
      onClick={handleClick}
      className={`px-6 py-3 rounded-lg font-bold transition flex items-center gap-2 ${
        isListening
          ? 'bg-danger text-white animate-pulse'
          : 'bg-primary text-white hover:bg-blue-700'
      }`}
    >
      {isListening ? (
        <>
          <MicOff size={20} />
          Stop Recording
        </>
      ) : (
        <>
          <Mic size={20} />
          Start Speaking
        </>
      )}
    </button>
  )
}
