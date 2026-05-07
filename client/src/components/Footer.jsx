import React from 'react'
import { BsArrowRight, BsBarChart, BsFileEarmarkText, BsRobot } from 'react-icons/bs'
import { useNavigate } from 'react-router-dom'

function Footer() {
  const navigate = useNavigate()

  return (
    <footer className='border-t border-slate-200 bg-white px-4 py-10 dark:border-white/10 dark:bg-slate-950 md:px-6'>
      <div className='mx-auto grid max-w-6xl gap-8 md:grid-cols-[1.2fr_0.8fr]'>
        <div>
          <div className='flex items-center gap-3'>
            <div className='rounded-lg bg-teal-600 p-3 text-white'>
              <BsRobot size={18} />
            </div>

            <div>
              <h2 className='text-lg font-semibold text-slate-950 dark:text-white'>InterviewArc</h2>
              <p className='text-xs uppercase tracking-[0.18em] text-slate-400'>AI interview prep</p>
            </div>
          </div>

          <p className='mt-5 max-w-xl text-sm leading-7 text-slate-600 dark:text-slate-300'>
            Practice realistic interviews, build better resumes, and use clear feedback to prepare with more direction.
          </p>
        </div>

        <div className='grid gap-3 sm:grid-cols-2'>
          <button
            onClick={() => navigate('/interview')}
            className='flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-4 py-4 text-left transition hover:border-teal-300 dark:border-white/10 dark:bg-slate-900'
          >
            <div>
              <p className='text-sm font-semibold text-slate-950 dark:text-white'>Start Practice</p>
              <p className='mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400'>Launch a new interview</p>
            </div>
            <BsArrowRight className='text-teal-700 dark:text-teal-300' size={18} />
          </button>

          <button
            onClick={() => navigate('/history')}
            className='flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-4 py-4 text-left transition hover:border-teal-300 dark:border-white/10 dark:bg-slate-900'
          >
            <div>
              <p className='text-sm font-semibold text-slate-950 dark:text-white'>See Progress</p>
              <p className='mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400'>Review reports</p>
            </div>
            <BsBarChart className='text-teal-700 dark:text-teal-300' size={18} />
          </button>
        </div>
      </div>

      <div className='mx-auto mt-8 flex max-w-6xl flex-col gap-4 border-t border-slate-200 pt-6 text-sm text-slate-500 dark:border-white/10 dark:text-slate-400 md:flex-row md:items-center md:justify-between'>
        <div className='flex flex-wrap items-center gap-4'>
          <span className='inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em]'>
            <BsFileEarmarkText size={13} />
            Resume toolkit
          </span>
          <span className='inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em]'>
            <BsBarChart size={13} />
            Interview analytics
          </span>
        </div>

        <p className='text-xs'>Copyright {new Date().getFullYear()} InterviewArc. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer
