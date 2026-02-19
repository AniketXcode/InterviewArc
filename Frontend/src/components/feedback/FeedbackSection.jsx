export default function FeedbackSection({ title, items, type = 'success', icon = '✓' }) {
  const baseColor = type === 'success' ? 'bg-success/10 border-success/30' : 'bg-warning/10 border-warning/30'
  const textColor = type === 'success' ? 'text-success' : 'text-warning'
  const itemColor = type === 'success' ? 'bg-success/20' : 'bg-warning/20'

  return (
    <div className={`rounded-2xl p-8 border ${baseColor}`}>
      <h3 className={`text-2xl font-bold ${textColor} mb-6`}>{title}</h3>
      
      <ul className="space-y-4">
        {items.map((item, index) => (
          <li key={index} className="flex items-start gap-4">
            <div className={`w-8 h-8 ${itemColor} rounded-full flex items-center justify-center flex-shrink-0 mt-0.5`}>
              <span className={`font-bold ${textColor}`}>{icon}</span>
            </div>
            <p className="text-gray-300 pt-0.5">{item}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
