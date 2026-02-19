import { ChevronDown } from 'lucide-react'
import { useState } from 'react'

export default function RoleSelector({ roles, selectedRole, onRoleSelect }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 bg-slate-700/50 border border-primary/20 rounded-lg text-left text-white flex items-center justify-between hover:border-primary/50 transition"
      >
        <span>
          {selectedRole ? roles.find(r => r.value === selectedRole)?.label : 'Select a role'}
        </span>
        <ChevronDown size={20} className={`transition ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-slate-800 border border-primary/20 rounded-lg shadow-lg z-10">
          <div className="max-h-64 overflow-y-auto">
            {roles.map(role => (
              <button
                key={role.value}
                onClick={() => {
                  onRoleSelect(role.value)
                  setIsOpen(false)
                }}
                className={`w-full text-left px-4 py-3 hover:bg-primary/20 transition ${
                  selectedRole === role.value ? 'bg-primary/30 text-accent' : 'text-white'
                }`}
              >
                {role.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
