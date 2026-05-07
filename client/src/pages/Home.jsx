import React, { useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
  BsArrowRight,
  BsBarChart,
  BsBriefcase,
  BsCheck2Circle,
  BsFileEarmarkText,
  BsMic,
  BsPersonCheck,
  BsQuestionCircle,
  BsShieldCheck
} from 'react-icons/bs'

import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import AuthModel from '../components/AuthModel'
import Seo from '../components/Seo'
import { getVariant } from '../utils/experiments'
import { trackEvent } from '../utils/analytics'

const practiceCards = [
  {
    icon: <BsBriefcase size={20} />,
    title: 'Role-based interviews',
    desc: 'Practice for frontend, backend, product, analyst, HR, and custom roles with focused prompts.',
    action: 'Start practice',
    path: '/interview'
  },
  {
    icon: <BsFileEarmarkText size={20} />,
    title: 'Resume toolkit',
    desc: 'Build a clean resume, use professional templates, and export an ATS-friendly PDF.',
    action: 'Open builder',
    path: '/resume-builder'
  },
  {
    icon: <BsMic size={20} />,
    title: 'Communication practice',
    desc: 'Improve clarity, structure, and confidence with voice-enabled mock interview sessions.',
    action: 'Practice now',
    path: '/interview'
  },
  {
    icon: <BsBarChart size={20} />,
    title: 'Post-interview analytics',
    desc: 'Review scores, feedback, weak areas, and session history after each practice round.',
    action: 'View progress',
    path: '/history'
  }
]

const workflow = [
  'Choose role, experience level, question count, and interview type.',
  'Answer realistic questions with voice support and timer pressure.',
  'Review feedback, scores, and next steps after the session.'
]

const metrics = [
  { value: '4', label: 'Core practice tools' },
  { value: 'PDF', label: 'Exportable reports' },
  { value: '24/7', label: 'On-demand prep' }
]

const faqs = [
  {
    question: 'What can I practice?',
    answer: 'You can practice technical interviews, HR interviews, resume-based interviews, and communication-focused rounds.'
  },
  {
    question: 'Does it use my resume?',
    answer: 'Yes. You can upload a resume so the interview questions can reflect your projects, skills, and background.'
  },
  {
    question: 'What do I get after the interview?',
    answer: 'You get a performance report with scores, strengths, weak areas, answer feedback, and practical next steps.'
  }
]

function Home() {
  const { userData } = useSelector((state) => state.user)
  const [showAuth, setShowAuth] = useState(false)
  const navigate = useNavigate()
  const primaryCta = useMemo(() => getVariant('homeCta') || 'Start free practice', [])

  const handleProtectedNavigation = (path) => {
    trackEvent('cta_clicked', { path, source: 'home' })

    if (!userData) {
      setShowAuth(true)
      return
    }

    navigate(path)
  }

  return (
    <div className='min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-white'>
      <Seo
        title='AI Interview Prep'
        description='Prepare for interviews with realistic AI mock interviews, adaptive follow-up questions, resume-aware prompts, analytics, and downloadable reports.'
        keywords='AI interview prep, mock interview practice, technical interview practice, HR interview questions, resume builder'
      />

      <div className='flex min-h-screen flex-col'>
        <Navbar />

        <main className='flex-1'>
          <section className='border-b border-slate-200 bg-white dark:border-white/10 dark:bg-slate-950'>
            <div className='mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-20'>
              <div>
                <div className='inline-flex items-center gap-2 rounded-md border border-teal-200 bg-teal-50 px-3 py-2 text-sm font-medium text-teal-700 dark:border-teal-500/30 dark:bg-teal-500/10 dark:text-teal-300'>
                  <BsShieldCheck size={16} />
                  AI practice studio for job interviews
                </div>

                <h1 className='mt-6 max-w-3xl text-4xl font-semibold leading-tight tracking-tight text-slate-950 dark:text-white sm:text-5xl lg:text-6xl'>
                  Practice interviews, improve answers, and track progress.
                </h1>

                <p className='mt-5 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300 sm:text-lg'>
                  InterviewArc helps candidates run realistic mock interviews, prepare resumes, and review clear feedback without a complicated workflow.
                </p>

                <div className='mt-8 flex flex-col gap-3 sm:flex-row'>
                  <button
                    onClick={() => handleProtectedNavigation('/interview')}
                    className='inline-flex items-center justify-center gap-2 rounded-md bg-teal-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-700'
                  >
                    {primaryCta}
                    <BsArrowRight size={16} />
                  </button>

                  <button
                    onClick={() => handleProtectedNavigation('/resume-builder')}
                    className='inline-flex items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-950 dark:border-white/15 dark:bg-slate-900 dark:text-slate-200'
                  >
                    Build resume
                    <BsFileEarmarkText size={16} />
                  </button>
                </div>

                <div className='mt-8 grid max-w-2xl gap-3 sm:grid-cols-3'>
                  {metrics.map((item) => (
                    <div key={item.label} className='rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-slate-900'>
                      <p className='text-2xl font-semibold text-slate-950 dark:text-white'>{item.value}</p>
                      <p className='mt-1 text-sm text-slate-500 dark:text-slate-400'>{item.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className='rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-slate-900 sm:p-6'>
                <div className='rounded-lg border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-slate-950'>
                  <div className='flex items-start justify-between gap-4'>
                    <div>
                      <p className='text-sm font-medium uppercase tracking-[0.18em] text-teal-700 dark:text-teal-300'>Practice session</p>
                      <h2 className='mt-3 text-2xl font-semibold text-slate-950 dark:text-white'>Frontend Developer Interview</h2>
                      <p className='mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400'>
                        Technical round with role-specific questions and guided review.
                      </p>
                    </div>
                    <div className='rounded-md bg-teal-50 p-3 text-teal-700 dark:bg-teal-500/10 dark:text-teal-300'>
                      <BsPersonCheck size={22} />
                    </div>
                  </div>

                  <div className='mt-6 grid gap-3'>
                    {workflow.map((item, index) => (
                      <div key={item} className='flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-slate-900'>
                        <span className='flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-teal-600 text-sm font-semibold text-white'>
                          {index + 1}
                        </span>
                        <p className='text-sm leading-6 text-slate-600 dark:text-slate-300'>{item}</p>
                      </div>
                    ))}
                  </div>

                  <div className='mt-6 rounded-lg border border-teal-200 bg-teal-50 p-4 dark:border-teal-500/20 dark:bg-teal-500/10'>
                    <p className='text-sm font-semibold text-slate-950 dark:text-white'>After the session</p>
                    <p className='mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300'>
                      Get answer feedback, communication notes, confidence signals, and a clear improvement plan.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className='mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16'>
            <div className='max-w-2xl'>
              <p className='text-sm font-semibold uppercase tracking-[0.18em] text-teal-700 dark:text-teal-300'>Core features</p>
              <h2 className='mt-3 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-4xl'>
                Everything needed for focused interview preparation.
              </h2>
              <p className='mt-4 text-base leading-7 text-slate-600 dark:text-slate-300'>
                Simple tools for practice, resume readiness, communication, and feedback.
              </p>
            </div>

            <div className='mt-8 grid gap-4 md:grid-cols-2'>
              {practiceCards.map((card) => (
                <button
                  key={card.title}
                  onClick={() => handleProtectedNavigation(card.path)}
                  className='group rounded-lg border border-slate-200 bg-white p-5 text-left transition hover:border-teal-300 hover:shadow-sm dark:border-white/10 dark:bg-slate-900 dark:hover:border-teal-500/50'
                >
                  <div className='flex items-start justify-between gap-4'>
                    <div className='rounded-md bg-teal-50 p-3 text-teal-700 dark:bg-teal-500/10 dark:text-teal-300'>
                      {card.icon}
                    </div>
                    <BsArrowRight className='mt-2 text-slate-400 transition group-hover:translate-x-1 group-hover:text-teal-700' size={18} />
                  </div>
                  <h3 className='mt-5 text-xl font-semibold text-slate-950 dark:text-white'>{card.title}</h3>
                  <p className='mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300'>{card.desc}</p>
                  <p className='mt-5 text-sm font-semibold text-teal-700 dark:text-teal-300'>{card.action}</p>
                </button>
              ))}
            </div>
          </section>

          <section className='border-y border-slate-200 bg-white dark:border-white/10 dark:bg-slate-900'>
            <div className='mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[0.9fr_1.1fr] lg:items-start'>
              <div>
                <p className='text-sm font-semibold uppercase tracking-[0.18em] text-teal-700 dark:text-teal-300'>Interview workflow</p>
                <h2 className='mt-3 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-4xl'>
                  A cleaner loop from setup to feedback.
                </h2>
                <p className='mt-4 text-base leading-7 text-slate-600 dark:text-slate-300'>
                  The product stays focused on the main job: practice under pressure, then understand what to improve.
                </p>
              </div>

              <div className='grid gap-3'>
                {workflow.map((item, index) => (
                  <div key={item} className='rounded-lg border border-slate-200 bg-slate-50 p-5 dark:border-white/10 dark:bg-slate-950'>
                    <div className='flex items-start gap-4'>
                      <span className='flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-slate-950 text-sm font-semibold text-white dark:bg-white dark:text-slate-950'>
                        {index + 1}
                      </span>
                      <p className='text-sm leading-7 text-slate-600 dark:text-slate-300'>{item}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className='mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16'>
            <div className='grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start'>
              <div>
                <p className='text-sm font-semibold uppercase tracking-[0.18em] text-teal-700 dark:text-teal-300'>FAQs</p>
                <h2 className='mt-3 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-4xl'>
                  Clear answers before you start.
                </h2>
              </div>

              <div className='grid gap-3'>
                {faqs.map((item) => (
                  <div key={item.question} className='rounded-lg border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-slate-900'>
                    <div className='flex items-start gap-3'>
                      <BsQuestionCircle className='mt-1 shrink-0 text-teal-700 dark:text-teal-300' size={18} />
                      <div>
                        <h3 className='font-semibold text-slate-950 dark:text-white'>{item.question}</h3>
                        <p className='mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300'>{item.answer}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className='mx-auto max-w-6xl px-4 pb-14 sm:px-6 sm:pb-20'>
            <div className='rounded-lg bg-slate-950 p-6 text-white sm:p-8 lg:flex lg:items-center lg:justify-between lg:gap-8'>
              <div className='max-w-2xl'>
                <p className='text-sm font-semibold uppercase tracking-[0.18em] text-teal-300'>Ready to practice</p>
                <h2 className='mt-3 text-3xl font-semibold tracking-tight sm:text-4xl'>
                  Start a focused interview round today.
                </h2>
                <p className='mt-4 text-sm leading-7 text-slate-300'>
                  Set your role, answer realistic questions, and use the report to improve the next attempt.
                </p>
              </div>

              <button
                onClick={() => handleProtectedNavigation('/interview')}
                className='mt-6 inline-flex w-full items-center justify-center gap-2 rounded-md bg-teal-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-400 sm:w-auto lg:mt-0'
              >
                Start interview
                <BsArrowRight size={16} />
              </button>
            </div>
          </section>
        </main>

        {showAuth && <AuthModel onClose={() => setShowAuth(false)} />}

        <Footer />
      </div>
    </div>
  )
}

export default Home
