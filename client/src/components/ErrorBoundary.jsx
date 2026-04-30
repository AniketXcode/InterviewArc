import React from 'react'
import { BsArrowClockwise, BsHouseDoor } from 'react-icons/bs'
import { captureException } from '../utils/monitoring'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    captureException(error, { componentStack: info?.componentStack })
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <main className='flex min-h-screen items-center justify-center bg-slate-50 px-4 text-slate-900 dark:bg-slate-950 dark:text-white'>
        <section className='w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/10 dark:border-white/10 dark:bg-slate-900'>
          <p className='text-sm font-medium uppercase tracking-[0.22em] text-cyan-600 dark:text-cyan-300'>Something broke</p>
          <h1 className='mt-3 text-2xl font-semibold'>InterviewArc hit an unexpected error.</h1>
          <p className='mt-3 text-sm leading-7 text-slate-500 dark:text-slate-300'>
            Your whole app is still protected by this boundary. Refresh the page or head home to keep going.
          </p>
          <div className='mt-6 flex flex-col gap-3 sm:flex-row'>
            <button
              onClick={() => window.location.reload()}
              className='inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-950'
            >
              <BsArrowClockwise size={16} />
              Reload
            </button>
            <button
              onClick={() => {
                window.location.href = '/'
              }}
              className='inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 px-5 py-3 text-sm font-medium text-slate-700 transition hover:border-cyan-300 dark:border-white/10 dark:text-slate-200'
            >
              <BsHouseDoor size={16} />
              Home
            </button>
          </div>
        </section>
      </main>
    )
  }
}

export default ErrorBoundary
