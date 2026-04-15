import React, { useMemo, useState } from 'react'
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'motion/react'
import {
  BsArrowLeft,
  BsArrowRepeat,
  BsBarChart,
  BsCheck2Circle,
  BsMic,
  BsSliders,
  BsStars
} from 'react-icons/bs'
import { useNavigate } from 'react-router-dom'

import Step1SetUp from '../components/Step1SetUp'
import Step2Interview from '../components/Step2Interview'
import Step3Report from '../components/Step3Report'

const steps = [
  {
    id: 1,
    title: 'Setup',
    desc: 'Role, experience, mode, and resume context',
    icon: <BsSliders size={18} />
  },
  {
    id: 2,
    title: 'Interview',
    desc: 'Answer in real time with timer and voice support',
    icon: <BsMic size={18} />
  },
  {
    id: 3,
    title: 'Report',
    desc: 'Review scores, feedback, and next steps',
    icon: <BsBarChart size={18} />
  }
]

function InterviewPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [setupData, setSetupData] = useState(null)
  const [reportData, setReportData] = useState(null)

  const activeStep = steps.find((item) => item.id === step)
  const progressPercent = (step / steps.length) * 100

  const sessionHighlights = useMemo(() => {
    if (!setupData) {
      return []
    }

    return [
      setupData.role,
      setupData.experience,
      setupData.mode,
      setupData.questions?.length ? `${setupData.questions.length} questions` : null,
      setupData.interviewDuration ? `${setupData.interviewDuration} min session` : null
    ].filter(Boolean)
  }, [setupData])

  const handleRestart = () => {
    setSetupData(null)
    setReportData(null)
    setStep(1)
  }

  const renderStep = () => {
    if (step === 1) {
      return (
        <Step1SetUp
          isEmbedded
          onStart={(data) => {
            setSetupData(data)
            setReportData(null)
            setStep(2)
          }}
        />
      )
    }

    if (step === 2) {
      if (!setupData) {
        return (
          <div className='rounded-[2rem] border border-white/80 bg-white/78 px-6 py-12 text-center shadow-[0_20px_60px_-40px_rgba(15,23,42,0.45)] backdrop-blur'>
            <h2 className='text-2xl font-semibold text-slate-900'>No active interview session</h2>
            <p className='mx-auto mt-3 max-w-md text-sm leading-7 text-slate-500'>
              Start a new interview setup to generate questions and begin the live round.
            </p>
            <button
              onClick={handleRestart}
              className='mt-6 rounded-full bg-slate-950 px-6 py-3 text-sm font-medium text-white transition hover:bg-slate-800'
            >
              Start New Session
            </button>
          </div>
        )
      }

      return (
        <Step2Interview
          isEmbedded
          interviewData={setupData}
          onFinish={(report) => {
            setReportData(report)
            setStep(3)
          }}
        />
      )
    }

    return (
      <Step3Report
        isEmbedded
        report={reportData}
        onRestart={handleRestart}
      />
    )
  }

  return (
    <div className='relative min-h-screen overflow-hidden bg-[#eef5f4] text-slate-900'>
      <div className='pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(15,118,110,0.16),transparent_24%),radial-gradient(circle_at_top_right,rgba(14,165,233,0.14),transparent_30%),radial-gradient(circle_at_bottom,rgba(15,23,42,0.06),transparent_40%)]' />
      <div className='pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-[linear-gradient(180deg,rgba(2,6,23,0.06),transparent)]' />
      <div className='pointer-events-none absolute left-[-120px] top-20 h-72 w-72 rounded-full bg-teal-300/20 blur-3xl' />
      <div className='pointer-events-none absolute right-[-120px] top-16 h-80 w-80 rounded-full bg-sky-300/20 blur-3xl' />
      <div className='pointer-events-none absolute bottom-[-120px] left-1/3 h-80 w-80 rounded-full bg-emerald-200/20 blur-3xl' />

      <div className='relative z-10 px-3 py-4 sm:px-4 sm:py-5 md:px-6 md:py-6'>
        <div className='mx-auto max-w-7xl'>
          <div className='mb-5 flex flex-col gap-3 sm:mb-6 md:flex-row md:items-center md:justify-between'>
            <div className='flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center'>
              <button
                onClick={() => navigate('/')}
                className='inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/80 bg-white/80 px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm backdrop-blur transition hover:text-slate-900 sm:w-auto sm:justify-start'
              >
                <BsArrowLeft size={14} />
                Exit to home
              </button>

              <div className='inline-flex w-full items-center justify-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-4 py-2.5 text-sm text-emerald-700 shadow-sm backdrop-blur sm:w-auto sm:justify-start'>
                <BsStars size={15} className='text-cyan-500' />
                Guided interview flow
              </div>
            </div>

            {step === 3 && (
              <button
                onClick={handleRestart}
                className='inline-flex w-full items-center justify-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800 md:w-auto'
              >
                <BsArrowRepeat size={15} />
                Start another interview
              </button>
            )}
          </div>

          <div className='overflow-hidden rounded-[1.8rem] border border-white/90 bg-white/78 shadow-[0_35px_110px_-50px_rgba(15,23,42,0.45)] backdrop-blur-xl sm:rounded-[2.2rem]'>
            <div className='border-b border-white/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.86),rgba(247,250,252,0.82))] px-4 py-4 sm:px-5 sm:py-5 md:px-7 md:py-6'>
              <div className='flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between'>
                <div className='max-w-2xl'>
                  <p className='text-xs uppercase tracking-[0.26em] text-teal-700'>Interview workspace</p>
                  <h1 className='mt-3 text-2xl font-semibold leading-tight text-slate-900 sm:text-[2rem] md:text-4xl'>
                    {activeStep?.title === 'Setup'
                      ? 'Prepare a focused interview round'
                      : activeStep?.title === 'Interview'
                        ? 'Stay in the flow while the AI leads the round'
                        : 'Review your performance and next steps'}
                  </h1>
                  <p className='mt-3 max-w-xl text-sm leading-6 text-slate-500 sm:leading-7'>
                    {activeStep?.desc}
                  </p>
                </div>

                {sessionHighlights.length > 0 && (
                  <div className='-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 lg:mx-0 lg:flex-wrap lg:overflow-visible lg:px-0'>
                    {sessionHighlights.map((item) => (
                      <div
                        key={item}
                        className='shrink-0 rounded-full border border-slate-200 bg-white/90 px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.14em] text-slate-600 shadow-sm sm:text-xs'
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className='mt-6'>
                <div className='h-2 overflow-hidden rounded-full bg-slate-100'>
                  <div
                    className='h-full rounded-full bg-gradient-to-r from-teal-600 via-emerald-500 to-sky-400 transition-all duration-500'
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>

                <div className='mt-5 -mx-1 flex gap-3 overflow-x-auto px-1 pb-1 md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0'>
                  {steps.map((item) => {
                    const isActive = item.id === step
                    const isComplete = item.id < step

                    return (
                      <div
                        key={item.id}
                        className={`min-w-[250px] shrink-0 snap-start rounded-[1.35rem] border px-4 py-4 transition md:min-w-0 md:rounded-[1.6rem] ${
                          isActive
                            ? 'border-sky-200 bg-sky-50/80 shadow-[0_18px_45px_-35px_rgba(14,165,233,0.45)]'
                            : isComplete
                              ? 'border-emerald-100 bg-emerald-50/80'
                              : 'border-white/80 bg-white/82'
                        }`}
                      >
                        <div className='flex items-center gap-3'>
                          <div
                            className={`rounded-2xl p-3 ${
                              isActive
                                ? 'bg-cyan-500 text-white'
                                : isComplete
                                  ? 'bg-emerald-500 text-white'
                                  : 'bg-slate-100 text-slate-500'
                            }`}
                          >
                            {isComplete ? <BsCheck2Circle size={18} /> : item.icon}
                          </div>

                          <div>
                            <p className='text-sm font-semibold text-slate-900'>{item.title}</p>
                            <p className='mt-1 text-xs leading-5 text-slate-500'>{item.desc}</p>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            <div className='px-3 py-3 sm:px-4 sm:py-4 md:px-6 md:py-6 lg:px-7'>
              <AnimatePresence mode='wait'>
                <motion.div
                  key={step}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.35 }}
                >
                  {renderStep()}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InterviewPage
