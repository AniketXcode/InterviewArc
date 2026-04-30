import React, { useState } from 'react'
import { BsChatDots, BsSend, BsX } from 'react-icons/bs'
import { trackEvent } from '../utils/analytics'

function FeedbackWidget() {
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)

  const submitFeedback = (event) => {
    event.preventDefault()
    if (!message.trim()) return

    const feedback = {
      message: message.trim(),
      path: window.location.pathname,
      createdAt: new Date().toISOString(),
    }

    const saved = JSON.parse(localStorage.getItem('interviewarc:feedback') || '[]')
    localStorage.setItem('interviewarc:feedback', JSON.stringify([feedback, ...saved].slice(0, 20)))
    trackEvent('feedback_submitted', { path: feedback.path })
    setMessage('')
    setSent(true)
  }

  return (
    <div className='fixed bottom-4 right-4 z-50 sm:bottom-6 sm:right-6'>
      {open && (
        <form
          onSubmit={submitFeedback}
          className='mb-3 w-[min(22rem,calc(100vw-2rem))] rounded-3xl border border-slate-200 bg-white p-4 shadow-2xl shadow-slate-900/20 dark:border-white/10 dark:bg-slate-900'
        >
          <div className='flex items-start justify-between gap-3'>
            <div>
              <h2 className='text-sm font-semibold text-slate-900 dark:text-white'>Share feedback</h2>
              <p className='mt-1 text-xs leading-5 text-slate-500 dark:text-slate-300'>Tell us what would make interview prep better.</p>
            </div>
            <button type='button' onClick={() => setOpen(false)} className='rounded-full p-2 text-slate-400 transition hover:bg-slate-100 dark:hover:bg-white/10' aria-label='Close feedback'>
              <BsX size={18} />
            </button>
          </div>
          <textarea
            value={message}
            onChange={(event) => {
              setMessage(event.target.value)
              setSent(false)
            }}
            className='mt-4 min-h-28 w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-800 outline-none transition focus:border-cyan-300 dark:border-white/10 dark:bg-slate-950 dark:text-white'
            placeholder='Your suggestion...'
            aria-label='Feedback message'
          />
          <button type='submit' className='mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full bg-slate-950 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-950'>
            <BsSend size={15} />
            Send feedback
          </button>
          {sent && <p className='mt-3 text-center text-xs font-medium text-emerald-600 dark:text-emerald-300'>Thanks, feedback saved.</p>}
        </form>
      )}
      <button
        type='button'
        onClick={() => setOpen((current) => !current)}
        className='inline-flex h-12 w-12 items-center justify-center rounded-full bg-cyan-500 text-white shadow-xl shadow-cyan-500/30 transition hover:bg-cyan-600 focus:outline-none focus:ring-4 focus:ring-cyan-200'
        aria-label='Open feedback'
      >
        <BsChatDots size={20} />
      </button>
    </div>
  )
}

export default FeedbackWidget
