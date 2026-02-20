export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0a0a0f',
        surface: '#12121a',
        'surface-light': '#16162a',
        border: '#ffffff1a',
        'border-light': '#ffffff10',
        text: '#ffffff',
        'text-secondary': '#a8a8b8',
        'text-tertiary': '#7a7a8a',
        primary: '#6366f1',
        'primary-light': '#818cf8',
        accent: '#06b6d4',
        success: '#10b981',
        warning: '#f59e0b',
        danger: '#ef4444',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
        'gradient-accent': 'linear-gradient(135deg, #06b6d4 0%, #6366f1 100%)',
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'sm-glass': '0 8px 32px rgba(0, 0, 0, 0.1)',
        'md-glass': '0 8px 32px rgba(99, 102, 241, 0.1)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in',
        'slide-up': 'slideUp 0.4s ease-out',
        'pulse-soft': 'pulseSoft 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
    },
  },
  plugins: [],
}
