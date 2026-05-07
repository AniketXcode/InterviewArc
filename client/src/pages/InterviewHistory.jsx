import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { ServerUrl } from '../App'
import { Joyride, STATUS } from 'react-joyride'
// eslint-disable-next-line no-unused-vars
import { motion } from 'motion/react'
import {
  BsArrowLeft,
  BsArrowRight,
  BsBarChart,
  BsCalendar3,
  BsCheck2Circle,
  BsClockHistory,
  BsFileEarmarkText,
  BsStars
} from 'react-icons/bs'
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer
} from 'recharts'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const statusFilters = ['all', 'completed', 'incompleted']
const modeFilters = ['all', 'HR', 'Technical']

function InterviewHistory() {
  const [interviews, setInterviews] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [modeFilter, setModeFilter] = useState('all')
  const { userData } = useSelector((state) => state.user)
  const navigate = useNavigate()

  const [runTour, setRunTour] = useState(false)

  useEffect(() => {
    const hasSeenTour = localStorage.getItem('hasSeenTour')
    if (!hasSeenTour) {
      setRunTour(true)
    }
  }, [])

  const handleJoyrideCallback = (data) => {
    const { status } = data
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      localStorage.setItem('hasSeenTour', 'true')
      setRunTour(false)
    }
  }

  const tourSteps = [
    {
      target: '.tour-filters',
      content: 'Here you can filter your past mock interviews by status or type.',
      disableBeacon: true,
    },
    {
      target: '.tour-streak',
      content: 'Your activity streak! Keep practicing consistently to maintain your fire.',
    },
    {
      target: '.tour-radar',
      content: 'This radar chart maps your AI-evaluated traits across all sessions so you know exactly what to improve!',
    }
  ]

  useEffect(() => {
    const getMyInterviews = async () => {
      try {
        setIsLoading(true)
        setError('')

        const result = await axios.get(
          ServerUrl + '/api/interview/get-interview',
          { withCredentials: true }
        )

        setInterviews(result.data)
      } catch (fetchError) {
        console.log(fetchError)
        setError('Could not load your interview history right now.')
      } finally {
        setIsLoading(false)
      }
    }

    getMyInterviews()
  }, [])

  const filteredInterviews = interviews.filter((item) => {
    const normalizedStatus = item.status?.toLowerCase()
    const statusMatches =
      statusFilter === 'all' ? true : normalizedStatus === statusFilter
    const modeMatches = modeFilter === 'all' ? true : item.mode === modeFilter

    return statusMatches && modeMatches
  })

  const completedInterviews = interviews.filter(
    (item) => item.status?.toLowerCase() === 'completed'
  )
  const averageScore = completedInterviews.length
    ? (
      completedInterviews.reduce(
        (total, item) => total + Number(item.finalScore || 0),
        0
      ) / completedInterviews.length
    ).toFixed(1)
    : '0.0'
  const lineChartData = [...completedInterviews].reverse().map((item, index) => ({
    name: `Int ${index + 1}`,
    score: Number(item.finalScore?.toFixed(1) || 0)
  }))

  let avgConf = 0, avgComm = 0, avgCorr = 0;
  if (completedInterviews.length) {
    avgConf = completedInterviews.reduce((acc, curr) => acc + (curr.finalConfidence || 0), 0) / completedInterviews.length;
    avgComm = completedInterviews.reduce((acc, curr) => acc + (curr.finalCommunication || 0), 0) / completedInterviews.length;
    avgCorr = completedInterviews.reduce((acc, curr) => acc + (curr.finalCorrectness || 0), 0) / completedInterviews.length;
  }

  const radarData = [
    { subject: 'Confidence', score: Number(avgConf.toFixed(1)), fullMark: 10 },
    { subject: 'Communication', score: Number(avgComm.toFixed(1)), fullMark: 10 },
    { subject: 'Correctness', score: Number(avgCorr.toFixed(1)), fullMark: 10 }
  ];

  const summaryCards = [
    {
      title: 'Total sessions',
      value: interviews.length,
      desc: 'All interviews saved to your account',
      icon: <BsFileEarmarkText size={18} />
    },
    {
      title: 'Completed rounds',
      value: completedInterviews.length,
      desc: 'Sessions with a finished score',
      icon: <BsCheck2Circle size={18} />
    },
    {
      title: 'Average score',
      value: `${averageScore}/10`,
      desc: 'Across completed interview reports',
      icon: <BsBarChart size={18} />
    },
    {
      title: 'Current activity streak',
      value: `${userData?.streak?.current || 0} ${userData?.streak?.current === 1 ? 'day' : 'days'}`,
      desc: 'Consistency is key to mastering interviews',
      icon: <BsStars size={18} />
    }
  ]

  const getStatusLabel = (status) => {
    const normalized = status?.toLowerCase()
    return normalized === 'completed' ? 'Completed' : 'In Progress'
  }

  const getStatusClasses = (status) => {
    const normalized = status?.toLowerCase()
    return normalized === 'completed'
      ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
      : 'bg-amber-50 text-amber-700 border-amber-100'
  }

  return (
    <div className='relative min-h-screen overflow-hidden bg-[#f4fbfb] text-slate-900'>
      <Joyride
        steps={tourSteps}
        run={runTour}
        continuous
        showProgress
        showSkipButton
        callback={handleJoyrideCallback}
        styles={{
          options: {
            primaryColor: '#10b981',
            zIndex: 1000,
          }
        }}
      />
      <div className='pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,197,94,0.12),transparent_24%),radial-gradient(circle_at_top_right,rgba(43,218,237,0.16),transparent_30%),radial-gradient(circle_at_bottom,rgba(15,23,42,0.04),transparent_42%)]' />
      <div className='pointer-events-none absolute left-[-120px] top-20 h-72 w-72 rounded-full bg-emerald-300/20 blur-3xl' />
      <div className='pointer-events-none absolute right-[-120px] top-16 h-80 w-80 rounded-full bg-cyan-300/20 blur-3xl' />

      <div className='relative z-10 flex min-h-screen flex-col'>
        <Navbar />

        <main className='flex-1 px-4 pb-20 pt-8 md:px-6 md:pt-10'>
          <div className='mx-auto flex max-w-6xl flex-col gap-12'>
            <section className='grid items-start gap-8 lg:grid-cols-[1.05fr_0.95fr]'>
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className='max-w-2xl'
              >
                <button
                  onClick={() => navigate('/')}
                  className='inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/80 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm backdrop-blur transition hover:text-slate-900'
                >
                  <BsArrowLeft size={14} />
                  Back to home
                </button>

                <div className='mt-8 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-4 py-2 text-sm text-emerald-700 shadow-sm backdrop-blur'>
                  <BsStars size={15} className='text-cyan-500' />
                  Review interviews with a clearer progress view
                </div>

                <h1 className='mt-6 max-w-3xl text-4xl font-semibold leading-tight md:text-6xl'>
                  Track every round and
                  <span className='mx-2 inline-block rounded-[2rem] bg-gradient-to-r from-emerald-500 to-cyan-400 px-5 py-1.5 text-white shadow-lg shadow-cyan-200/60'>
                    spot what is improving
                  </span>
                </h1>

                <p className='mt-6 max-w-xl text-lg leading-8 text-slate-600'>
                  Revisit completed reports, see how often you are practicing, and jump back into any past interview with much less friction.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.08 }}
                className='relative'
              >
                <div className='absolute inset-6 rounded-[2.5rem] bg-gradient-to-br from-emerald-200/60 to-cyan-200/60 blur-3xl' />
                <div className='relative overflow-hidden rounded-[2.25rem] border border-white/80 bg-slate-950 text-white shadow-[0_30px_90px_-35px_rgba(15,23,42,0.6)]'>
                  <div className='border-b border-white/10 px-7 py-6'>
                    <p className='text-xs uppercase tracking-[0.24em] text-emerald-300'>History summary</p>
                    <h2 className='mt-3 text-2xl font-semibold'>A better view of your interview rhythm</h2>
                  </div>

                  <div className='grid gap-4 px-7 py-6 sm:grid-cols-2'>
                    {summaryCards.map((card, idx) => (
                      <div
                        key={card.title}
                        className={`rounded-[1.5rem] bg-white/6 p-5 ring-1 ring-white/10 ${idx === 3 ? 'tour-streak' : ''}`}
                      >
                        <div className='inline-flex rounded-xl bg-white/10 p-2 text-emerald-300'>
                          {card.icon}
                        </div>
                        <p className='mt-4 text-sm text-slate-300'>{card.title}</p>
                        <p className='mt-2 text-2xl font-semibold'>{card.value}</p>
                        <p className='mt-2 text-sm leading-6 text-slate-400'>{card.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </section>

            {completedInterviews.length > 0 && (
              <section className='grid items-start gap-8 lg:grid-cols-2'>
                <div className='rounded-[2.25rem] border border-white/80 bg-white/78 p-7 shadow-[0_30px_90px_-35px_rgba(15,23,42,0.6)] backdrop-blur'>
                  <div className='mb-6'>
                    <h3 className='text-lg font-semibold text-slate-900'>Score progression</h3>
                    <p className='mt-1 text-sm text-slate-500'>Your performance over time.</p>
                  </div>
                  <div className='h-[250px] w-full'>
                    <ResponsiveContainer width='100%' height='100%'>
                      <LineChart data={lineChartData} margin={{ top: 5, right: 30, left: -20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray='3 3' stroke='#e2e8f0' vertical={false} />
                        <XAxis dataKey='name' axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} domain={[0, 10]} />
                        <RechartsTooltip contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)' }} />
                        <Line type='monotone' dataKey='score' stroke='#10b981' strokeWidth={3} dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className='tour-radar rounded-[2.25rem] border border-white/80 bg-white/78 p-7 shadow-[0_30px_90px_-35px_rgba(15,23,42,0.6)] backdrop-blur'>
                  <div className='mb-2'>
                    <h3 className='text-lg font-semibold text-slate-900'>Skill traits mapping</h3>
                    <p className='mt-1 text-sm text-slate-500'>Average metrics across all sessions.</p>
                  </div>
                  <div className='h-[280px] w-full'>
                    <ResponsiveContainer width='100%' height='100%'>
                      <RadarChart cx='50%' cy='50%' outerRadius='75%' data={radarData}>
                        <PolarGrid stroke='#e2e8f0' />
                        <PolarAngleAxis dataKey='subject' tick={{ fontSize: 13, fill: '#334155', fontWeight: 500 }} />
                        <PolarRadiusAxis angle={30} domain={[0, 10]} tick={false} axisLine={false} />
                        <Radar name='Average Score' dataKey='score' stroke='#06b6d4' fill='#06b6d4' fillOpacity={0.4} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </section>
            )}

            <section className='space-y-6'>
              <div className='tour-filters rounded-[2rem] border border-white/80 bg-white/78 p-5 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.45)] backdrop-blur'>
                <div className='flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between'>
                  <div>
                    <p className='text-sm font-medium uppercase tracking-[0.26em] text-emerald-600'>Filters</p>
                    <h2 className='mt-2 text-2xl font-semibold text-slate-900'>Find the report you want faster</h2>
                  </div>

                  <div className='flex flex-col gap-4 md:flex-row'>
                    <div className='flex flex-wrap gap-2'>
                      {statusFilters.map((filter) => (
                        <button
                          key={filter}
                          onClick={() => setStatusFilter(filter)}
                          className={`rounded-full px-4 py-2 text-sm font-medium transition ${statusFilter === filter
                            ? 'bg-slate-950 text-white'
                            : 'border border-slate-200 bg-white text-slate-600 hover:text-slate-900'
                            }`}
                        >
                          {filter === 'all'
                            ? 'All status'
                            : filter === 'completed'
                              ? 'Completed'
                              : 'In progress'}
                        </button>
                      ))}
                    </div>

                    <div className='flex flex-wrap gap-2'>
                      {modeFilters.map((filter) => (
                        <button
                          key={filter}
                          onClick={() => setModeFilter(filter)}
                          className={`rounded-full px-4 py-2 text-sm font-medium transition ${modeFilter === filter
                            ? 'bg-cyan-500 text-white'
                            : 'border border-slate-200 bg-white text-slate-600 hover:text-slate-900'
                            }`}
                        >
                          {filter === 'all' ? 'All modes' : filter}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {isLoading ? (
                <div className='grid gap-5'>
                  {[1, 2, 3].map((item) => (
                    <div
                      key={item}
                      className='rounded-[2rem] border border-white/80 bg-white/70 p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.45)] backdrop-blur'
                    >
                      <div className='animate-pulse space-y-4'>
                        <div className='h-4 w-28 rounded-full bg-slate-200' />
                        <div className='h-7 w-52 rounded-full bg-slate-200' />
                        <div className='h-4 w-40 rounded-full bg-slate-100' />
                      </div>
                    </div>
                  ))}
                </div>
              ) : error ? (
                <div className='rounded-[2rem] border border-red-100 bg-red-50 px-6 py-5 text-sm text-red-600'>
                  {error}
                </div>
              ) : filteredInterviews.length === 0 ? (
                <div className='rounded-[2.25rem] border border-white/80 bg-white/78 px-6 py-12 text-center shadow-[0_24px_70px_-40px_rgba(15,23,42,0.45)] backdrop-blur'>
                  <div className='mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-100 to-cyan-100 text-cyan-700'>
                    <BsClockHistory size={24} />
                  </div>

                  <h3 className='mt-6 text-2xl font-semibold text-slate-900'>
                    {interviews.length === 0 ? 'No interviews yet' : 'No reports match these filters'}
                  </h3>

                  <p className='mx-auto mt-3 max-w-md text-sm leading-7 text-slate-500'>
                    {interviews.length === 0
                      ? 'Start your first AI interview and your report history will appear here.'
                      : 'Try a different status or mode filter to broaden the results.'}
                  </p>

                  <button
                    onClick={() => navigate('/interview')}
                    className='mt-8 inline-flex items-center gap-2 rounded-full bg-slate-950 px-6 py-3 text-sm font-medium text-white transition hover:bg-slate-800'
                  >
                    Start Interview
                    <BsArrowRight size={15} />
                  </button>
                </div>
              ) : (
                <div className='grid gap-5'>
                  {filteredInterviews.map((item, index) => (
                    <motion.div
                      key={item._id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.2 }}
                      transition={{ duration: 0.4, delay: index * 0.04 }}
                      onClick={() => navigate(`/report/${item._id}`)}
                      className='cursor-pointer overflow-hidden rounded-[2rem] border border-white/80 bg-white/80 shadow-[0_24px_70px_-40px_rgba(15,23,42,0.45)] transition hover:-translate-y-1 hover:border-cyan-200 hover:shadow-[0_30px_80px_-40px_rgba(15,23,42,0.5)]'
                    >
                      <div className='grid gap-6 p-6 lg:grid-cols-[1fr_auto] lg:items-center'>
                        <div>
                          <div className='flex flex-wrap items-center gap-3'>
                            <span className='rounded-full bg-slate-100 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-slate-500'>
                              {item.mode}
                            </span>
                            <span
                              className={`rounded-full border px-3 py-1 text-xs font-medium ${getStatusClasses(item.status)}`}
                            >
                              {getStatusLabel(item.status)}
                            </span>
                          </div>

                          <h3 className='mt-5 text-2xl font-semibold text-slate-900'>
                            {item.role}
                          </h3>

                          <div className='mt-3 flex flex-wrap items-center gap-4 text-sm text-slate-500'>
                            <span>{item.experience}</span>
                            <span className='text-slate-300'>/</span>
                            <span>
                              {new Date(item.createdAt).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                              })}
                            </span>
                          </div>
                        </div>

                        <div className='flex items-center gap-6 lg:justify-end'>
                          <div className='rounded-lg border border-slate-200 bg-slate-50 px-5 py-4 text-center dark:border-white/10 dark:bg-slate-950'>
                            <p className='text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400'>Score</p>
                            <p className='mt-2 text-2xl font-semibold text-slate-950 dark:text-white'>
                              {Number(item.finalScore || 0).toFixed(1)}/10
                            </p>
                          </div>

                          <div className='hidden items-center gap-2 rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 dark:border-white/10 dark:bg-slate-950 dark:text-slate-200 md:inline-flex'>
                            View Report
                            <BsArrowRight size={14} />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </section>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  )
}

export default InterviewHistory
