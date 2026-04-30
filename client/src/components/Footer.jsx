import React from 'react'
import { BsArrowUpRight, BsBarChart, BsFileEarmarkText, BsRobot } from 'react-icons/bs'
import { useNavigate } from 'react-router-dom'

function Footer() {
  const navigate = useNavigate()

  return (
    <div className='px-4 pb-8 pt-2 md:px-6 md:pb-10'>
      <div className='mx-auto w-full max-w-6xl overflow-hidden rounded-[2rem] border border-white/80 bg-white/78 shadow-[0_22px_70px_-40px_rgba(15,23,42,0.45)] backdrop-blur-xl'>
        <div className='grid gap-8 px-6 py-8 md:grid-cols-[1.2fr_0.8fr] md:px-8 md:py-10'>
          <div>
            <div className='flex items-center gap-3'>
              <div className='rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-400 p-3 text-white shadow-lg shadow-cyan-200/60'>
                <BsRobot size={18} />
              </div>

              <div>
                <h2 className='text-lg font-semibold text-slate-900'>InterviewArc AI</h2>
                <p className='text-xs uppercase tracking-[0.18em] text-slate-400'>Practice with direction</p>
              </div>
            </div>

            <p className='mt-5 max-w-xl text-sm leading-7 text-slate-500'>
              InterviewArc helps you rehearse realistic interviews, understand how your answers land, and improve with feedback that is actually easy to act on.
            </p>
          </div>

          <div className='grid gap-3 sm:grid-cols-2'>
            <button
              onClick={() => navigate('/interview')}
              className='flex items-center justify-between rounded-[1.5rem] border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white px-4 py-4 text-left transition hover:shadow-md'
            >
              <div>
                <p className='text-sm font-semibold text-slate-900'>Start Practice</p>
                <p className='mt-1 text-xs leading-5 text-slate-500'>Launch a new AI interview</p>
              </div>
              <BsArrowUpRight className='text-emerald-600' size={18} />
            </button>

            <button
              onClick={() => navigate('/history')}
              className='flex items-center justify-between rounded-[1.5rem] border border-cyan-100 bg-gradient-to-br from-cyan-50 to-white px-4 py-4 text-left transition hover:shadow-md'
            >
              <div>
                <p className='text-sm font-semibold text-slate-900'>See Progress</p>
                <p className='mt-1 text-xs leading-5 text-slate-500'>Review reports and history</p>
              </div>
              <BsBarChart className='text-cyan-600' size={18} />
            </button>

            <button
              onClick={() => navigate('/resources')}
              className='flex items-center justify-between rounded-[1.5rem] border border-slate-100 bg-gradient-to-br from-slate-50 to-white px-4 py-4 text-left transition hover:shadow-md dark:border-white/10 dark:from-slate-800 dark:to-slate-900'
            >
              <div>
                <p className='text-sm font-semibold text-slate-900 dark:text-white'>Read Guides</p>
                <p className='mt-1 text-xs leading-5 text-slate-500 dark:text-slate-300'>SEO interview resources</p>
              </div>
              <BsArrowUpRight className='text-slate-500 dark:text-slate-300' size={18} />
            </button>
          </div>
        </div>

        <div className='border-t border-slate-100 px-6 py-5 md:px-8'>
          <div className='flex flex-col gap-4 text-sm text-slate-500 md:flex-row md:items-center md:justify-between'>
            <div className='flex flex-wrap items-center gap-4'>
              <div className='inline-flex items-center gap-2 rounded-full bg-slate-50 px-3 py-1.5 text-xs uppercase tracking-[0.18em] text-slate-500'>
                <BsFileEarmarkText size={13} />
                AI feedback reports
              </div>

              <div className='inline-flex items-center gap-2 rounded-full bg-slate-50 px-3 py-1.5 text-xs uppercase tracking-[0.18em] text-slate-500'>
                <BsBarChart size={13} />
                Performance analytics
              </div>
            </div>

            <p className='text-xs text-slate-400'>
              Copyright {new Date().getFullYear()} InterviewArc. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Footer
