// eslint-disable-next-line no-unused-vars
import { motion } from 'motion/react'
import React, { useState } from 'react'
import {
  BsArrowLeft,
  BsArrowRight,
  BsBarChart,
  BsCheck2Circle,
  BsClockHistory,
  BsLightningCharge,
  BsRobot,
  BsShieldCheck
} from 'react-icons/bs'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { ServerUrl } from '../App'
import { useDispatch, useSelector } from 'react-redux'
import { setUserData } from '../redux/userSlice'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const plans = [
  {
    id: 'free',
    name: 'Free',
    price: 'INR 0',
    credits: 100,
    description: 'A lightweight starting point for first-time interview practice.',
    features: [
      '100 AI interview credits',
      'Basic performance summary',
      'Voice interview access',
      'Limited history tracking'
    ],
    accent: 'from-slate-100 to-white',
    label: 'Included',
    default: true
  },
  {
    id: 'basic',
    name: 'Starter Pack',
    price: 'INR 100',
    credits: 150,
    description: 'A focused upgrade for regular mock interview practice.',
    features: [
      '150 AI interview credits',
      'Detailed feedback',
      'Performance analytics',
      'Full interview history'
    ],
    accent: 'from-emerald-100 to-white',
    label: 'Popular'
  },
  {
    id: 'pro',
    name: 'Pro Pack',
    price: 'INR 500',
    credits: 650,
    description: 'The best fit for serious preparation ahead of active hiring rounds.',
    features: [
      '650 AI interview credits',
      'Advanced AI feedback',
      'Skill trend analysis',
      'Priority AI processing'
    ],
    accent: 'from-cyan-100 to-white',
    label: 'Best Value',
    highlight: true
  }
]

const valuePoints = [
  {
    icon: <BsRobot size={18} />,
    title: 'Realistic AI rounds',
    desc: 'Practice role-specific interviews that react to your answers.'
  },
  {
    icon: <BsBarChart size={18} />,
    title: 'Useful review loop',
    desc: 'See how your communication and technical depth improve over time.'
  },
  {
    icon: <BsShieldCheck size={18} />,
    title: 'Secure checkout',
    desc: 'Purchase credits through Razorpay only when you need more sessions.'
  }
]

function Pricing() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { userData } = useSelector((state) => state.user)

  const [selectedPlan, setSelectedPlan] = useState('pro')
  const [loadingPlan, setLoadingPlan] = useState(null)
  const [checkoutError, setCheckoutError] = useState('')

  const handlePayment = async (plan) => {
    try {
      setLoadingPlan(plan.id)
      setCheckoutError('')

      const amount = plan.id === 'basic' ? 100 : plan.id === 'pro' ? 500 : 0

      const result = await axios.post(
        ServerUrl + '/api/payment/order',
        {
          planId: plan.id,
          amount,
          credits: plan.credits
        },
        { withCredentials: true }
      )

      if (!window.Razorpay) {
        throw new Error('Razorpay checkout is not available right now.')
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: result.data.amount,
        currency: 'INR',
        name: 'InterviewArc',
        description: `${plan.name} - ${plan.credits} Credits`,
        order_id: result.data.id,
        handler: async function (response) {
          const verify = await axios.post(
            ServerUrl + '/api/payment/verify',
            response,
            { withCredentials: true }
          )

          dispatch(setUserData(verify.data.user))
          alert('Payment successful. Credits added!')
          navigate('/')
        },
        theme: {
          color: '#0f172a'
        }
      }

      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (error) {
      console.log(error)
      setCheckoutError('Checkout could not be started. Please try again in a moment.')
    } finally {
      setLoadingPlan(null)
    }
  }

  return (
    <div className='relative min-h-screen overflow-hidden bg-[#f4fbfb] text-slate-900'>
      <div className='pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,197,94,0.12),transparent_24%),radial-gradient(circle_at_top_right,rgba(43,218,237,0.16),transparent_30%),radial-gradient(circle_at_bottom,rgba(15,23,42,0.04),transparent_42%)]' />
      <div className='pointer-events-none absolute left-[-120px] top-20 h-72 w-72 rounded-full bg-emerald-300/20 blur-3xl' />
      <div className='pointer-events-none absolute right-[-120px] top-16 h-80 w-80 rounded-full bg-cyan-300/20 blur-3xl' />

      <div className='relative z-10 flex min-h-screen flex-col'>
        <Navbar />

        <main className='flex-1 px-4 pb-20 pt-8 md:px-6 md:pt-10'>
          <div className='mx-auto flex max-w-6xl flex-col gap-16'>
            <section className='grid items-start gap-10 lg:grid-cols-[1.05fr_0.95fr]'>
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
                  <BsLightningCharge size={15} className='text-cyan-500' />
                  Flexible credits for consistent interview prep
                </div>

                <h1 className='mt-6 max-w-3xl text-4xl font-semibold leading-tight md:text-6xl'>
                  Pick the plan that matches
                  <span className='mx-2 inline-block rounded-[2rem] bg-gradient-to-r from-emerald-500 to-cyan-400 px-5 py-1.5 text-white shadow-lg shadow-cyan-200/60'>
                    how often you practice
                  </span>
                </h1>

                <p className='mt-6 max-w-xl text-lg leading-8 text-slate-600'>
                  Start free, upgrade when you need more sessions, and keep your interview workflow moving without paying for more than you use.
                </p>

                <div className='mt-8 grid gap-4 sm:grid-cols-3'>
                  {valuePoints.map((point) => (
                    <div
                      key={point.title}
                      className='rounded-[1.75rem] border border-white/80 bg-white/75 px-5 py-5 shadow-[0_18px_60px_-40px_rgba(15,23,42,0.45)] backdrop-blur'
                    >
                      <div className='inline-flex rounded-2xl bg-gradient-to-br from-emerald-100 to-cyan-100 p-3 text-cyan-700'>
                        {point.icon}
                      </div>
                      <h2 className='mt-4 text-base font-semibold text-slate-900'>{point.title}</h2>
                      <p className='mt-2 text-sm leading-6 text-slate-500'>{point.desc}</p>
                    </div>
                  ))}
                </div>
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
                    <p className='text-xs uppercase tracking-[0.24em] text-emerald-300'>Account snapshot</p>
                    <h2 className='mt-3 text-2xl font-semibold'>Stay ready for the next round</h2>
                  </div>

                  <div className='grid gap-4 px-7 py-6 sm:grid-cols-2'>
                    <div className='rounded-[1.5rem] bg-white/6 p-5 ring-1 ring-white/10'>
                      <p className='text-sm text-slate-300'>Current credits</p>
                      <p className='mt-2 text-3xl font-semibold'>{userData?.credits || 0}</p>
                      <p className='mt-2 text-sm leading-6 text-slate-400'>
                        Each interview round uses credits, so topping up keeps practice uninterrupted.
                      </p>
                    </div>

                    <div className='rounded-[1.5rem] bg-gradient-to-br from-emerald-400 to-cyan-400 p-5 text-slate-950'>
                      <p className='text-sm font-medium'>Recommended today</p>
                      <p className='mt-2 text-2xl font-semibold'>
                        {plans.find((plan) => plan.id === selectedPlan)?.name}
                      </p>
                      <p className='mt-2 text-sm leading-6 text-slate-800'>
                        Selected plan gives you {plans.find((plan) => plan.id === selectedPlan)?.credits} credits for your next prep cycle.
                      </p>
                    </div>
                  </div>

                  <div className='px-7 pb-7'>
                    <div className='rounded-[1.75rem] border border-white/10 bg-white/5 p-5'>
                      <div className='flex items-start gap-3'>
                        <div className='rounded-xl bg-white/10 p-2 text-emerald-300'>
                          <BsClockHistory size={18} />
                        </div>
                        <div>
                          <p className='text-sm font-medium text-white'>Simple credit model</p>
                          <p className='mt-2 text-sm leading-7 text-slate-400'>
                            Use the free tier to get started, then choose a paid pack only when you want more interview sessions and richer practice history.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </section>

            <section className='space-y-8'>
              <div className='flex flex-col gap-4 md:flex-row md:items-end md:justify-between'>
                <div>
                  <p className='text-sm font-medium uppercase tracking-[0.26em] text-emerald-600'>Plans</p>
                  <h2 className='mt-3 text-3xl font-semibold text-slate-900 md:text-4xl'>
                    Clear options without checkout clutter
                  </h2>
                </div>

                <p className='max-w-xl text-base leading-7 text-slate-500'>
                  Pick a plan to compare value, then complete checkout only when you are ready. The free plan remains your starting tier.
                </p>
              </div>

              {checkoutError && (
                <div className='rounded-[1.75rem] border border-red-100 bg-red-50 px-5 py-4 text-sm text-red-600'>
                  {checkoutError}
                </div>
              )}

              <div className='grid gap-6 lg:grid-cols-3'>
                {plans.map((plan, index) => {
                  const isSelected = selectedPlan === plan.id

                  return (
                    <motion.div
                      key={plan.id}
                      initial={{ opacity: 0, y: 24 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.2 }}
                      transition={{ duration: 0.45, delay: index * 0.08 }}
                      whileHover={!plan.default ? { y: -6 } : undefined}
                      onClick={() => !plan.default && setSelectedPlan(plan.id)}
                      className={`relative overflow-hidden rounded-[2rem] border p-7 transition ${
                        isSelected
                          ? 'border-cyan-300 bg-white shadow-[0_28px_80px_-40px_rgba(15,23,42,0.55)]'
                          : 'border-white/80 bg-white/78 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.45)]'
                      } ${plan.default ? 'cursor-default' : 'cursor-pointer'}`}
                    >
                      <div className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${plan.accent}`} />

                      <div className='flex items-start justify-between gap-4'>
                        <div>
                          <div className='inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-slate-500'>
                            {plan.label}
                          </div>
                          <h3 className='mt-5 text-2xl font-semibold text-slate-900'>{plan.name}</h3>
                        </div>

                        {plan.highlight && (
                          <div className='rounded-full bg-gradient-to-r from-emerald-500 to-cyan-400 px-3 py-1 text-xs font-medium text-white shadow-md'>
                            Best Value
                          </div>
                        )}
                      </div>

                      <div className='mt-6'>
                        <p className='text-4xl font-semibold text-slate-900'>{plan.price}</p>
                        <p className='mt-2 text-sm text-slate-500'>{plan.credits} interview credits</p>
                      </div>

                      <p className='mt-5 text-sm leading-7 text-slate-500'>{plan.description}</p>

                      <div className='mt-6 space-y-3'>
                        {plan.features.map((feature) => (
                          <div key={feature} className='flex items-start gap-3'>
                            <div className='mt-0.5 rounded-full bg-emerald-50 p-1 text-emerald-600'>
                              <BsCheck2Circle size={14} />
                            </div>
                            <span className='text-sm leading-6 text-slate-600'>{feature}</span>
                          </div>
                        ))}
                      </div>

                      <div className='mt-8'>
                        {plan.default ? (
                          <div className='rounded-full border border-slate-200 bg-slate-50 px-4 py-3 text-center text-sm font-medium text-slate-500'>
                            Included to get you started
                          </div>
                        ) : (
                          <button
                            disabled={loadingPlan === plan.id}
                            onClick={(e) => {
                              e.stopPropagation()

                              if (!isSelected) {
                                setSelectedPlan(plan.id)
                                return
                              }

                              handlePayment(plan)
                            }}
                            className={`flex w-full items-center justify-center gap-2 rounded-full px-5 py-3.5 text-sm font-medium transition ${
                              isSelected
                                ? 'bg-slate-950 text-white hover:bg-slate-800'
                                : 'border border-slate-200 bg-white text-slate-700 hover:border-cyan-200 hover:text-slate-900'
                            } disabled:cursor-not-allowed disabled:opacity-70`}
                          >
                            {loadingPlan === plan.id
                              ? 'Processing...'
                              : isSelected
                                ? 'Proceed to Pay'
                                : 'Select Plan'}
                            {loadingPlan !== plan.id && <BsArrowRight size={15} />}
                          </button>
                        )}
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </section>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  )
}

export default Pricing
