import React, { useMemo, useState } from 'react'
import Navbar from '../components/Navbar'
import { useSelector } from 'react-redux'
// eslint-disable-next-line no-unused-vars
import { motion } from 'motion/react'
import {
  BsArrowRight,
  BsBarChart,
  BsCheck2Circle,
  BsClock,
  BsFileEarmarkText,
  BsGraphUpArrow,
  BsMic,
  BsRobot,
  BsStars
} from 'react-icons/bs'
import { HiSparkles } from 'react-icons/hi'
import { useNavigate } from 'react-router-dom'
import AuthModel from '../components/AuthModel'
import hrImg from '../assets/HR.png'
import techImg from '../assets/tech.png'
import confidenceImg from '../assets/confi.png'
import creditImg from '../assets/credit.png'
import evalImg from '../assets/ai-ans.png'
import resumeImg from '../assets/resume.png'
import pdfImg from '../assets/pdf.png'
import analyticsImg from '../assets/history.png'
import Footer from '../components/Footer'
import Seo from '../components/Seo'
import { getVariant } from '../utils/experiments'
import { trackEvent } from '../utils/analytics'

const stats = [
  { value: '24/7', label: 'On-demand mock interviews' },
  { value: 'AI', label: 'Follow-up questions in real time' },
  { value: 'PDF', label: 'Reports you can revisit anytime' }
]

const interviewSteps = [
  {
    icon: <BsRobot size={22} />,
    step: '01',
    title: 'Set your target role',
    desc: 'Choose the role, experience level, and interview style you want to practice so the session feels relevant from the first question.'
  },
  {
    icon: <BsMic size={22} />,
    step: '02',
    title: 'Answer like it is the real round',
    desc: 'Talk through behavioral and technical prompts while the AI reacts with intelligent follow-up questions and momentum-building feedback.'
  },
  {
    icon: <BsClock size={22} />,
    step: '03',
    title: 'Review what to improve next',
    desc: 'Get a concise breakdown of confidence, clarity, communication, and technical depth so each new session is more focused.'
  }
]

const featureCards = [
  {
    image: evalImg,
    icon: <BsBarChart size={18} />,
    title: 'Answer evaluation that feels actionable',
    desc: 'Spot where your answers are clear, where they drift, and how to improve delivery without guessing.'
  },
  {
    image: resumeImg,
    icon: <BsFileEarmarkText size={18} />,
    title: 'Resume-aware question generation',
    desc: 'Upload your resume and practice questions that match your projects, tools, and claimed experience.'
  },
  {
    image: pdfImg,
    icon: <BsCheck2Circle size={18} />,
    title: 'Downloadable performance reports',
    desc: 'Keep a clean PDF summary of strengths, weak spots, and next steps after each interview session.'
  },
  {
    image: analyticsImg,
    icon: <BsGraphUpArrow size={18} />,
    title: 'Progress tracking over time',
    desc: 'Compare past sessions, identify trends, and practice with much better intention instead of repeating the same mistakes.'
  }
]

const interviewModes = [
  {
    img: hrImg,
    title: 'HR practice mode',
    desc: 'Rehearse communication-heavy questions, storytelling, culture fit, and professional tone.',
    accent: 'from-emerald-100 to-white'
  },
  {
    img: techImg,
    title: 'Technical interview mode',
    desc: 'Train with deeper role-specific prompts that pressure-test your reasoning and subject knowledge.',
    accent: 'from-cyan-100 to-white'
  },
  {
    img: confidenceImg,
    title: 'Confidence signals',
    desc: 'Understand how clarity, pace, and self-assurance come across while you respond under pressure.',
    accent: 'from-lime-100 to-white'
  },
  {
    img: creditImg,
    title: 'Flexible credits system',
    desc: 'Unlock more sessions when you need them and keep practicing without changing your whole workflow.',
    accent: 'from-sky-100 to-white'
  }
]

const testimonials = [
  {
    quote: 'The follow-up questions forced me to stop memorizing and start answering like a real candidate. My Amazon behavioral loop felt much less scary.',
    name: 'Aarav Mehta',
    role: 'SDE candidate',
  },
  {
    quote: 'I used the reports after every mock and finally understood why my answers sounded vague. The next interview had much stronger examples.',
    name: 'Priya Nair',
    role: 'Product analyst',
  },
  {
    quote: 'The technical mode helped me explain tradeoffs instead of silently solving. That made a huge difference in system design practice.',
    name: 'Karan Shah',
    role: 'Backend developer',
  },
]

const companyLogos = ['Amazon', 'Google', 'Microsoft', 'Meta', 'Adobe', 'Flipkart']

function Home() {
  const { userData } = useSelector((state) => state.user)
  const [showAuth, setShowAuth] = useState(false)
  const navigate = useNavigate()
  const primaryCta = useMemo(() => getVariant('homeCta') || 'Start AI Interview', [])

  const handleProtectedNavigation = (path) => {
    trackEvent('cta_clicked', { path, source: 'home' })

    if (!userData) {
      setShowAuth(true)
      return
    }

    navigate(path)
  }

  return (
    <div className='relative min-h-screen overflow-hidden bg-[#f4fbfb] text-slate-900 dark:bg-slate-950 dark:text-white'>
      <Seo
        title='AI Interview Prep'
        description='Prepare for interviews with realistic AI mock interviews, adaptive follow-up questions, progress analytics, resume-aware prompts, and downloadable reports.'
        keywords='AI interview prep, mock interview practice, Amazon interview preparation, technical interview practice, HR interview questions'
      />
      <div className='pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,197,94,0.12),transparent_28%),radial-gradient(circle_at_top_right,rgba(43,218,237,0.16),transparent_32%),radial-gradient(circle_at_bottom,rgba(15,23,42,0.04),transparent_40%)]' />
      <div className='pointer-events-none absolute left-[-120px] top-32 h-72 w-72 rounded-full bg-emerald-300/20 blur-3xl' />
      <div className='pointer-events-none absolute right-[-120px] top-24 h-80 w-80 rounded-full bg-cyan-300/20 blur-3xl' />

      <div className='relative z-10 flex min-h-screen flex-col'>
        <Navbar />

        <main className='flex-1 px-3 pb-16 pt-6 sm:px-4 sm:pb-20 sm:pt-8 md:px-6 md:pt-10'>
          <div className='mx-auto flex max-w-6xl flex-col gap-16 sm:gap-20 lg:gap-24'>
            <section className='grid items-center gap-8 sm:gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12'>
              <motion.div
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className='space-y-6 sm:space-y-8'
              >
                <div className='inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-4 py-2 text-sm text-emerald-700 shadow-sm backdrop-blur'>
                  <HiSparkles size={16} className='text-cyan-500' />
                  AI interview practice for real hiring pressure
                </div>

                <div className='space-y-5'>
                  <h1 className='max-w-3xl text-3xl font-semibold leading-tight text-slate-900 dark:text-white sm:text-4xl md:text-6xl'>
                    Turn interview prep into a
                    <span className='mx-1.5 mt-2 inline-block rounded-[1.35rem] bg-gradient-to-r from-emerald-500 to-cyan-400 px-4 py-1.5 text-white shadow-lg shadow-cyan-200/60 sm:mx-2 sm:mt-0 sm:rounded-[2rem] sm:px-5'>
                      repeatable system
                    </span>
                    with InterviewArc
                  </h1>

                  <p className='max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300 sm:text-lg sm:leading-8'>
                    Practice realistic interviews, get adaptive follow-up questions, and review feedback that tells you what to improve before the next round matters.
                  </p>
                </div>

                <div className='flex flex-col gap-4 sm:flex-row'>
                  <motion.button
                    onClick={() => handleProtectedNavigation('/interview')}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    className='inline-flex items-center justify-center gap-3 rounded-full bg-slate-950 px-7 py-4 text-sm font-medium text-white shadow-xl shadow-slate-900/10 transition hover:bg-slate-800'
                  >
                    {primaryCta}
                    <BsArrowRight size={18} />
                  </motion.button>

                  <motion.button
                    onClick={() => handleProtectedNavigation('/history')}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    className='inline-flex items-center justify-center gap-3 rounded-full border border-slate-200 bg-white/90 px-7 py-4 text-sm font-medium text-slate-700 shadow-sm transition hover:border-cyan-300 hover:text-slate-900'
                  >
                    View Performance
                    <BsBarChart size={17} />
                  </motion.button>
                </div>

                <div className='grid gap-3 sm:grid-cols-3 sm:gap-4'>
                  {stats.map((stat) => (
                    <div
                      key={stat.label}
                      className='rounded-[1.4rem] border border-white/70 bg-white/80 px-4 py-4 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.35)] backdrop-blur sm:rounded-3xl sm:px-5'
                    >
                      <div className='text-xl font-semibold text-slate-900 sm:text-2xl'>{stat.value}</div>
                      <p className='mt-1 text-sm leading-6 text-slate-500'>{stat.label}</p>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className='relative'
              >
                <div className='absolute inset-6 rounded-[2.5rem] bg-gradient-to-br from-emerald-200/60 to-cyan-200/60 blur-3xl' />
                <div className='relative overflow-hidden rounded-[1.6rem] border border-white/70 bg-slate-950 p-4 text-white shadow-[0_30px_80px_-25px_rgba(15,23,42,0.45)] sm:rounded-[2rem] sm:p-6'>
                  <div className='flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3'>
                    <div>
                      <p className='text-xs uppercase tracking-[0.24em] text-emerald-200/80'>Live interview flow</p>
                      <h2 className='mt-2 text-lg font-semibold sm:text-xl'>Built to help you think on your feet</h2>
                    </div>
                    <div className='rounded-2xl bg-emerald-400/15 p-3 text-emerald-200'>
                      <BsStars size={24} />
                    </div>
                  </div>

                  <div className='mt-6 grid gap-4 sm:grid-cols-2'>
                    <div className='rounded-2xl bg-white/6 p-5 ring-1 ring-white/10'>
                      <p className='text-sm text-slate-300'>Adaptive questioning</p>
                      <p className='mt-3 text-sm leading-7 text-slate-400'>
                        The interviewer shifts difficulty and asks follow-ups based on what you actually say.
                      </p>
                    </div>

                    <div className='rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-400 p-5 text-slate-950'>
                      <p className='text-sm font-medium'>Session snapshot</p>
                      <div className='mt-4 space-y-3'>
                        <div className='rounded-xl bg-white/80 px-4 py-3'>
                          <p className='text-xs uppercase tracking-[0.2em] text-slate-500'>Communication</p>
                          <p className='mt-1 text-lg font-semibold'>Clear and structured</p>
                        </div>
                        <div className='rounded-xl bg-slate-950/10 px-4 py-3'>
                          <p className='text-xs uppercase tracking-[0.2em] text-slate-700'>Next focus</p>
                          <p className='mt-1 text-lg font-semibold'>Sharpen examples with metrics</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className='mt-6 rounded-[1.35rem] border border-white/10 bg-white/5 p-4 sm:rounded-[1.75rem] sm:p-5'>
                    <div className='flex items-center justify-between gap-4'>
                      <div>
                        <p className='text-sm text-slate-300'>Why teams like this flow</p>
                        <h3 className='mt-1 text-lg font-semibold'>Fast feedback without losing realism</h3>
                      </div>
                      <div className='hidden rounded-full border border-white/10 px-4 py-2 text-xs uppercase tracking-[0.2em] text-slate-400 sm:block'>
                        InterviewArc
                      </div>
                    </div>

                    <div className='mt-5 space-y-3 text-sm text-slate-300'>
                      <div className='flex items-start gap-3'>
                        <BsCheck2Circle className='mt-0.5 text-emerald-300' size={18} />
                        Role-specific prompts that sound like actual interview rounds.
                      </div>
                      <div className='flex items-start gap-3'>
                        <BsCheck2Circle className='mt-0.5 text-emerald-300' size={18} />
                        Guided review so you know exactly what to fix next.
                      </div>
                      <div className='flex items-start gap-3'>
                        <BsCheck2Circle className='mt-0.5 text-emerald-300' size={18} />
                        Practice history and PDF reports for measurable growth.
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </section>

            <section className='space-y-8 sm:space-y-10'>
              <div className='grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-end'>
                <div>
                  <p className='mb-3 text-sm font-medium uppercase tracking-[0.26em] text-cyan-600 dark:text-cyan-300'>Social proof</p>
                  <h2 className='text-2xl font-semibold text-slate-900 dark:text-white sm:text-3xl md:text-4xl'>
                    12,000+ users prepared for interviews with InterviewArc
                  </h2>
                </div>
                <div className='grid grid-cols-2 gap-3 sm:grid-cols-3'>
                  {companyLogos.map((company) => (
                    <div key={company} className='flex h-14 items-center justify-center rounded-2xl border border-slate-100 bg-white text-sm font-semibold text-slate-500 shadow-sm dark:border-white/10 dark:bg-slate-900 dark:text-slate-300'>
                      {company}
                    </div>
                  ))}
                </div>
              </div>

              <div className='grid gap-4 md:grid-cols-3'>
                {testimonials.map((testimonial) => (
                  <figure key={testimonial.name} className='rounded-[1.6rem] border border-white/80 bg-white/85 p-5 shadow-[0_20px_60px_-35px_rgba(15,23,42,0.35)] dark:border-white/10 dark:bg-slate-900 sm:rounded-[2rem] sm:p-6'>
                    <blockquote className='text-sm leading-7 text-slate-600 dark:text-slate-300'>"{testimonial.quote}"</blockquote>
                    <figcaption className='mt-5 border-t border-slate-100 pt-4 dark:border-white/10'>
                      <p className='text-sm font-semibold text-slate-900 dark:text-white'>{testimonial.name}</p>
                      <p className='mt-1 text-xs uppercase tracking-[0.18em] text-slate-400'>{testimonial.role}</p>
                    </figcaption>
                  </figure>
                ))}
              </div>
            </section>

            <section className='space-y-8 sm:space-y-10'>
              <div className='flex flex-col items-start justify-between gap-6 md:flex-row md:items-end'>
                <div className='max-w-2xl'>
                  <p className='mb-3 text-sm font-medium uppercase tracking-[0.26em] text-emerald-600'>How it works</p>
                  <h2 className='text-2xl font-semibold text-slate-900 dark:text-white sm:text-3xl md:text-4xl'>
                    A cleaner prep loop from first question to final report
                  </h2>
                </div>
                <p className='max-w-xl text-sm leading-7 text-slate-500 dark:text-slate-300 sm:text-base'>
                  The experience is designed to reduce guesswork, keep the session realistic, and make the feedback useful right away.
                </p>
              </div>

              <div className='grid gap-4 sm:gap-6 lg:grid-cols-3'>
                {interviewSteps.map((item, index) => (
                  <motion.div
                    key={item.step}
                    initial={{ opacity: 0, y: 28 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className='group rounded-[1.6rem] border border-white/80 bg-white/85 p-5 shadow-[0_20px_60px_-35px_rgba(15,23,42,0.35)] transition hover:-translate-y-1 hover:shadow-[0_30px_80px_-35px_rgba(15,23,42,0.45)] dark:border-white/10 dark:bg-slate-900 sm:rounded-[2rem] sm:p-7'
                  >
                    <div className='flex items-center justify-between'>
                      <div className='rounded-2xl bg-gradient-to-br from-emerald-100 to-cyan-100 p-4 text-cyan-700'>
                        {item.icon}
                      </div>
                      <span className='text-sm font-medium text-slate-300 transition group-hover:text-slate-400'>
                        {item.step}
                      </span>
                    </div>

                    <h3 className='mt-6 text-xl font-semibold text-slate-900 dark:text-white sm:mt-8 sm:text-2xl'>{item.title}</h3>
                    <p className='mt-4 text-sm leading-7 text-slate-500 dark:text-slate-300'>{item.desc}</p>
                  </motion.div>
                ))}
              </div>
            </section>

            <section className='rounded-[1.8rem] border border-white/70 bg-white/70 p-4 shadow-[0_25px_80px_-40px_rgba(15,23,42,0.4)] backdrop-blur sm:rounded-[2.5rem] sm:p-6 md:p-10'>
              <div className='mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between'>
                <div className='max-w-2xl'>
                  <p className='mb-3 text-sm font-medium uppercase tracking-[0.26em] text-cyan-600'>Capabilities</p>
                  <h2 className='text-2xl font-semibold text-slate-900 sm:text-3xl md:text-4xl'>
                    Smart features that make practice feel less generic
                  </h2>
                </div>
                <p className='max-w-xl text-sm leading-7 text-slate-500 sm:text-base'>
                  Every feature is there to make interview practice more relevant, more realistic, and easier to learn from.
                </p>
              </div>

              <div className='grid gap-4 sm:gap-6 md:grid-cols-2'>
                {featureCards.map((item, index) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.45, delay: index * 0.08 }}
                    className='overflow-hidden rounded-[1.6rem] border border-slate-100 bg-white shadow-[0_20px_60px_-38px_rgba(15,23,42,0.45)] transition hover:-translate-y-1 hover:border-cyan-200 sm:rounded-[2rem]'
                  >
                    <div className='grid h-full gap-5 p-4 sm:gap-6 sm:p-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center'>
                      <div className='flex items-center justify-center rounded-[1.2rem] bg-gradient-to-br from-slate-50 to-cyan-50 p-4 sm:rounded-[1.5rem]'>
                        <img src={item.image} alt={item.title} className='max-h-52 w-full object-contain' />
                      </div>

                      <div>
                        <div className='mb-5 inline-flex rounded-2xl bg-gradient-to-r from-emerald-100 to-cyan-100 p-3 text-cyan-700'>
                          {item.icon}
                        </div>
                        <h3 className='text-xl font-semibold text-slate-900'>{item.title}</h3>
                        <p className='mt-3 text-sm leading-7 text-slate-500'>{item.desc}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>

            <section className='space-y-8 sm:space-y-10'>
              <div className='max-w-2xl'>
                <p className='mb-3 text-sm font-medium uppercase tracking-[0.26em] text-emerald-600'>Interview modes</p>
                <h2 className='text-2xl font-semibold text-slate-900 sm:text-3xl md:text-4xl'>
                  Choose the kind of pressure you want to practice with
                </h2>
              </div>

              <div className='grid gap-4 sm:gap-6 md:grid-cols-2'>
                {interviewModes.map((mode, index) => (
                  <motion.div
                    key={mode.title}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.45, delay: index * 0.08 }}
                    className={`overflow-hidden rounded-[1.6rem] border border-white/80 bg-gradient-to-br ${mode.accent} p-5 shadow-[0_20px_70px_-40px_rgba(15,23,42,0.45)] sm:rounded-[2rem] sm:p-7`}
                  >
                    <div className='flex h-full flex-col gap-8 sm:flex-row sm:items-center sm:justify-between'>
                      <div className='max-w-sm'>
                        <h3 className='text-xl font-semibold text-slate-900 sm:text-2xl'>{mode.title}</h3>
                        <p className='mt-3 text-sm leading-7 text-slate-600'>{mode.desc}</p>
                      </div>

                      <div className='flex justify-center sm:justify-end'>
                        <div className='rounded-[1.75rem] border border-white/80 bg-white/75 p-4 shadow-sm backdrop-blur'>
                          <img src={mode.img} alt={mode.title} className='h-28 w-28 object-contain md:h-32 md:w-32' />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>

            <motion.section
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5 }}
              className='overflow-hidden rounded-[1.8rem] bg-slate-950 px-4 py-8 text-white shadow-[0_30px_90px_-30px_rgba(15,23,42,0.6)] sm:rounded-[2.5rem] sm:px-6 sm:py-10 md:px-10'
            >
              <div className='flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between'>
                <div className='max-w-2xl'>
                  <p className='text-sm uppercase tracking-[0.26em] text-emerald-300'>Ready when you are</p>
                  <h2 className='mt-4 text-2xl font-semibold sm:text-3xl md:text-4xl'>
                    Practice the next interview before it becomes the one that decides everything
                  </h2>
                  <p className='mt-4 max-w-xl text-sm leading-7 text-slate-300'>
                    Start a session, revisit your performance history, and build confidence with a workflow that keeps improving every round.
                  </p>
                </div>

                <div className='flex flex-col gap-4 sm:flex-row'>
                  <motion.button
                    onClick={() => handleProtectedNavigation('/interview')}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    className='rounded-full bg-white px-7 py-4 text-sm font-medium text-slate-950 transition hover:bg-emerald-50'
                  >
                    Launch Interview
                  </motion.button>

                  <motion.button
                    onClick={() => handleProtectedNavigation('/history')}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    className='rounded-full border border-white/15 bg-white/5 px-7 py-4 text-sm font-medium text-white transition hover:bg-white/10'
                  >
                    Explore Analytics
                  </motion.button>
                </div>
              </div>
            </motion.section>
          </div>
        </main>

        {showAuth && <AuthModel onClose={() => setShowAuth(false)} />}

        <Footer />
      </div>
    </div>
  )
}

export default Home
