import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { ServerUrl } from '../App'
import Step3Report from '../components/Step3Report'
// eslint-disable-next-line no-unused-vars
import { motion } from 'motion/react'
import { BsArrowRepeat, BsFileEarmarkText, BsStars } from 'react-icons/bs'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

function InterviewReport() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [report, setReport] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setIsLoading(true)
        setError('')

        const result = await axios.get(
          ServerUrl + '/api/interview/report/' + id,
          { withCredentials: true }
        )

        setReport(result.data)
      } catch (fetchError) {
        console.log(fetchError)
        setError('This interview report could not be loaded right now.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchReport()
  }, [id])

  return (
    <div className='relative min-h-screen overflow-hidden bg-[#f4fbfb] text-slate-900'>
      <div className='pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,197,94,0.12),transparent_24%),radial-gradient(circle_at_top_right,rgba(43,218,237,0.16),transparent_30%),radial-gradient(circle_at_bottom,rgba(15,23,42,0.04),transparent_42%)]' />
      <div className='pointer-events-none absolute left-[-120px] top-20 h-72 w-72 rounded-full bg-emerald-300/20 blur-3xl' />
      <div className='pointer-events-none absolute right-[-120px] top-16 h-80 w-80 rounded-full bg-cyan-300/20 blur-3xl' />

      <div className='relative z-10 flex min-h-screen flex-col'>
        <Navbar />

        <main className='flex-1 px-4 pb-20 pt-8 md:px-6 md:pt-10'>
          <div className='mx-auto flex max-w-6xl flex-col gap-8'>
            <motion.section
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className='rounded-[2.25rem] border border-white/80 bg-white/72 px-6 py-7 shadow-[0_30px_90px_-45px_rgba(15,23,42,0.5)] backdrop-blur-xl md:px-8'
            >
              <div className='flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between'>
                <div className='max-w-2xl'>
                  <div className='inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-4 py-2 text-sm text-emerald-700 shadow-sm backdrop-blur'>
                    <BsStars size={14} className='text-cyan-500' />
                    Saved interview report
                  </div>

                  <h1 className='mt-5 text-3xl font-semibold text-slate-900 md:text-4xl'>
                    Revisit a completed interview with clearer context
                  </h1>

                  <p className='mt-3 max-w-xl text-sm leading-7 text-slate-500'>
                    Review the full score breakdown, inspect question-level feedback, and export the report when you want to keep a copy.
                  </p>
                </div>

                <div className='flex flex-wrap gap-2'>
                  <div className='rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium uppercase tracking-[0.14em] text-slate-500'>
                    Report ID
                  </div>
                  <div className='rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium uppercase tracking-[0.14em] text-slate-500'>
                    {id?.slice(-8) || 'Unknown'}
                  </div>
                </div>
              </div>
            </motion.section>

            {isLoading ? (
              <div className='grid gap-6 lg:grid-cols-[0.9fr_1.1fr]'>
                <div className='space-y-6'>
                  {[1, 2].map((item) => (
                    <div
                      key={item}
                      className='rounded-[2rem] border border-white/80 bg-white/78 p-7 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.45)] backdrop-blur'
                    >
                      <div className='animate-pulse space-y-4'>
                        <div className='h-4 w-32 rounded-full bg-slate-200' />
                        <div className='h-10 w-28 rounded-full bg-slate-200' />
                        <div className='h-4 w-48 rounded-full bg-slate-100' />
                      </div>
                    </div>
                  ))}
                </div>

                <div className='rounded-[2rem] border border-white/80 bg-white/78 p-7 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.45)] backdrop-blur'>
                  <div className='animate-pulse space-y-5'>
                    <div className='h-5 w-40 rounded-full bg-slate-200' />
                    <div className='h-64 rounded-[1.5rem] bg-slate-100' />
                    <div className='h-24 rounded-[1.5rem] bg-slate-100' />
                  </div>
                </div>
              </div>
            ) : error ? (
              <div className='rounded-[2rem] border border-red-100 bg-red-50 px-6 py-10 text-center shadow-[0_20px_60px_-40px_rgba(15,23,42,0.2)]'>
                <div className='mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-red-500 shadow-sm'>
                  <BsFileEarmarkText size={22} />
                </div>
                <h2 className='mt-5 text-2xl font-semibold text-slate-900'>Report unavailable</h2>
                <p className='mx-auto mt-3 max-w-md text-sm leading-7 text-slate-600'>{error}</p>

                <div className='mt-8 flex flex-col justify-center gap-3 sm:flex-row'>
                  <button
                    onClick={() => navigate('/history')}
                    className='rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:text-slate-900'
                  >
                    Back to history
                  </button>

                  <button
                    onClick={() => window.location.reload()}
                    className='inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800'
                  >
                    <BsArrowRepeat size={15} />
                    Try again
                  </button>
                </div>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className='rounded-[2.25rem] border border-white/70 bg-white/52 shadow-[0_30px_90px_-45px_rgba(15,23,42,0.45)] backdrop-blur'
              >
                <Step3Report report={report} backPath='/history' />
              </motion.div>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </div>
  )
}

export default InterviewReport
