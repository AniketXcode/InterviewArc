export default function DifficultySelector({ difficulties, selectedDifficulty, onDifficultySelect }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {difficulties.map(difficulty => (
        <button
          key={difficulty.value}
          onClick={() => onDifficultySelect(difficulty.value)}
          className={`p-6 rounded-lg border-2 transition transform hover:scale-105 ${
            selectedDifficulty === difficulty.value
              ? 'border-accent bg-accent/10'
              : 'border-primary/20 bg-slate-700/30 hover:border-primary/50'
          }`}
        >
          <h3 className="text-xl font-bold text-white mb-2">{difficulty.label}</h3>
          <p className="text-gray-400 text-sm">{difficulty.description}</p>
        </button>
      ))}
    </div>
  )
}
